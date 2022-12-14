const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const MongoClient = mongodb.MongoClient;
const MongoUtil = require("./MongoUtil");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

let app = express();
app.use(express.json());
app.use(cors());

async function main() {
  console.log("connecting to db")
  await MongoUtil.connect(MONGO_URI, "pandatea");
  console.log("connected to db")

  const db = MongoUtil.getDB();
  console.log("connected to db2")

  app.get("/", (req, res) => {
    res.send("hello, world")
  })

  app.get("/pandatea", async (req, res) => {
    console.log("connected to mongodb");
    let result = await db.collection("drinks").find().toArray();
    res.status(200);
    res.send(result);
  });

  app.post("/pandatea", async (req, res) => {
    const newData = await db.collection('drinks').insertOne({
      name: req.body.name,
      type: req.body.type,
      price: req.body.price
    });
    req.status(200);
    req.send(newData);
  })
}

main();

app.listen(process.env.PORT || 8888, () => {
  console.log("server is listening to port 8888");
});
