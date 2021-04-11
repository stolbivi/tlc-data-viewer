require("dotenv").config();
// const sleep = require("sleep");
const args = require("minimist")(process.argv.slice(2));
const csv = require("csv-parser");
const fs = require("fs");
const {
  DynamoDBClient,
  BatchWriteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { itemFromJSON } = require("./DynamoDBData");

const dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });

let fileName = args["file"];
let source = args["source"];
let id = Number(args["id"]);
console.log("Reading file:", fileName);

function getTimestamp(dateTime) {
  return Math.floor(new Date(dateTime).getTime() / 1000);
}

function getItem(id, source, row) {
  return {
    id,
    source,
    pickupTime: getTimestamp(row.pickup_datetime),
    dropOffTime: getTimestamp(row.dropoff_datetime),
    startId: Number(row.PULocationID),
    endId: Number(row.DOLocationID),
    // passengerCount: Number(row.passenger_count),
    // distance: Number(row.trip_distance),
    // fare: Number(row.fare_amount),
    // extra: Number(row.extra),
    // mtaTax: Number(row.mta_tax),
    // tip: Number(row.tip_amount),
    // tolls: Number(row.tolls_amount),
    // improvementSurcharge: Number(row.improvement_surcharge),
    // congestionSurcharge: Number(row.congestion_surcharge),
    // total: Number(row.total_amount),
  };
}

let data = [];
fs.createReadStream(fileName)
  .pipe(csv())
  .on("data", (row) => {
    data.push(getItem(id, source, row));
    id++;
  })
  .on("end", async () => {
    console.log(
      `File ${fileName} successfully processed with ${data.length} records`
    );

    let batch = [];
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      console.log(item);
      if (batch.length >= process.env.BATCH_SIZE) {
        const command = new BatchWriteItemCommand({
          RequestItems: { [process.env.TABLE_TLC]: batch },
        });
        await dynamoDbClient.send(command);
        // sleep.msleep(10);
        batch.length = 0;
      } else {
        batch.push({ PutRequest: { Item: itemFromJSON(item) } });
      }
    }
    console.log(`Last index ${id}`);
  });
