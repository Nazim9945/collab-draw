import express from 'express'
import auth from './middleware/auth.js';
import {UserSignInSchema, UserSignUpSchema} from "@repo/common/types"


import {prisma} from "@repo/db/prisma"

const PORT=3001

const app = express();


app.use(express.json())



app.post('/signup',async(req,res)=>{
     const { username, password,email } = req.body;
    const data=await prisma.user.create({
      data:{
        email,
        username,
        password
      }
    })
     if (!UserSignUpSchema.safeParse({ username, password,email })) {
       return res.json({
         message: "Invalid credentials",
       });
     }
     
    return res.json({
        user:data
    })
})
app.post('/signin',(req,res)=>{
   
     const { username, password } = req.body;

     if (!UserSignInSchema.safeParse({ username, password})) {
       return res.json({
         message: "Invalid credentials",
       });
     }
    const userid=123;
    // db-call
    return res.json({
        message:"user logged in"
    })
})

app.post('/create-room',auth,(req,res)=>{
    // db-call
    return res.json({
        message:"room created successfully!!"
    })
})
app.get('/',(req,res)=>{
    res.send("hello world")

})

app.listen(PORT,()=>{
    console.log("http-backend is running at port ",PORT)
})