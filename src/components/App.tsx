import React, { useCallback, useEffect, useRef, useState } from "react";
import { ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import { Dispatch } from "redux";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import MapBoxGL from "mapbox-gl";
import { getDest, selectZone } from "../store/ActionCreators";
import moment from "moment";
import TimePicker from "rc-time-picker";
import { DatePickerInput } from "rc-datepicker";
import { Legend } from "./Legend";
import { setDestination, updateFeature } from "../map/FeatureUtils";
import { getEpoch, TIME_FORMAT } from "../map/DateTimeUtils";

const KEY = "7y3DwqhCAc5Y7Wr95RR9";
const TOKEN =
  "pk.eyJ1Ijoic3RvbGJpdmkiLCJhIjoiY2tuOHg0N2UyMTF5bzJxcWRnb3huYWxjciJ9.DkRrWXvSJ2OFC6HMLANPAA";
const STYLE = "https://api.maptiler.com/maps/streets/style.json?key=" + KEY;
const DATA =
  "https://api.maptiler.com/data/00faea4c-94f8-437c-af5d-fc153669190f/features.json?key=" +
  KEY;
const SOURCE_ZONES = "zones-overlay";
const LAYER_ZONE_FILL = "zone-fill";
const initialStartDate = new Date(2020, 0, 1);
const initialEndDate = new Date(2020, 0, 1);
const initialStartTime = moment().hour(0).minute(0).second(0);
const initialEndTime = moment().hour(23).minute(59).second(59);

type Props = {};

export const App: React.FC<Props> = ({}) => {
  const zoneState: ZoneState = useSelector(
    (state: ZoneState) => state,
    shallowEqual
  );
  const dispatch: Dispatch<any> = useDispatch();
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapBoxGL.Map>();
  const hoveredIdRef = useRef<number>(-1);
  const selectedIdRef = useRef<number>(-1);
  const endIdsRef = useRef<Map<number, Route[]>>(new Map<number, Route[]>());
  const [startDate, setStartDate] = useState<Date>(initialStartDate);
  const [startTime, setStartTime] = useState<moment.Moment>(initialStartTime);
  const [endDate, setEndDate] = useState<Date>(initialEndDate);
  const [endTime, setEndTime] = useState<moment.Moment>(initialEndTime);
  const [sourceY, setSourceY] = useState<boolean>(true);
  const [sourceG, setSourceG] = useState<boolean>(true);
  const [sourceFH, setSourceFH] = useState<boolean>(true);

  const selectZoneDispatch = useCallback(
    (locationId: number) => {
      dispatch(selectZone(locationId));
    },
    [dispatch]
  );

  const getDestDispatch = useCallback(
    (startId: number, start: number, end: number, sources?: string) => {
      dispatch(getDest(startId, start, end, sources));
    },
    [dispatch]
  );

  const onZoneSelect = useCallback((map: MapBoxGL.Map, e: any) => {
    if (e.features && e.features.length > 0) {
      let zone = e.features[0].properties as ZoneFeature;
      updateFeature(
        SOURCE_ZONES,
        map,
        selectedIdRef,
        zone.LocationID,
        "selected"
      );
      selectZoneDispatch(zone.LocationID);
    }
  }, []);

  const onZoneHover = useCallback((map: MapBoxGL.Map, e: any) => {
    map.getCanvas().style.cursor = "pointer";
    if (e.features && e.features.length > 0) {
      let zone = e.features[0].properties as ZoneFeature;
      updateFeature(
        SOURCE_ZONES,
        map,
        hoveredIdRef,
        zone.LocationID,
        "hovered"
      );
    }
  }, []);

  const onZoneLeave = useCallback((map: MapBoxGL.Map) => {
    map.getCanvas().style.cursor = "";
    if (hoveredIdRef.current) {
      map.setFeatureState(
        {
          source: SOURCE_ZONES,
          id: hoveredIdRef.current,
        },
        {
          hovered: false,
        }
      );
    }
    hoveredIdRef.current = -1;
  }, []);

  useEffect(() => {
    [...endIdsRef.current.keys()].forEach((endId) =>
      setDestination(SOURCE_ZONES, mapRef.current as MapBoxGL.Map, endId, false)
    );
    endIdsRef.current = zoneState.routesPerEndId;
    if (mapRef.current) {
      [...zoneState.routesPerEndId.keys()].forEach((endId) =>
        setDestination(
          SOURCE_ZONES,
          mapRef.current as MapBoxGL.Map,
          endId,
          true
        )
      );
    }
  }, [zoneState.routesPerEndId]);

  useEffect(() => {
    let sources = [];
    if (sourceY) {
      sources.push("y");
    }
    if (sourceG) {
      sources.push("g");
    }
    if (sourceFH) {
      sources.push("fh");
    }
    if (sources.length > 0) {
      getDestDispatch(
        zoneState.selectedId,
        getEpoch(startDate, startTime),
        getEpoch(endDate, endTime),
        sources.join(",")
      );
    } else {
      getDestDispatch(
        zoneState.selectedId,
        getEpoch(startDate, startTime),
        getEpoch(endDate, endTime)
      );
    }
  }, [
    zoneState.selectedId,
    startDate,
    startTime,
    endDate,
    endTime,
    sourceY,
    sourceG,
    sourceFH,
  ]);

  useEffect(() => {
    MapBoxGL.accessToken = TOKEN;
    let map = new MapBoxGL.Map({
      container: mapElement.current as HTMLElement,
      style: STYLE,
      center: [-74.06217, 40.67033],
      zoom: 9.5,
    });
    mapRef.current = map;
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
            /* other */ "#808080",
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            0.85,
            [
              "case",
              ["boolean", ["feature-state", "destination"], false],
              0.65,
              [
                "case",
                ["boolean", ["feature-state", "hovered"], false],
                0.45,
                0.15,
              ],
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
          "line-color": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            "#800000",
            [
              "case",
              ["boolean", ["feature-state", "destination"], false],
              "#008000",
              [
                "case",
                ["boolean", ["feature-state", "hovered"], false],
                "#fff",
                "rgba(0,0,0,0)",
              ],
            ],
          ],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            3,
            ["case", ["boolean", ["feature-state", "hovered"], false], 3, 1],
          ],
          "line-offset": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            -1,
            ["case", ["boolean", ["feature-state", "hovered"], false], -1, 0],
          ],
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
        <div className="d-flex">
          <div ref={mapElement} className="map" />
          {zoneState.selectedId > 0 && <Legend />}
          <div className="d-flex flex-column align-items-start justify-content-start ml-2">
            <ButtonGroup toggle className="mb-2">
              <ToggleButton
                type="checkbox"
                variant="warning"
                checked={sourceY}
                value="1"
                onChange={(e) => setSourceY(e.currentTarget.checked)}
              >
                Yellow
              </ToggleButton>
              <ToggleButton
                type="checkbox"
                variant="success"
                checked={sourceG}
                value="1"
                onChange={(e) => setSourceG(e.currentTarget.checked)}
              >
                Green
              </ToggleButton>
              <ToggleButton
                type="checkbox"
                variant="primary"
                checked={sourceFH}
                value="1"
                onChange={(e) => setSourceFH(e.currentTarget.checked)}
              >
                FH
              </ToggleButton>
            </ButtonGroup>
            <label>
              <small>Start date</small>
            </label>
            <DatePickerInput
              position="bottom"
              value={startDate}
              onChange={setStartDate}
              showOnInputClick
            />
            <label>
              <small>Start time</small>
            </label>
            <TimePicker
              showSecond={true}
              value={startTime}
              onChange={setStartTime}
              format={TIME_FORMAT}
              use12Hours
              inputReadOnly
            />
            <label>
              <small>End date</small>
            </label>
            <DatePickerInput
              position="bottom"
              value={endDate}
              onChange={setEndDate}
              showOnInputClick
            />
            <label>
              <small>End time</small>
            </label>
            <TimePicker
              showSecond={true}
              value={endTime}
              onChange={setEndTime}
              format={TIME_FORMAT}
              use12Hours
              inputReadOnly
            />
          </div>
        </div>
      </div>
    </Container>
  );
};
