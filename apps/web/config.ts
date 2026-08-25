import axios from "axios"


const BACKEND_URL="http://localhost:3001"
const WS_URL = "ws://localhost:3002";


const apiInstance=axios.create({
    baseURL:BACKEND_URL,
    withCredentials:true
})

export {apiInstance,WS_URL}