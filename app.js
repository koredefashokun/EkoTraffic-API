import dotenv from 'dotenv';
dotenv.load();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import router from './routes';

const port = process.env.PORT || 3500;


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);


app.listen(port, () => {
  console.log(`EkoTraffic Server started on port ${port}.`)
});