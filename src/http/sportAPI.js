import {$authHost, $host} from "./index";


export const fetchAllSports = async () => {
    const {data} = await $host.get('api/sport/')
    return data
}

export const fetchCurrentSport = async (id) => {
    const {data} = await $host.get(`api/sport/current/${id}`)
    return data
}

export const addSport = async (name) => {
    const {data} = await $authHost.post('api/sport', {name})
    return data
}

export const modifySport = async (name, id) => {
    if(window.confirm('Внесьти изменения?')) {
        const {data} = await $authHost.patch(`api/sport/current/${id}`, {name})
        return data
    }
}

export const deleteSport = async (id) => {
    if(window.confirm('Уверены что хотите полностью удалить этот вид спорта?!')) {
        const {data} = await $authHost.delete(`api/sport/current/${id}`)
        return data
    }
}

export const deleteCategory = async (id) => {
    if(window.confirm('Уверены что хотите удалить эту категорию ?')) {
        const {data} = await $authHost.delete(`api/category/current/${id}`)
        return data
    }
}

export const addCategory = async (name, categoryId, sportId) => {
    if(window.confirm('Добавить новую категорию?')) {
        const {data} = await $authHost.post(`api/category/`, {name, categoryId, sportId})
        return data
    }
}

export const fetchCategory = async (id) => {
    const {data} = await $host.get(`api/category/current/${id}`)
    return data
}

