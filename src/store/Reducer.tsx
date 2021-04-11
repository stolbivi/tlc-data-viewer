import * as ActionTypes from "./ActionTypes";

const { processRoutes } = require("../stats/Stats");

const DEFAULT_STATS: RouteStats = {
  size: 0,
  totalDistance: 0,
  totalTime: 0,
  totalAmount: 0,
  totalPassengers: 0,
  averageSpeed: 0,
  averageAmount: 0,
  averagePerMinute: 0,
  averagePerMile: 0,
};

const reducer = (
  state: ZoneState = {
    selectedId: -1,
    routesPerEndId: new Map<number, Route[]>(),
    sourceStats: DEFAULT_STATS,
  },
  action: ZoneAction
): ZoneState => {
  console.log("Reducing with:", action);
  switch (action.type) {
    case ActionTypes.SELECT_ZONE: {
      let selectZoneAction = action as SelectZoneAction;
      let newState = {
        ...state,
        selectedId: selectZoneAction.locationId,
      };
      console.log("New state:", newState);
      return newState;
    }
    case ActionTypes.GET_DEST: {
      let getDestAction = action as GetDestAction;
      let [routesPerEndId, sourceStats] = processRoutes(getDestAction.routes);
      let newState = {
        ...state,
        routesPerEndId,
        sourceStats,
      };
      console.log("New state:", newState);
      return newState;
    }
  }
  return state;
};

export default reducer;
