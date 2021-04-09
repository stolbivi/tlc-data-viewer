interface Zone {
  LocationID: number;
  OBJECTID: number;
  Shape_Area: number;
  Shape_Leng: number;
  borough: string;
  zone: string;
}

interface ZoneState {
  selectedId: number;
}

interface ZoneAction {
  type: string;
}

interface SelectZoneAction extends ZoneAction {
  locationId: number;
}

type Dispatch = (action: ZoneAction) => ZoneAction;

type OnSuccessCallback<T> = (response: T, message?: string) => void;

type OnErrorCallback = (error: string) => void;
