import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import { generateDepositAddress } from './config.js';

const app = express();


const conMongoose = async()=>{
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/eth_stake');
    console.log(conn.connection.host);
  } catch (error) {
    console.log(`message: ${error.message}`);
  }
}

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  depositAddress: { type: String, unique: true },
  walletIndex: { type: Number, unique: true },
}, 
{ timestamps: true }
); 
const User = mongoose.model("User", userSchema);

conMongoose();

app.use(cors());
app.use(express.json());


app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'enter all the details' });
    }


    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passHash = await bcrypt.hash(password, 10);

    const lastUser = await User.findOne().sort({ walletIndex: -1 });
    const nextIndex = lastUser ? lastUser.walletIndex + 1 : 0;

    const { address } = generateDepositAddress(nextIndex);

    const user = await User.create({
      email,
      password: passHash,
      depositAddress: address,
      walletIndex: nextIndex,
    });

    return res.status(201).json({
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});

app.get('/depositAddress/:userId',async(req,res)=>{
  try {
    const findUser = await User.findById(req.params.userId);

    if (!findUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if(findUser){
      return res.json({
        depositAddress: findUser.depositAddress
      })
    }
  } catch (error) {
    res.status(400).json({message:`cannot get the deposit address of the user`})
  }
})


app.listen(3000, ()=>{
  console.log(`app is listening at 3000 port: `);
})