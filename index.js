const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mgijdnm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try{
    const eventCollection = client.db('volunteerNetwork').collection('events');
    const registerCollection = client.db('volunteerNetwork').collection('registeredList');

    app.get('/events', async(req,res) =>{
      const query ={}
      const cursor = eventCollection.find(query);
      const events = await cursor.toArray();
      res.send(events);
    });

    app.get('/events/:id', async(req,res) =>{
      const id = req.params.id;
      const query ={_id :new ObjectId(id)};
      const event = await eventCollection.findOne(query);
      res.send(event);
    })

    //registeredLists api

    app.post('/registeredLists', async(req,res) =>{
      const registeredList = req.body;
      const result = await registerCollection.insertOne(registeredList);
      res.send(result);
    });

    app.get('/registeredLists', async(req, res) =>{
      const query = {};
      const cursor = registerCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

  }
  finally{

  }
}
run().catch(err => console.error(err));

app.get('/', (req,res)=>{
    res.send('volunteer-network server is running');
});
app.listen(port, () =>{
    console.log(`The server is running on ${port}`)
});