import z from 'zod'
import 'dotenv/config'

const UserSignInSchema=z.object({
    email:z.email(),
    password:z.string()
})


const UserSignUpSchema = z.object({
  username: z.string(),
  password: z.string(),
  email:z.email()
});

export const RoomSchema = z.object({
 roomName:z.string()
});
export const SECRET_KEY=process.env.SECRET_KEY || "Hello";



export {UserSignInSchema,UserSignUpSchema}