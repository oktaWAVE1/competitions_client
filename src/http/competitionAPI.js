import {$authHost, $host} from './index'


export const createCompetition = async(competition) => {
    const {data} = await $host.post('api/competition/' , (competition))
    return data
}

export const fetchAllCompetitions = async () => {
    const {data} = await $authHost.get('api/competition/')
    return data
}

export const fetchCurrentCompetition = async (id) => {
    const {data} = await $host.get(`api/competition/current/${id}`)
    return data
}

export const fetchCompetitionImages = async ({competitionId}) => {
    const {data} = await $host.get(`api/competition/img/${competitionId}`)
    return data
}
export const fetchCompetitionReferees = async ({competitionId}) => {
    const {data} = await $host.get(`api/competition/referee/${competitionId}`)
    return data
}

export const addCompetitionImg = async(img) => {
    const {data} = await $authHost.post('api/competition/img', (img))
    return data
}

export const delCompetitionImg = async (id) => {
    if(window.confirm('Точно удалить?')) {
        const {data} = await $authHost.delete(`api/competition/img/${id}`, )
        return data
    }
}

export const delCompetition = async (id) => {
    if(window.confirm('Уверены что хотите полностью удалить все соревнование?!')) {
        const {data} = await $authHost.delete(`api/competition/current/${id}`, )
        return data
    }
}

export const editCompetition = async ({name, description, teamType, adminId, sportId, id}) => {
    if(window.confirm('Уверены что хотите сохранить изменения')) {
        const {data} = await $authHost.patch(`api/competition/current/${id}`, {name, description, teamType, adminId, sportId})
        return data
    }
}

export const addCompetitionReferee = async ({userId, competitionId}) => {
        const {data} = await $authHost.post(`api/competition/referee`, {userId, competitionId})
        return data

}

export const delCompetitionReferee = async ({id}) => {
    if(window.confirm('Уверены что хотите удалить судью из соревнования?')) {
        const {data} = await $authHost.delete(`api/competition/referee/${id}`)
        return data
    }
}

export const addCompetitionTrick = async ({competitionId, trickId}) => {
    const {data} = await $authHost.post('api/competition/trick', {competitionId, trickId})
    return data
}

export const modifyCompetitionTrick = async ({id, level, points}) => {
    const {data} = await $authHost.patch(`api/competition/trick/${id}`, {level, points})
    return data
}

export const addAllCompetitionTricks = async ({competitionId, sportId}) => {
    await $authHost.delete(`api/competition/trick/all/${competitionId}`)
    const {data} = await $authHost.post('api/competition/trick/all', {competitionId, sportId})
    return data
}

export const delCompetitionTrick = async ({id}) => {
    const {data} = await $authHost.delete(`api/competition/trick/${id}`)
    return data
}

export const delAllCompetitionTricks = async ({competitionId}) => {
    if(window.confirm('Уверены что хотите удалить все трюки из соревнования?')) {
        const {data} = await $authHost.delete(`api/competition/trick/all/${competitionId}`)
        return data
    }
}

export const addCompetitionModifier = async ({name, description, multiplier, min, max, defaultValue, order, competitionId}) => {
    const {data} = await $authHost.post('api/competition/modifier/', {name, description, multiplier, min, max, order, defaultValue, competitionId})
    return data
}

export const fetchCompetitionModifiers = async ({competitionId}) => {
    const {data} = await $authHost.get(`api/competition/modifier/current/${competitionId}`)
    return data
}

export const delCompetitionModifier = async ({id}) => {
    const {data} = await $authHost.delete(`api/competition/modifier/current/${id}`)
    return data
}

export const modifyCompetitionModifier = async ({id, name, description, multiplier, min, max, order, defaultValue}) => {
    const {data} = await $authHost.patch(`api/competition/modifier/current/${id}`, {name, description, multiplier, order, min, max, defaultValue})
    return data
}

export const fetchCompetitionGroups = async ({competitionId}) => {
    const {data} = await $host.get(`api/group/${competitionId}`)
    return data
}

export const fetchGroup = async ({groupId}) => {
    const {data} = await $host.get(`api/group/current/${groupId}`)
    return data
}


export const addCompetitionGroup = async ({competitionId, description, level, status}) => {
    const {data} = await $authHost.post(`api/group/`, {competitionId, description, level, status})
    return data
}

export const modifyCompetitionGroup = async ({id, description, level, status, round}) => {
    const {data} = await $authHost.patch(`api/group/current/${id}`, {description, level, status, round})
    return data
}

export const delCompetitionGroup = async ({id}) => {
    if(window.confirm('Уверены что хотите удалить группу из соревнования?')) {
        const {data} = await $authHost.delete(`api/group/current/${id}`)
        return data
    }
}

export const addContestantToGroup = async ({groupId, contestantId}) => {
    const {data} = await $authHost.post(`api/group/member/${groupId}`, {contestantId})
    return data
}

export const addAllContestantsToGroup = async ({groupId, competitionId}) => {
    const {data} = await $authHost.post(`api/group/group/${groupId}`, {competitionId})
    return data
}

export const delCompetitionGroupMember = async ({id}) => {
        const {data} = await $authHost.delete(`api/group/member/${id}`)
        return data
}

export const fetchAllCompetitionTricks = async ({competitionId}) => {
    const {data} = await $host.get(`api/competition/trick/all/${competitionId}`)
    return data
}


