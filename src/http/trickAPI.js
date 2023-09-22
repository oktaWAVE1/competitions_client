import {$authHost} from "./index";

export const addCategoryTrick = async ({name, description, defaultPoints, defaultLevel, categoryId, sportId}) => {
    const {data} = await $authHost.post('api/trick', {name, description, defaultPoints, defaultLevel, categoryId, sportId})
    return data
}

export const modifyCategoryTrick = async ({name, description, defaultPoints, defaultLevel, id}) => {
    const {data} = await $authHost.patch(`api/trick/current/${id}`, {name, description, defaultPoints, defaultLevel})
    return data
}


export const delCategoryTrick = async ({id}) => {
    if(window.confirm('Уверены что хотите удалить трюк из категории?')) {
        const {data} = await $authHost.delete(`api/trick/current/${id}`)
        return data
    }
}

export const fetchAllTricks = async ({sportId}) => {
    const {data} = await $authHost.get(`api/trick/${sportId}`)
    return data
}