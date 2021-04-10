import * as ActionTypes from "./ActionTypes";

const BASE_URL = "http://localhost:8080";

const SELECT_ZONE_ACTION = {
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

const GET_DEST_ACTION = {
  type: ActionTypes.GET_DEST,
};
export const getDest = (
  startId: number,
  start: number,
  end: number,
  source?: string
) => {
  return (dispatch: Dispatch) => {
    let init: any = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    let url = new URL(BASE_URL + "/dest");
    let params = `startId=${startId}&start=${start}&end=${end}`;
    if (source) {
      params += `source=${source}`;
    }
    url.search = new URLSearchParams(params).toString();
    fetch(url.toString(), init)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        const newAction: GetDestAction = {
          ...GET_DEST_ACTION,
          routes: [],
        };
        dispatch(newAction);
      })
      .catch((e) => {
        console.error("Error communicating to server: " + JSON.stringify(e));
      });
  };
};
