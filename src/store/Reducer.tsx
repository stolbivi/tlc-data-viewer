import * as ActionTypes from "./ActionTypes";

const reducer = (
  state: ZoneState = { selectedId: -1, routes: [] },
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
  }
  return state;
};

export default reducer;
