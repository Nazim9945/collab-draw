import express from 'express'
import auth from './middleware/auth';
import {UserSignInSchema} from '@repo/common/src/types'
const PORT=3000

const app = express();


app.use(express.json())



app.get('/signup',(req,res)=>{
    return res.json({
        user:"Hello Now i am registered!!"
    })
})
app.get('/signin',(req,res)=>{
    const {username,password}=req.body
    if(!UserSignInSchema.safeParse({username,password})){
        return res.json({
            message:"Invalid credentials"
        })
    }
    const userid=123;
    // db-call
    return res.json({
        message:"user logged in"
    })
})

app.get('/create-room',auth,(req,res)=>{
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