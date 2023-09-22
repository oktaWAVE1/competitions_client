import {$authHost, $host} from './index'
import jwtDecode from "jwt-decode";


export const registration = async(name, telephone, email, password) => {
    const {data} = await $host.post('api/user/registration' , {email, password, telephone, name}, {withCredentials: true})
    return data
}

export const login = async(telephone, email, password) => {
    const {data} = await $host.post('api/user/login', {email, telephone, password}, {withCredentials: true})
    localStorage.setItem('token', data.accessToken)
    return jwtDecode(data.accessToken)
}

export const check = async () => {
    const {data} = await $host.get('api/user/auth')
    if (data.accessToken){
    localStorage.setItem('token', data.accessToken)
    return jwtDecode(data.accessToken)
    } else {
        return "Не авторизован"
    }
}

export const fetchUsers = async (limit=500, offset=0) => {
    const {data} = await $authHost.get('api/user')
    return data
}


export const modifyUser = async (email, password, name, telephone, address, id, newPassword) => {
    const {data} = await $authHost.put('api/user/modify', {email, password, name, telephone, address, id, newPassword})
    return data
}

export const modifyUserRole = async (id, role) => {
    const {data} = await $authHost.patch('api/user/modify', {id, role})
    return data
}

export const getUser = async (id) => {
    const {data} = await $authHost.post('api/user/self', {id})
    return data
}


export const userLogout = async() => {
    const {data} = await $authHost.post('api/user/logout')
    return data
}

export const userResetPassMail = async(email) => {
    const {data} = await $host.post('api/user/reset', {email})
    return data
}

export const userResetPass = async(activationLink, password) => {
    const {data} = await $host.post('api/user/reset/apply', {activationLink, password}, {withCredentials: true})
    return data
}