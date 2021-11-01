require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { ObjectId, MongoClient } = require("mongodb");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const uri = `mongodb+srv://mytravel:3oUVgiJzQ8SoCW4X@cluster0.nfwxj.mongodb.net/happinesstours?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect(err => {

    const database = client.db("happinesstours");
    const destinations = database.collection("destinations");
    const travelers = database.collection('travelers');
    app.get('/destinations', async (req, res) =>{
       const cursor = destinations.find({});
       const result = await cursor.toArray();

        res.send(result);
    });
    app.get('/booking/:id',async (req, res) => {
        const result = await destinations.findOne({_id: ObjectId(req.params.id)});
        
        res.json(result);
    });

    app.post("/booking",async (req, res) => {
        const result = await travelers.insertOne(req.body);
        // console.log(result);
    });
    app.get('/travelers',async(req, res)=>{
        const cursor  = travelers.find({})
        const result = await cursor.toArray();
        res.send(result)
    });
    app.post('/mybookings', async (req, res) => {
        const cursor = travelers.find(req.body);
        let results = await cursor.toArray();
        for(let i = 0; i < results.length; i++){
            const destination = await destinations.findOne({_id: ObjectId(results[i].destinationId)});
            results[i].destination = destination;
        }
        console.log(results);
        res.json(results);
    });
    
    app.get('/allbookings', async (req, res) => {
        const cursor = travelers.find({});
        let results = await cursor.toArray();
        for(let i = 0; i < results.length; i++){
            const destination = await destinations.findOne({_id: ObjectId(results[i].destinationId)});
            results[i].destination = destination;
        }
        console.log(results);
        res.json(results);
    });
    // update Api
    app.put()
    
    app.delete('/mybookings/:id', async(req, res)=>{
        console.log(req.params.id);
       const result = await travelers.deleteOne({
           _id: ObjectId(req.params.id)
         
        })
        console.log(result);
        res.json(result);
    });




    // client.close();
});
// delete travel


// find all users

app.get("/", (req, res) => {
    res.send("hello from node server");
});

app.listen(port, () => {
    console.log("listening on port ", port);
});
