const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// MongoDB START
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vwkey.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("volunteerDatabase");
        const eventCollection = database.collection("eventCollection");
        const volunteerCollection = database.collection("volunteerCollection");

        // GET ALL EVENTS API
        app.get('/events', async (req, res) => {
            const email = req.query.email;
            let query;
            let cursor;

            if (email) {
                query = { email: email };
                cursor = volunteerCollection.find(query);
            }

            else {
                query = {};
                cursor = eventCollection.find(query);
            };

            const events = await cursor.toArray();
            res.send(events);
        });

        // GET SINGLE EVENT API
        app.get('/events/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = eventCollection.findOne(query);
            const event = await cursor;
            res.send(event);
        });

        // POST EVENT API
        app.post('/events', async (req, res) => {
            const event = req.body;
            const result = await eventCollection.insertOne(event);
            res.send(result);
        });

        // DELETE EVENT API
        app.delete('/events/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await products.deleteOne(query);
            res.send(result);
        });

        // GET ALL VOLUNTEER API
        app.get('/volunteers', async (req, res) => {
            const query = {};
            const cursor = volunteerCollection.find(query);
            const volunteers = await cursor.toArray();
            res.send(volunteers);
        });

        // GET SINGLE VOLUNTEER API
        app.get('/volunteers/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = volunteerCollection.find(query);
            const volunteer = await cursor.toArray();
            res.send(volunteer);
        });

        // POST VOLUNTEER API
        app.post('/volunteers', async (req, res) => {
            const volunteer = req.body;
            const result = await volunteerCollection.insertOne(volunteer);
            res.send(result);
        });

        // DELETE VOLUNTEER API
        app.delete('/volunteers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await volunteerCollection.deleteOne(query);
            res.send(result);
        });
    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir);
// MongoDB END

app.get('/', (req, res) => {
    res.send("Volunteer Network");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});