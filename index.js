const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const { json } = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ieoe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("bkVacations");
    const vacationCollection = database.collection("vacations");

    // GET API Start
    app.get("/vacations", async (req, res) => {
      const cursor = vacationCollection.find({});
      const vacations = await cursor.toArray();
      res.send(vacations);
    });
    // GET API End

    // GET Single Service
    app.get("/vacations/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const support = await vacationCollection.findOne(query);
      res.json(support);
    });

    // Post API Start
    app.post("/vacations", async (req, res) => {
      const support = req.body;
      const result = await vacationCollection.insertOne(support);
      console.log(result);
      res.json(result);
    });
    // Post API End
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

// Default App
app.get("/", (req, res) => {
  res.send("BK Vacations is Running");
});

app.listen(port, () => {
  console.log("BK Vacations is Running on Port", port);
});
