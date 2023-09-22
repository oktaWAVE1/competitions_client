import {$authHost, $host} from "./index";


export const addCompetitionTeam = async (newTeam) => {
    const {data} = await $authHost.post(`api/team`, (newTeam))
    return data
}

export const fetchCompetitionContestants = async ({competitionId}) => {
    const {data} = await $authHost.get(`api/contestant/current/${competitionId}`)
    return data
}

export const fetchCompetitionTeams = async ({competitionId}) => {
    const {data} = await $authHost.get(`api/team/${competitionId}`)
    return data
}

export const delCompetitionTeam = async ({id}) => {
    if(window.confirm('Уверены что хотите удалить команду?')) {
        const {data} = await $authHost.delete(`api/team/current/${id}`)
        return data
    }
}

export const delCompetitionTeamImg = async ({id}) => {
    if(window.confirm('Уверены что хотите удалить изображение команды?')) {
        const {data} = await $authHost.delete(`api/team/img/${id}`)
        return data
    }
}

export const changeCompetitionTeamImg = async (changes) => {
        const {data} = await $authHost.patch(`api/team/img`, (changes))
        return data
}

export const changeCompetitionTeam = async ({id, name, color}) => {
    const {data} = await $authHost.patch(`api/team/current/${id}`, {name, color})
    return data
}

export const addCompetitionContestant = async (newContestant) => {
    const {data} = await $authHost.post(`api/contestant`, (newContestant))
    return data
}


export const changeCompetitionContestantImg = async (changes) => {
    const {data} = await $authHost.patch(`api/contestant/img`, (changes))
    return data
}

export const changeCompetitionContestant = async ({id, name, number, teamId, teamOrder}) => {
    const {data} = await $authHost.patch(`api/contestant/person/${id}`, {name, number, teamId, teamOrder})
    return data
}



export const delCompetitionContestant= async ({id}) => {
    if(window.confirm('Уверены что хотите удалить участника?')) {
        const {data} = await $authHost.delete(`api/contestant/person/${id}`)
        return data
    }
}

export const delCompetitionContestantImg = async ({id}) => {
    if(window.confirm('Уверены что хотите удалить изображение участника?')) {
        const {data} = await $authHost.delete(`api/contestant/img/${id}`)
        return data
    }
}

export const fetchContestant = async ({id}) => {
    const {data} = await $host.get(`api/contestant/person/${id}`)
    return data
}

export const fetchTeam = async ({id}) => {
    const {data} = await $host.get(`api/team/current/${id}`)
    return data
}

