const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.kmiyc5o.mongodb.net/?retryWrites=true&w=majority`;
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
    client.connect();
    const database = client.db("Edu_Fun_Emporium_DB");
    const EduToysCollection = database.collection("Edu_Toys_Collection");

    app.get('/toys', async (req, res) => {
      const result = await EduToysCollection.find().toArray()
      res.send(result)
    })

    app.get('/toysSearch/:text', async (req, res) => {
      const text = req.params.text
      const searchQuery = { 
        name : {
          $regex : text, 
          $options : 'i'
        } 
      };
      const result = await EduToysCollection.find(searchQuery).toArray()
      res.send(result)
    })

    app.get('/toysCategorize/:category', async (req, res) => {
      const category = req.params.category ;
      const query = { sub_category : category };
      const result = await EduToysCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id ;
      const query = { _id : new ObjectId(id) };
      const result = await EduToysCollection.findOne(query)
      res.send(result)
    })

    app.get('/myToys', async (req, res) => {
      const sellerEmail = req.query?.email
      const query = { 
        seller_email : sellerEmail
      };
      const sort = {
        price : -1
      };
      const result = await EduToysCollection.find(query).sort(sort).toArray()
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})