import MapBoxGL from "mapbox-gl";
import React from "react";

export function updateFeature(
  source: string,
  map: MapBoxGL.Map,
  ref: React.MutableRefObject<number>,
  newValue: number,
  stateName: string
) {
  if (ref.current) {
    map.setFeatureState(
      {
        source,
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
      source,
      id: newValue,
    },
    {
      [stateName]: true,
    }
  );
}

export function setDestination(
  source: string,
  map: MapBoxGL.Map,
  endId: number,
  destination: boolean
) {
  map.setFeatureState(
    {
      source,
      id: endId,
    },
    {
      destination: destination,
    }
  );
}
