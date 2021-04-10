import React, { useCallback, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import { Dispatch } from "redux";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import MapBoxGL from "mapbox-gl";
import { selectZone } from "../store/ActionCreators";

type Props = {};

const KEY = "7y3DwqhCAc5Y7Wr95RR9";
const TOKEN =
  "pk.eyJ1Ijoic3RvbGJpdmkiLCJhIjoiY2tuOHg0N2UyMTF5bzJxcWRnb3huYWxjciJ9.DkRrWXvSJ2OFC6HMLANPAA";
const STYLE = "https://api.maptiler.com/maps/streets/style.json?key=" + KEY;
const DATA =
  "https://api.maptiler.com/data/00faea4c-94f8-437c-af5d-fc153669190f/features.json?key=" +
  KEY;
const SOURCE_ZONES = "zones-overlay";
const LAYER_ZONE_FILL = "zone-fill";

function updateFeature(
  map: MapBoxGL.Map,
  ref: React.MutableRefObject<number>,
  newValue: number,
  stateName: string
) {
  if (ref.current) {
    map.setFeatureState(
      {
        source: SOURCE_ZONES,
        id: ref.current,
      },
      {
        [stateName]: false,
      }
    );
  }
  ref.current = newValue;
  map.setFeatureState(
    {
      source: SOURCE_ZONES,
      id: newValue,
    },
    {
      [stateName]: true,
    }
  );
}

export const App: React.FC<Props> = ({}) => {
  const zoneState: ZoneState = useSelector(
    (state: ZoneState) => state,
    shallowEqual
  );
  const dispatch: Dispatch<any> = useDispatch();
  const mapElement = useRef<HTMLDivElement>(null);
  const hoveredId = useRef<number>(-1);
  const selectedId = useRef<number>(-1);

  const selectZoneDispatch = useCallback(
    (locationId: number) => {
      dispatch(selectZone(locationId));
    },
    [dispatch]
  );

  const onZoneSelect = useCallback((map: MapBoxGL.Map, e: any) => {
    if (e.features && e.features.length > 0) {
      let zone = e.features[0].properties as ZoneFeature;
      updateFeature(map, selectedId, zone.LocationID, "selected");
      selectZoneDispatch(zone.LocationID);
    }
  }, []);

  const onZoneHover = useCallback((map: MapBoxGL.Map, e: any) => {
    map.getCanvas().style.cursor = "pointer";
    if (e.features && e.features.length > 0) {
      let zone = e.features[0].properties as ZoneFeature;
      updateFeature(map, hoveredId, zone.LocationID, "hovered");
    }
  }, []);

  const onZoneLeave = useCallback((map: MapBoxGL.Map) => {
    map.getCanvas().style.cursor = "";
    if (hoveredId.current) {
      map.setFeatureState(
        {
          source: SOURCE_ZONES,
          id: hoveredId.current,
        },
        {
          hovered: false,
        }
      );
    }
    hoveredId.current = -1;
  }, []);

  useEffect(() => {
    selectedId.current = zoneState.selectedId;
  }, [zoneState.selectedId]);

  useEffect(() => {
    MapBoxGL.accessToken = TOKEN;
    let map = new MapBoxGL.Map({
      container: mapElement.current as HTMLElement,
      style: STYLE,
      center: [-74.06217, 40.67033],
      zoom: 9.5,
    });
    map.on("load", function () {
      map.addSource(SOURCE_ZONES, {
        type: "geojson",
        data: DATA,
        promoteId: "LocationID",
      });
      map.addLayer({
        id: LAYER_ZONE_FILL,
        type: "fill",
        source: SOURCE_ZONES,
        filter: ["==", "$type", "Polygon"],
        layout: {},
        paint: {
          "fill-color": [
            "match",
            ["get", "borough"],
            "Bronx",
            "#fbb03b",
            "Staten Island",
            "#ff3030",
            "Manhattan",
            "#8eff47",
            "Queens",
            "#67ffec",
            "Brooklyn",
            "#1a42ff",
            "EWR",
            "#941aff",
            /* other */ "#ccc",
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            0.75,
            [
              "case",
              ["boolean", ["feature-state", "hovered"], false],
              0.5,
              0.25,
            ],
          ],
        },
      });
      map.addLayer({
        id: "zone-outline",
        type: "line",
        source: SOURCE_ZONES,
        layout: {},
        paint: {
          "line-color": "rgb(25,120,21)",
          "line-width": 1,
        },
      });
      map.addLayer({
        id: "zone-name",
        type: "symbol",
        source: SOURCE_ZONES,
        layout: {
          "text-field": ["get", "zone"],
          "text-justify": "center",
        },
      });
      map.on("click", LAYER_ZONE_FILL, (e) => onZoneSelect(map, e));
      map.on("mousemove", LAYER_ZONE_FILL, (e) => onZoneHover(map, e));
      map.on("mouseleave", LAYER_ZONE_FILL, () => onZoneLeave(map));
    });
  }, []);

  return (
    <Container>
      <div className="d-flex flex-column align-items-center justify-content-center m-1">
        <h5 className="user-select-none">TLC Data Viewer</h5>
        <div ref={mapElement} className="map"></div>
      </div>
      <div>{zoneState.selectedId}</div>
    </Container>
  );
};
