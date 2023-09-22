import axios from "axios";
import {check} from "./userAPI";

axios.defaults.withCredentials = true

const $host = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_API_URL
})

const $authHost = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_API_URL
})

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

$authHost.interceptors.request.use(authInterceptor)
$authHost.interceptors.response.use((config) => {
    return config
},  async (error) => {
    const originalRequest = error.config;
    if(error.response.status === 401 && error.config && !originalRequest._isRetry) {
        originalRequest._isRetry = true
        try {
            const response = await check()
            return $authHost.request(originalRequest)
        } catch (e) {
            console.log("Не авторизован")
        }
    }
})

export {
    $host,
    $authHost
}