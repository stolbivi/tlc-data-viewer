interface ZoneFeature {
  LocationID: number;
  OBJECTID: number;
  Shape_Area: number;
  Shape_Leng: number;
  borough: string;
  zone: string;
}

interface ZoneState {
  selectedId: number;
  routes: Route[];
}

interface ZoneAction {
  type: string;
}

interface SelectZoneAction extends ZoneAction {
  locationId: number;
}

interface GetDestAction extends ZoneAction {
  routes: Route[];
}

interface Route {
  id: number;
  source: string;
  startId: number;
  endId: number;
  pickupTime: number;
  dropOffTime: number;
  passengerCount: number;
  distance: number;
  fare: number;
  extra: number;
  tip: number;
  mtaTax: number;
  improvementSurcharge: number;
  congestionSurcharge: number;
  tolls: number;
  total: number;
}

type Dispatch = (action: ZoneAction) => ZoneAction;

type OnSuccessCallback<T> = (response: T, message?: string) => void;

type OnErrorCallback = (error: string) => void;
