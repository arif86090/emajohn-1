const express = require('express');
require('dotenv').config();
const app = express();
const jwt =require('jsonwebtoken');
const cors=require('cors');
const port=process.env.PORT || 5000;

const ObjectId=require('mongodb').ObjectId;
app.use(cors());
app.use(express.json());

// product
// stYArai08v5EPUv1

// jwt veryfy
function verifyJwt(req,res,next){
   const authheader=req.headers.authorization;
   if(!authheader){
    return res.status(401).send({message:'unauthorize access'});
  }
  const token =authheader.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded) =>{
      if(err){
        return res.status(403).send({message:'Forbindd access'});
      }
      console.log('decoded',decoded);
      req.decoded=decoded;
      next();
    })
 
}





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://product:stYArai08v5EPUv1@cluster0.6wahq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const userCollection = client.db('products').collection('service');

  // jwt token
      app.post('/login',async(req,res)=>{
        const user=req.body;
        const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
          expiresIn: '1d'
        });
        res.send({accessToken});
      })




    app.get('/product',async(req,res) => {
      const query= {} ;
      const cursor= userCollection.find(query);
      const product=await cursor.toArray();
      res.send(product)
    })

    app.get('/product/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:ObjectId(id)};
      const result=await userCollection.findOne(query);
      res.send(result); 
    })

       // POST data
    app.post('/product',async(req,res) =>{
      const newUser =req.body;
      const result = await userCollection.insertOne(newUser);
     console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);

    });

      // delete data
    app.delete('/product/:id', async(req,res) =>{
      const id=req.params.id;
      const query={_id:ObjectId(id)};
      const result= await userCollection.deleteOne(query);
      res.send(result);
    });

    

  app.get('/myitems',verifyJwt, async(req,res) => {
      const decodedEmail=req.decoded.email;
      const email=req.query.email;
      if(email === decodedEmail){
      const query={email:email};
      const cursor= userCollection.find(query);
      const users=await cursor.toArray();
      res.send(users)
      }
      else{
        res.status(403).send({message:'forbidden acccess'})
      }
    })




  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/',(req,res) =>{
  res.send('say some thing')
})

app.listen(port,() =>{
  console.log('Assignment-11 is runing!!',port)
})