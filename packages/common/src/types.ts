import z from 'zod'
import 'dotenv/config'

const UserSignInSchema=z.object({
    username:z.string(),
    password:z.string()
})


const UserSignUpSchema = z.object({
  username: z.string(),
  password: z.string(),
  email:z.email()
});

export const SECRET_KEY=process.env.SECRET_KEY || "Hello";



export {UserSignInSchema,UserSignUpSchema}