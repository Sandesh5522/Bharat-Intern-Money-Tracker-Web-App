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

async function getData(db, data){
    docs = {};
    const query = { _id : data };
    const result = await db.collection(collname).find(query, {ordered: true});
    if((await db.collection(collname)) === 0) {
        console.log("No documents found!!");
    }
    for await (doc of result) {
        docs = doc;
        // console.dir("Doc :"+doc);
    }
    // console.log("done type:"+typeof(docs));
    // console.dir("Docs: "+docs);
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

app.get('/search', (req,res) => {
    client.connect();
    const db = client.db(dbname);
    const filePath = path.resolve('views','search.html');
    res.sendFile(filePath);
});

app.engine('html', require('ejs').renderFile);
app.post('/find', async (req,res) => {
    client.connect();
    const db = client.db(dbname);
    response_data = req.body.u_phone + "-" + req.body.u_date;
    console.log(response_data);
    await getData(db, response_data);
    console.log("Result: "+docs+"||"+JSON.stringify(docs));
    console.log("Length of object docs: "+Object.keys(docs).length);
    docs = Object.keys(docs).map(function (key) { return docs[key]; });
    console.log(docs);
    // JSON.stringify(docs, null, 2)
    res.render('res.html',{data:[docs]});
});

app.listen(port, () => {
    console.log('App listening at port http://localhost:'+port+'/home');
    var cd = new Date(Date.now());
    var var_date = new Date();
    var month = var_date.getMonth()+1;
    if(month > 9) { month = month; }
    else if(month <= 9) { month = "0"+month; }
    console.log("Today's date: "+cd.getDate()+"/"+month+"/"+cd.getFullYear());
});
