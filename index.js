const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());


const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true });





//API'S

app.get('/food', (req, res) => {//show all food
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("redOnion").collection("food");
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err)
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents);
            }
        });
        client.close();
    });
});


app.get('/orders', (req, res) => {//show all orders
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("redOnion").collection("orders");
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err)
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents);
            }
        });
        client.close();
    });
});

app.get('/food/:key', (req, res) => {//show specific food with key value
    const key = req.params.key;

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("redOnion").collection("food");
        collection.find({ key }).toArray((err, documents) => {
            if (err) {
                console.log(err)
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents[0]);
            }
        });
        client.close();
    });
});

app.post('/getFoodByKey', (req, res) => {//multiplae food items
    const key = req.params.key;
    const productKeys = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("redOnion").collection("food");
        collection.find({ key: { $in: productKeys } }).toArray((err, documents) => {
            if (err) {
                console.log(err)
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents);
            }
        });
        client.close();
    });
});

app.post('/addFood', (req, res) => {//add food to database
    const food = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("redOnion").collection("food");
        collection.insert(food, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send({ message: err });
            }
            else {
                res.send(result.ops[0]);
            }
        });
        client.close();
    });
});



app.post('/placeOrder', (req, res) => {//order placement
    const orderDetails = req.body;
    orderDetails.orderTime = new Date();
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("redOnion").collection("orders");
        collection.insertOne(orderDetails, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send({ message: err });
            }
            else {
                res.send(result.ops[0]);
            }
        });
        client.close();
    });
});



const port = process.env.PORT || 4200;
app.listen(port, () => console.log('Listenting to port', port));