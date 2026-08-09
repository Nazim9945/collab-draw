import { SECRET_KEY } from "@repo/common";
import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { RequestHandler } from "../index";


const auth=async(req:RequestHandler,res:Response,next:NextFunction)=>{

        try {
            const token=req.cookies.token
            if(!token) return res.json({
              success: false,
              message: "failed",
            });
            
            // verify via jwt
            const decode=jwt.verify(token,SECRET_KEY) as {userId:string};
             if (!decode || !decode.userId)
               return res.json({
                 success: false,
                 message: "Token is not valid",
               });
           req.userId=decode.userId
            next()

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success:false,
                message:"System Error while authorizing user"
            })
        }



}


export default auth