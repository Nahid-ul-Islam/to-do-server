const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.spoo0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// client.connect(err => {
//   const collection = client.db("toDo").collection("tasks");
//   console.log('db connected');
//   // perform actions on the collection object
//   client.close();
// });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("toDo").collection("tasks");
        console.log('db connected');

        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });


        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('getting data from backend');
});

app.listen(port, () => {
    console.log('Listining to port', port);
});