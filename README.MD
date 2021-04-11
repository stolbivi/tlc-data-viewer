**TLC Data Viewer**

This project is my personal attempt to demonstrate various technical and designing skills as part of Microsoft Take Home Engineering challenge (https://github.com/seushermsft/Take-Home-Engineering-Challenge)

Live demo: https://tlc-data-viewer.herokuapp.com

**Briefly about architecture and design**

This project is a single page web app built with React, Redux, Bootstrap, MapBox in fron-end and Express and AWS/DynamoDB in back-end.

The data provided by TLC was imported 'as-is' into DynamoDB table (import script included) and resulted in ~1.4 mils of records. In order to minimize latency for data lookup the pickup location id was selected as the primary key and 2 more indexes where created: pickup time and drop-off time. Since this is only a showcase project only data for January 2020 was imported. The geodata provided by TLC in a format of shapefile it was also imported into MapBox using standard interface to create navigable zones layer.

The UI consists of the map and filters. Filters allow user to select what data sources should be used: Yellow Cab, Green Cab or For Hire. If all source filters are unchecked it returns all records. Next 2 filters are start date time and end date time. They allow users to specify range of time which contains at least pickup time or drop-off time meaning the interval of the trip should be overlapping or included.

User can navigate the map and select a particular zone. The UI will request back-end to retrieve all records of trips originated from selected zone and will highlight all destination zones. This step performs basic data reduction and statistics calculations. The statistics (metrics) will be displayed on the map in a separate block.

**Things to improve if I'd have more time**

As a most desirable feature I'd introduce a separate data layer on the map to display pie charts at the drop-off locations with proportional values of data sources as well as the circular size of the chart to represent the relative amount of trips. Also, when clicking on the chart it would add another level of metrics to represent only trips between selected pickup and drop-off locations.

Since metrics are fully based on the filter values it wouldn't be beneficial to pre-calculate metrics at the data-import phase.  

Please by mindful selecting huge data intervals and popular locations, some queries result in thousands of records and can look visually very slow. I would limit filter intervals to provide better user experience.


**Build and run**
```
npm run heroku-postbuild
npm run start
```
Then open http://localhost:8080

**Test**
```
npm run test
```
