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

// app.use(bodyParser.urlencoded({ extended: true }));

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
    const userCollection = database.collection("packages");
    const addressCollection = database.collection("addresses");

    //---------Here everything for Admin------
    // GET API Start
    app.get("/vacations", async (req, res) => {
      const cursor = vacationCollection.find({});
      const vacations = await cursor.toArray();
      res.send(vacations);
    });

    // GET Single ID For Any Purpose, Such as Show, Delete, Update
    app.get("/vacations/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await vacationCollection.findOne(query);
      // console.log(result);
      res.json(result);
    });

    // Post API Start
    app.post("/vacations", async (req, res) => {
      const vacation = req.body;
      const result = await vacationCollection.insertOne(vacation);
      console.log(result);
      res.json(result);
    });

    // Delete API
    app.delete("/vacations/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await vacationCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      // console.log(result);
      res.json(result);
    });

    // Update API

    app.put("/vacations/:id", async (req, res) => {
      const id = req.params.id;
      const updatedInfo = req.body;

      const result = await vacationCollection.updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            location: updatedInfo.location,
            title: updatedInfo.title,
            details: updatedInfo.details,
            price: updatedInfo.price,
            imgTitle: updatedInfo.imgTitle,
            img: updatedInfo.img,
          },
        }
      );
      console.log(result);
      res.json(result);
    });

    // Update API End

    //---------Here everything for Admin End------

    // Here Everything for User Start--------------
    // Here Everything for User Start--------------
    // Here Everything for User Start--------------

    // GET API Start
    app.get("/packages", async (req, res) => {
      const cursor = userCollection.find({});
      const packages = await cursor.toArray();
      res.send(packages);
    });
    // GET API Start
    app.get("/addresses", async (req, res) => {
      const cursor = addressCollection.find({});
      const addresses = await cursor.toArray();
      res.send(addresses);
    });

    // Post API
    app.post("/addresses", async (req, res) => {
      const address = req.body;
      const result = await addressCollection.insertOne(address);
      console.log(result);
      res.json(result);
    });
    // Post API
    app.post("/packages", async (req, res) => {
      const package = req.body;
      const result = await userCollection.insertOne(package);
      console.log(result);
      res.json(result);
    });

    // Get API
    app.get("/packages/:email", async (req, res) => {
      console.log(req.params.email);

      const result = await userCollection
        .find({ email: req.params.email })
        .toArray();
      // console.log(result);
      res.json(result);
    });

    // Delete API
    app.delete("/packages/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await userCollection.deleteOne({
        _id: req.params.id,
      });
      // console.log(result);
      res.json(result);
    });

    // Update API

    app.put("/packages/:id", async (req, res) => {
      const id = req.params.id;
      const updatedInfo = req.body;

      const result = await userCollection.updateOne(
        { _id: id },
        {
          $set: {
            location: updatedInfo.location,
            title: updatedInfo.title,
            details: updatedInfo.details,
            price: updatedInfo.price,
            imgTitle: updatedInfo.imgTitle,
            img: updatedInfo.img,
            status: updatedInfo.status,
          },
        }
      );
      console.log(result);
      res.json(result);
    });

    // Update API End
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
