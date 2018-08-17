import dotenv from 'dotenv';
dotenv.load();
import express from 'express';
const port = process.env.PORT || 3500;

const app = express();


app.listen(port, () => {
  console.log(`EkoTraffic Server started on port ${port}.`)
});