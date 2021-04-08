import express from 'express';

require("dotenv").config();

const app = express();

app.get('/', (req, res) => {
    res.send('Well done!!!');
})

app.listen(process.env.PORT, () => {
    console.log('The application is listening on port:', process.env.PORT);
})
