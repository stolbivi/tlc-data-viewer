const { expect } = require("@jest/globals");
const { processRoutes } = require("../src/stats/Stats");

test("Checking routes reduction", () => {
  const route1 = {
    startId: 1,
    id: 1,
    source: "y",
    endId: 1,
    pickupTime: 3,
    dropOffTime: 7,
    passengerCount: 1,
    distance: 21,
    fare: 0,
    extra: 0,
    tip: 0,
    mtaTax: 0,
    improvementSurcharge: 0,
    congestionSurcharge: 0,
    tolls: 0,
    total: 100,
  };
  const route2 = {
    startId: 2,
    id: 1,
    source: "g",
    endId: 1,
    pickupTime: 3,
    dropOffTime: 7,
    passengerCount: 2,
    distance: 42,
    fare: 0,
    extra: 0,
    tip: 0,
    mtaTax: 0,
    improvementSurcharge: 0,
    congestionSurcharge: 0,
    tolls: 0,
    total: 200,
  };
  const route3 = {
    startId: 1,
    id: 1,
    source: "fh",
    endId: 2,
    pickupTime: 3,
    dropOffTime: 7,
    passengerCount: 1,
    distance: 17,
    fare: 0,
    extra: 0,
    tip: 0,
    mtaTax: 0,
    improvementSurcharge: 0,
    congestionSurcharge: 0,
    tolls: 0,
    total: 33,
  };
  const data = [route1, route2, route3];
  const expectedMap = new Map();
  expectedMap.set(1, [route1, route2]);
  expectedMap.set(2, [route3]);
  const stats = {
    averageAmount: 111,
    averagePerMile: 4.1625,
    averagePerMinute: 1665,
    averageSpeed: 24000,
    size: 3,
    totalAmount: 333,
    totalDistance: 80,
    totalPassengers: 4,
    totalTime: 12,
  };
  expect(processRoutes(data)).toStrictEqual([expectedMap, stats]);
});
