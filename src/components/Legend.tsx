import React from "react";
import { shallowEqual, useSelector } from "react-redux";

type Props = {};

export const Legend: React.FC<Props> = ({}) => {
  const zoneState: ZoneState = useSelector(
    (state: ZoneState) => state,
    shallowEqual
  );

  return (
    <div className="legend d-flex flex-column align-items-center border bg-light m-1 p-1">
      <small>Pickup location</small>
      <div className="d-flex w-100">
        <div>Total outbound routes:</div>
        <div className="ml-auto">{zoneState.sourceStats.size}</div>
      </div>
      <div className="d-flex w-100">
        <div className="mr-2">Total distance:</div>
        <div className="ml-auto">
          {zoneState.sourceStats.totalDistance.toFixed(3)} miles
        </div>
      </div>
      <div className="d-flex w-100">
        <div className="mr-2">Total time:</div>
        <div className="ml-auto">
          {(zoneState.sourceStats.totalTime / 60).toFixed(2)} mins
        </div>
      </div>
      <div className="d-flex w-100">
        <div className="mr-2">Total amount:</div>
        <div className="ml-auto">
          ${zoneState.sourceStats.totalAmount.toFixed(2)}
        </div>
      </div>
      <div className="d-flex w-100">
        <div className="mr-2">Average speed:</div>
        <div className="ml-auto">
          {zoneState.sourceStats.averageSpeed.toFixed(2)} m/h
        </div>
      </div>
      <div className="d-flex w-100">
        <div className="mr-2">Average amount:</div>
        <div className="ml-auto">
          ${zoneState.sourceStats.averageAmount.toFixed(2)}
        </div>
      </div>
      <div className="d-flex w-100">
        <div className="mr-2">Average per minute:</div>
        <div className="ml-auto">
          ${zoneState.sourceStats.averagePerMinute.toFixed(2)}
        </div>
      </div>
      <div className="d-flex w-100">
        <div className="mr-2">Average per mile:</div>
        <div className="ml-auto">
          ${zoneState.sourceStats.averagePerMile.toFixed(2)}
        </div>
      </div>
    </div>
  );
};
