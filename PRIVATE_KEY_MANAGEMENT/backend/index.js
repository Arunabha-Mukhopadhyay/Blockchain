const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
// const { users } = require('./model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const bs58 = require('bs58');
const { Connection, Keypair, Transaction } = require('@solana/web3.js');

const app = express();
app.use(express.json())
app.use(cors())
const connection = new Connection('https://api.devnet.solana.com');
const JWT_SECRET = "1234"

dotenv.config();

// app.post('/api/v1/signup',async (req,res)=>{
//   let username = req.body.username;
//   let password = bcrypt.hashSync(req.body.password, 10);

//   if(!username || !password){
//     return res.status(400).json({
//       message:"username and password are required"
//     })
//   }


//   const existingUser = await users.findOne({
//     username:username
//   })

//   if(existingUser){
//     return res.status(400).json({
//       message:"username already exists"
//       })
//     }

//   const keypair = Keypair.generate();

//   await users.create({
//     username: username,
//     password: password,
//     privateKey: bs58.default.encode(keypair.secretKey),
//     publicKey: keypair.publicKey.toString(),
//   }).then(() => {
//     res.json({
//       message: `User created successfully,public key is:${keypair.publicKey.toString()}`,
//     })
//   })
// })

  

// app.post('/api/v1/signin', async (req,res)=>{
//   let username = req.body.username;
//   let passwordString = req.body.password;

//   if(!username || !passwordString){
//     return res.status(400).json({
//       message:"username and password are required"
//     })
//   }

//   const existingUser = await users.findOne({
//     username: username,
//   })

//   const passMatch = existingUser? bcrypt.compareSync(passwordString, existingUser.password):false;

//   if(!passMatch){
//     return res.status(400).json({
//       message:"Invalid username or password"
//     })
//   }

//   if(existingUser){
//     const token = jwt.sign({
//       id: existingUser._id,
//       username: existingUser.username
//     },JWT_SECRET,{
//       expiresIn: '1h'
//     })

//     return res.json({
//       message: "User signed in successfully",
//       token: token
//     })
//   } else{
//     return res.status(400).json({
//       message:"Invalid username or password"
//     })
//   }
// })




app.post("/api/v1/txn/sign",async (req,res)=>{
  const serialTransaction = req.body.message;

  const transaction = Transaction.from(Buffer.from(serialTransaction))
  const keypair = Keypair.fromSecretKey(bs58.default.decode(process.env.PRIVATE_KEY))

  const{blockhash} = await connection.getLatestBlockhash();

  transaction.recentBlockhash = blockhash;
  transaction.feePayer = keypair.publicKey;

  transaction.sign(keypair);

  const signtx = await connection.sendTransaction(transaction,[keypair])
  console.log(signtx)

  res.json({
    message: "Sign up"
  })

})


app.listen(3000,()=>{
  console.log("Server started at port 3000");
})