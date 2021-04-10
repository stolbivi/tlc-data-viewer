module.exports = {
  itemToJSON: (item: any) => {
    let result = {};
    for (let key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        if (item[key].S || item[key].S === "") {
          // @ts-ignore
          result[key] = item[key].S;
        } else if (item[key].N) {
          // @ts-ignore
          result[key] = Number(item[key].N);
        } else if (item[key].BOOL === false || item[key].BOOL == true) {
          // @ts-ignore
          result[key] = Boolean(item[key].BOOL);
        }
      }
    }
    return result;
  },
  itemFromJSON: (json: any) => {
    let result = {};
    for (let key in json) {
      if (Object.prototype.hasOwnProperty.call(json, key)) {
        if (typeof json[key] === "string") {
          // @ts-ignore
          result[key] = { S: json[key].toString() };
        } else if (typeof json[key] === "number") {
          // @ts-ignore
          result[key] = { N: json[key].toString() };
        } else if (typeof json[key] === "boolean") {
          // @ts-ignore
          result[key] = { BOOL: json[key].toString() };
        }
      }
    }
    return result;
  },
};
