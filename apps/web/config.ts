import axios from "axios"
import {BACKEND_URL as B_URL, WS_URL as W_URL} from '@repo/common'

const BACKEND_URL=B_URL
const WS_URL = W_URL


const apiInstance=axios.create({
    baseURL:BACKEND_URL,
    withCredentials:true
})

export {apiInstance,WS_URL}