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

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }), express.static('public'));

function addData(db, data){
    const result = db.collection(collname).insertMany(data, {ordered:true});
    console.log("Rows inserted:"+result.insertedCount);
}

app.get('/home', (req,res) => {
    client.connect();
    const db = client.db(dbname);
    const filePath = path.resolve('views','home.html');
    res.sendFile(filePath);
});

app.post('/send', (req,res) => {
    client.connect();
    const db = client.db(dbname);
    console.log(req.body.data);
    console.log(req.body.data.length);
    addData(db, req.body.data);
    // const filePath = path.resolve('views','res.html');
    // res.sendFile(filePath);
});

app.listen(port, () => {
    console.log('App listening at port http://localhost:'+port+'/home');
    var cd = new Date(Date.now());
    console.log(cd.getDate()+"/"+cd.getMonth()+"/"+cd.getFullYear());
});
