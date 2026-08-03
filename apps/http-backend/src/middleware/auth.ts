import { NextFunction, Request, Response } from "express"



const auth=async(req:Request,res:Response,next:NextFunction)=>{

        try {
            const token=req.cookies.token
            if(!token) return res.json({message:"failed"})
            
            // verify via jwt
            // decode the token
            next()

        } catch (error) {
            console.log(error)
        }



}


export default auth