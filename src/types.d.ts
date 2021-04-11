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
  routesPerEndId: Map<number, Route[]>;
  sourceStats: RouteStats;
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

interface RouteStats {
  size: number;
  totalDistance: number;
  totalTime: number;
  totalAmount: number;
  averageSpeed: number;
  averageAmount: number;
  averagePerMinute: number;
  averagePerMile: number;
}

type Dispatch = (action: ZoneAction) => ZoneAction;
