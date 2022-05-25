const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vazir.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const toolCollection = client.db('engineer-reliance').collection('tools');
        const purchasingCollection = client.db('engineer-reliance').collection('purchasing');

        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = toolCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools);
        })
        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tool = await toolCollection.findOne(query);
            res.send(tool);
        })

        app.get('/available', async (req, res) => {
            // const toolName = req.query.toolName;
            const tools = await toolCollection.find().toArray();
            const query = { toolName: "Claw Hammer" };
            const purchase = await purchasingCollection.find().toArray();
            res.send(purchase);

        })

        app.post('/purchasing', async (req, res) => {
            const purchasing = req.body;
            const result = await purchasingCollection.insertOne(purchasing);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('hello engineer')
})

app.listen(port, () => {
    console.log(`engineer app listening port ${port}`)
})




