import axios from "axios"


const BACKEND_URL="http://localhost:3001"


const apiInstance=axios.create({
    baseURL:BACKEND_URL,
    withCredentials:true
})

export {apiInstance}