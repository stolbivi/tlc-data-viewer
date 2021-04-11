import * as ActionTypes from "./ActionTypes";

const DEFAULT_STATS: RouteStats = {
  size: 0,
  totalDistance: 0,
  totalTime: 0,
  totalAmount: 0,
  averageSpeed: 0,
  averageAmount: 0,
  averagePerMinute: 0,
  averagePerMile: 0,
};

function processRoutes(routes: Route[]): [Map<number, Route[]>, RouteStats] {
  let distance = 0;
  let time = 0;
  let amount = 0;
  let mapPerEndId = routes.reduce((result, route) => {
    if (route.distance) {
      distance += route.distance;
    }
    if (route.dropOffTime) {
      time += route.dropOffTime - route.pickupTime;
    }
    if (route.total) {
      amount += route.total;
    }
    let array = result.get(route.endId);
    if (array) {
      array.push(route);
    } else {
      result.set(route.endId, [route]);
    }
    return result;
  }, new Map<number, Route[]>());
  let stats: RouteStats = {
    size: routes.length,
    totalDistance: distance,
    totalTime: time,
    totalAmount: amount,
    averageSpeed: distance / (time / 3600),
    averageAmount: amount / routes.length,
    averagePerMinute: amount / (time / 60),
    averagePerMile: amount / distance,
  };
  return [mapPerEndId, stats];
}

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
