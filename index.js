const express = require('express');
const cors = require('cors');
const app=express();
require('dotenv').config()
const port=process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.kbqlzif.mongodb.net/?retryWrites=true&w=majority`;

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

    const toyCollection= client.db("toysDB").collection('toy')
    const photoCollection=client.db('photDb').collection('photo')
    
    app.get('/toy',async(req,res)=>{
        const data=req.body;
        console.log(data);
        const result=await toyCollection.find().toArray(data)
        res.send(result)
    })
    app.post('/toy',async(req,res)=>{
        const toy=req.body;
        const result=await toyCollection.insertOne(toy);
        res.send(result)
    })
    app.get('mytoyesort',async(req,res)=>{
      let query={}
      if(req.query?.email){
        query={email:req.query.email}

      }
      const result=await toyCollection.find(query).sort({price:-1}).toArray();
      res.send(result)
    })
    app.get('/myToys/:email',async(req,res)=>{
      // const email=req.params.email;
      const result= await toyCollection.find({sellerEmail:req.params.email}).toArray();
      res.send(result)
    })
    app.get('/toy/:name',async(req,res)=>{
      // const email=req.params.email;
      const result= await toyCollection.find({name:req.params.name}).toArray();
      res.send(result)
    })
    app.get('/myToys/:id',async(req,res)=>{
      const id=req.params.id;
      const query=({_id:new ObjectId(id)})
      const result= await toyCollection.findOne(query)
      res.send(result)
    })
    app.get('/toy/:category',async(req,res)=>{
      // const email=req.params.email;
      const result= await toyCollection.find({category:req.params.category}).toArray();
      res.send(result)
    })

    app.get('/toy/:name',async(req,res)=>{
      const text=req.params.name;
      const result=await toyCollection
      .find({
        $or:[
          {title:{$regex:text,$option:'i'}}
        ]
      }).toArray();
      res.send(result)
    })

    
    // const indexKey={name:1}
    // const indexOption={name:'nameCategory'}
    // const result=await 
    // app.get('/toy/:name',async(req,res)=>{
    //   // const email=req.params.email;
    //   const result= await toyCollection.filter({name:req.params.name}).toArray();
    //   res.send(result)
    // })
    app.get('/myToys/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await toyCollection.findOne(query)
      res.send(result)
      
    })
    app.delete('/myToys/:id',async(req,res)=>{
      const id =req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await toyCollection.deleteOne(query)
      res.send(result)
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

app.get('/',(req,res)=>{
    res.send('Server is Running');
})

app.listen(port,()=>{
    console.log(`this port is coming ${port}`);
})