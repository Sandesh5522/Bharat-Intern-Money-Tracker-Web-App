const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const dbname = "nodemt";
const collname = "nodecoll";
const client = new MongoClient(uri);
const path = require('path');
const app = express();
const port = 3000;

async function run() {
    try {
        await client.connect();
        const db = client.db(dbname);
        const result = db.collection(collname).find({}).toArray();
        console.log(result);
    }
    finally {
        setTimeout(() => {client.close()}, 1500);
    }
}
run().catch(console.dir);

app.get('/home', (req,res) => {
    client.connect();
    const db = client.db(dbname);
    const filePath = path.resolve('views','home.html');
    res.sendFile(filePath);
});

app.listen(port, () => {
    console.log('App listening at port http://localhost:${port}/home');
});
