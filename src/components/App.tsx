import React, { useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import MapBoxGL from "mapbox-gl";

type Props = {};

export const App: React.FC<Props> = ({}) => {
  const KEY = "7y3DwqhCAc5Y7Wr95RR9";
  const TOKEN =
    "pk.eyJ1Ijoic3RvbGJpdmkiLCJhIjoiY2tuOHg0N2UyMTF5bzJxcWRnb3huYWxjciJ9.DkRrWXvSJ2OFC6HMLANPAA";
  const STYLE = "https://api.maptiler.com/maps/streets/style.json?key=" + KEY;
  const DATA =
    "https://api.maptiler.com/data/00faea4c-94f8-437c-af5d-fc153669190f/features.json?key=" +
    KEY;

  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    MapBoxGL.accessToken = TOKEN;
    let map = new MapBoxGL.Map({
      container: mapElement.current as HTMLElement,
      style: STYLE,
      center: [-74.06217, 40.67033],
      zoom: 9.5,
    });

    map.on("load", function () {
      map.addSource("geojson-overlay", {
        type: "geojson",
        data: DATA,
      });
      map.addLayer({
        id: "geojson-overlay-fill",
        type: "fill",
        source: "geojson-overlay",
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
          "fill-opacity": 0.4,
        },
      });
      map.addLayer({
        id: "geojson-overlay-line",
        type: "line",
        source: "geojson-overlay",
        layout: {},
        paint: {
          "line-color": "rgb(14,34,66)",
          "line-width": 1,
        },
      });
      map.addLayer({
        id: "geojson-overlay-zones",
        type: "symbol",
        source: "geojson-overlay",
        layout: {
          "text-field": ["get", "zone"],
          "text-justify": "center",
        },
      });
    });
  }, []);

  return (
    <Container>
      <div className="d-flex flex-column align-items-center justify-content-center m-1">
        <h5 className="user-select-none">TLC Data Viewer</h5>
        <div ref={mapElement} className="map"></div>
      </div>
    </Container>
  );
};
