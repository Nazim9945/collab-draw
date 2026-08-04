import z from 'zod'


const UserSignInSchema=z.object({
    username:z.string(),
    password:z.string()
})


const UserSignUpSchema = z.object({
  username: z.string(),
  password: z.string(),
  email:z.email()
});

export {UserSignInSchema,UserSignUpSchema}