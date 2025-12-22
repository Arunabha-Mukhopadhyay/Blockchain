const dotenv = require('dotenv')
const express = require('express')
const {users} = require('./model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const bs58 = require('bs58');
const { Connection, Keypair } = require('@solana/web3.js');

const app = express();
app.use(express.json())
app.use(cors())
const connection = new Connection('https://api.mainnet-beta.solana.com');
const JWT_SECRET = "1234"

dotenv.config();

app.post('api/v1/signup',async (req,res)=>{
  let username = req.body.username;
  let password = bcrypt.hashSync(req.body.password, 10);

  if(!username || !password){
    return res.status(400).json({
      message:"username and password are required"
    })
  }

  if(password.length < 6){
    return res.status(400).json({
      message:"password must be at least 6 characters long"
    })
  }

  users.findOne({
    username:username
  }).then((existingUser)=>{
    if(existingUser){
      return res.status(400).json({
        message:"username already exists"
      })
    }
  })

  const keypair = Keypair.generate();

  await users.create({
    username: username,
    password: password,
    privateKey: keypair.secretKey.toString(),
    publicKey: keypair.publicKey.toString(),
  }).then(()=>{
    res.json({
      message:`User created successfully,public key is:${publicKey}`,
    })
  })
})


app.post('/api/v1/signin', async (req,res)=>{
  let username = req.body.username;
  let password = req.body.password;

  if(!username || !password){
    return res.status(400).json({
      message:"username and password are required"
    })
  }

  const existingUser = await users.findOne({
    username: username,
    password: password
  })

  if(existingUser){
    const token = jwt.sign({
      id: existingUser._id,
      username: existingUser.username
    },JWT_SECRET,{
      expiresIn: '1h'
    })

    return res.json({
      message: "User signed in successfully",
      token: token
    })
  } else{
    return res.status(400).json({
      message:"Invalid username or password"
    })
  }
})

app.post("/api/v1/txn/sign",async (req,res)=>{
  
})


app.listen(3000,()=>{
  console.log("Server started at port 3000");
})