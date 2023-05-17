const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.kgtu0s8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("Espresso_Emporium_DB");
    const coffeeCollections = database.collection("Espresso_Emporium_collections");

    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollections.find();
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollections.findOne(query);
      res.send(result)
    })

    app.post('/coffee', async (req, res) => {
      const user = req.body;
      const result = await coffeeCollections.insertOne(user);
      res.send(result)
    })

    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const coffee = req.body ;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateCoffee = {
        $set: {
          name : coffee.name,
          chef : coffee.chef,
          supplier : coffee.supplier,
          taste : coffee.taste,
          category : coffee.category,
          details : coffee.details,
          photo : coffee.photo
        },
      };

      const result = await coffeeCollections.updateOne(filter, updateCoffee, options)
      res.send(result);
    })

    app.delete('/coffee/:id', async(req, res) => {
      const id = req.params.id ;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollections.deleteOne(query);
      res.send(result) ;
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})