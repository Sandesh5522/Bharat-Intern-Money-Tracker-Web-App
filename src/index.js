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
    docs = {"Hi":"hello"};
    const query = { _id : data };
    const result = await db.collection(collname).find(query, {ordered: true});
    if((await db.collection(collname)) === 0) {
        console.log("No documents found!!");
    }
    for await (doc of result) {
        docs = doc;
        // docs = JSON.stringify(doc);
        // return doc;
        console.dir("Doc :"+doc);
    }
    console.log("done type:"+typeof(docs));
    console.dir("Docs: "+result(docs));
    // console.log(JSON.stringify(result));
    // var na = Object.keys(docs).map(function (key) { return docs[key]; });
    // console.log("na: "+na);
    // var final_docs = {_id: na[0], e_total: docs.e_total};
    // console.log(final_docs);

    // console.dir(result.doc);
    // console.dir(result.namespace);
    // return na;
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
app.post('/find', (req,res) => {
    client.connect();
    const db = client.db(dbname);
    // var response_data = req.body.data;
    response_data = req.body.u_phone + "-" + req.body.u_date;
    console.log(response_data);
    const result = getData(db, response_data);
    console.dir("Result: "+JSON.stringify(result)+"||"+JSON.stringify(docs));
    console.log("Result: "+docs+"||"+JSON.stringify(docs));
    res.render('searcho.html',{data:[docs["Hi"]]});
});

app.listen(port, () => {
    console.log('App listening at port http://localhost:'+port+'/home');
    var cd = new Date(Date.now());
    console.log("Today's date: "+cd.getDate()+"/"+cd.getMonth()+"/"+cd.getFullYear());
});
