import express from 'express'
import morgan from 'morgan'
import auth from './middleware/auth.js';
import {UserSignInSchema, UserSignUpSchema,SECRET_KEY, RoomSchema} from "@repo/common"
import { Request } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import {prisma} from "@repo/db/prisma"
import cors from 'cors'
export interface RequestHandler extends Request {
  userId?: string;
}
const PORT=3001

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())



app.post('/signup',async(req,res)=>{
     const { username, password,email } = req.body;
     if(!username || !password || !email){
       return res.status(401).json({
         success: false,
         message: "All Fields are Required!!",
       });
     }
      if (!UserSignUpSchema.safeParse({ username, password, email }).success) {
        return res.status(401).json({
          success:false,
          message: "Invalid credentials",
        });
      }

      const isExist=await prisma.user.findFirst({
        where:{
          email
        }
      });
      if(isExist){
         return res.status(200).json({
           success: false,
           message: "User already exist"
         });
      }
      let hash_pwd="";
      try {
        hash_pwd = await bcrypt.hash(password, 10);

      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success:false,
          message:"error while hashing pwd"
        })
      }
    try {
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hash_pwd,
        },
        select:{
          id:true,
          email:true,
          username:true
        }
      });
      const payload = {
    userId:user.id
};
      const token=jwt.sign(payload,SECRET_KEY,{
        expiresIn:'7d'
      })
      
      return res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 60 * 1000,
          secure: true
        })
        .status(200)
        .json({
          success: true,
          data: user,
          token,
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "error while putting entry in Database",
      });
    }
})
app.post('/signin',async(req,res)=>{
   
     const { email, password } = req.body;
if ( !password || !email) {
  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
}
     if (!UserSignInSchema.safeParse({ email, password}).success) {
       return res.status(401).json({
         success:false,
         message: "Invalid credentials",
       });
     }
    
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      }
    });
    
    // db-call
    if(!user ||  ! await bcrypt.compare(password,user.password)){
       return res.status(401).json({
         success: false,
         message:"Invalid credentials"
       });
    }
    // @ts-ignore
    delete user.password
    const payload = {
      userId: user.id,
    };
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "7d",
    });
    
    return res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 60 * 1000,
        secure:true
        
      })
      .status(200)
      .json({
        success: true,
        data: user,
        token,
      });
})

app.post('/create-room',auth,async(req:RequestHandler,res)=>{
    
    const userId=req.userId
    const { roomName}=req.body
    // zod test
    if(!userId || !roomName || !RoomSchema.safeParse({roomName}).success){
      return res.status(401).json({
        success:false,
        message:"Invalid Input"
      })
    }
    await prisma.room.create({data:{
      userId:Number(userId),
      slug:roomName
    }})
    
    return res.status(200).json({
        message:"room created successfully!!"
    })
})

app.get('/allrooms',auth,async(req,res)=>{
      // show room that user has joined
      // show all the rooms
     
      const rooms= await prisma.room.findMany({});
      return res.status(201).json({
        success:true,
        data:rooms
      })
      //( optional ) add pagination for rooms
      
})
app.get('/',(req,res)=>{
   return res.send("hello world")

})

app.listen(PORT,()=>{
    console.log("http-backend is running at port ",PORT)
})