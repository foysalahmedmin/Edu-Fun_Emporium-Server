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
    // client.connect();
    const database = client.db("Edu_Fun_Emporium_DB");
    const EduToysCollection = database.collection("Edu_Toys_Collection");
    const EduToysReviewCollection = database.collection("Edu_Fun_Review_Collection");

    app.get('/toys', async (req, res) => {
      const result = await EduToysCollection.find().limit(20).toArray()
      res.send(result)
    })

    app.get('/toysSearch/:text', async (req, res) => {
      const text = req.params.text
      const searchQuery = {
        name: {
          $regex: text,
          $options: 'i'
        }
      };
      const result = await EduToysCollection.find(searchQuery).toArray()
      res.send(result)
    })

    app.get('/toysCategorize/:category', async (req, res) => {
      const category = req.params.category;
      const query = { sub_category: category };
      const result = await EduToysCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await EduToysCollection.findOne(query)
      res.send(result)
    })

    app.get('/myToys', async (req, res) => {
      const sellerEmail = req.query?.email
      const sort = req.query?.sort
      const query = {
        seller_email: sellerEmail
      };
      const ascendingSort = {
        price: 1
      };
      const descendingSort = {
        price: -1
      };
      if (sort == 'ascending') {
        const result = await EduToysCollection.find(query).sort(ascendingSort).toArray()
        res.send(result)
      } else if (sort == 'descending') {
        const result = await EduToysCollection.find(query).sort(descendingSort).toArray()
        res.send(result)
      } else{
        const result = await EduToysCollection.find(query).toArray()
        res.send(result)
      }


    })

    app.post('/toys', async (req, res) => {
      const toyInfo = req.body;
      const result = await EduToysCollection.insertOne(toyInfo)
      res.send(result)
    })

    app.put('/toyUpdate/:id', async (req, res) => {
      const id = req.params.id;
      const toyUpdate = req.body;
      const updateDoc = {
        $set: {
          price: toyUpdate?.price,
          quantity_available: toyUpdate?.quantity_available,
          description: toyUpdate?.description
        }
      }
      const options = { upsert: true };
      const filter = { _id: new ObjectId(id) };
      const result = await EduToysCollection.updateOne(filter, updateDoc, options)
      res.send(result)
    })

    app.delete('/myToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await EduToysCollection.deleteOne(query)
      res.send(result)
    })


    //Reviews 

    app.get('/eduFunReviews', async (req, res) => {
      const result = await EduToysReviewCollection.find().limit(5).toArray()
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