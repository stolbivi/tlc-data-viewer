import * as ActionTypes from "./ActionTypes";

export const SELECT_ZONE_ACTION = {
  type: ActionTypes.SELECT_ZONE,
};
export const selectZone = (locationId: number) => {
  return (dispatch: Dispatch) => {
    const newAction: SelectZoneAction = {
      ...SELECT_ZONE_ACTION,
      locationId,
    };
    dispatch(newAction);
  };
};
