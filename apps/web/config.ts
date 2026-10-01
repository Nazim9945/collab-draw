import axios from "axios"


const BACKEND_URL=process.env.NEXT_PUBLIC_BACKEND_URL;
const WS_URL = process.env.NEXT_PUBLIC_WS_URL


const apiInstance=axios.create({
    baseURL:BACKEND_URL,
    withCredentials:true
})

export {apiInstance,WS_URL}