module.exports = {
  processRoutes: (routes) => {
    let distance = 0;
    let time = 0;
    let amount = 0;
    let passengers = 0;
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
      if (route.passengerCount) {
        passengers += route.passengerCount;
      }
      let array = result.get(route.endId);
      if (array) {
        array.push(route);
      } else {
        result.set(route.endId, [route]);
      }
      return result;
    }, new Map());
    let stats = {
      size: routes.length,
      totalDistance: distance,
      totalTime: time,
      totalAmount: amount,
      totalPassengers: passengers,
      averageSpeed: distance / (time / 3600),
      averageAmount: amount / routes.length,
      averagePerMinute: amount / (time / 60),
      averagePerMile: amount / distance,
    };
    return [mapPerEndId, stats];
  },
};
