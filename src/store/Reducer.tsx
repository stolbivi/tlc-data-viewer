import * as ActionTypes from "./ActionTypes";

const reducer = (
  state: ZoneState = { selectedId: -1, routes: [], endIds: [] },
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
      let endIdSet = new Set([
        ...getDestAction.routes.map((route) => route.endId),
      ]);
      endIdSet.values();
      let newState = {
        ...state,
        routes: getDestAction.routes,
        endIds: [...endIdSet],
      };
      console.log("New state:", newState);
      return newState;
    }
  }
  return state;
};

export default reducer;
