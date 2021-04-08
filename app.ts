import express from 'express';

require("dotenv").config();

const app = express();

app.use(express.static("public"));

app.listen(process.env.PORT, () => {
    console.log('The application is listening on port:', process.env.PORT);
})
