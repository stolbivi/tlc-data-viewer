import express from "express";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const urlencoded = require("body-parser").urlencoded;
const { itemToJSON } = require("./db/DynamoDBData");

require("dotenv").config();

const dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });

const app = express();
app.use(express.static("public"));
app.use(urlencoded({ extended: true }));

app.get("/dest", (req: any, res: any) => {
  try {
    console.log("Processing dest request:", req.query);
    if (!req.query.startId) {
      res.json({ error: "Missing query parameter: startId" });
      return;
    }
    if (!req.query.start) {
      res.json({ error: "Missing query parameter: start" });
      return;
    }
    if (!req.query.end) {
      res.json({ error: "Missing query parameter: end" });
      return;
    }
    let filter =
      "((dropOffTime >= :rs and dropOffTime <= :re) or (pickupTime >= :rs and pickupTime <= :re))";
    let attributeValues = {
      ":sid": { N: req.query.startId },
      ":rs": { N: req.query.start },
      ":re": { N: req.query.end },
    };
    if (req.query.source) {
      let sources = req.query.source.split(",");
      let sourceAttributes = [];
      for (let i = 0; i < sources.length; i++) {
        let attribute = `:source${i}`;
        sourceAttributes.push(attribute);
        attributeValues = {
          ...attributeValues,
          [attribute]: { S: sources[i] },
        };
      }
      filter += ` and #src in (${sourceAttributes.join(",")})`;
    }
    // console.log("Filter:", filter, "Attributes:", attributeValues);
    const scanCommand = new QueryCommand({
      KeyConditionExpression: "startId = :sid",
      FilterExpression: filter,
      ...(req.query.source
        ? { ExpressionAttributeNames: { "#src": "source" } }
        : {}),
      ExpressionAttributeValues: attributeValues,
      TableName: process.env.TABLE_TLC,
    });
    dynamoDbClient.send(scanCommand).then(
      (results: any) => {
        let result = results.Items.map((item: any) => itemToJSON(item));
        // setTimeout(() => res.json({ pages: validPages }), 2000);
        res.json({ result });
      },
      (error: any) => {
        console.error(error);
        res.json({ error: error });
      }
    );
  } catch (e) {
    console.error(e);
    res.json({ error: e.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log("The application is listening on port:", process.env.PORT);
});
