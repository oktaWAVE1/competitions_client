import {$authHost, $host} from "./index";


export const addCompetitionFirstGroupHeats = async ({groupId, round}) => {
    const {data} = await $authHost.post(`api/heat/group/`, {groupId, round})
    return data
}

export const addCompetitionGroupHeat = async ({order, round, contestantId, competitionId, groupId}) => {
    const {data} = await $authHost.post(`api/heat/`, {order, round, contestantId, competitionId, groupId})
    return data
}
export const addCompetitionTeamHeats = async ({teamId, order, round, groupId}) => {
    const {data} = await $authHost.post(`api/heat/team_heat/`, {teamId, order, round, groupId})
    return data
}

export const addCompetitionNextRoundHeat = async ({groupId, round, nextRoundNum, nextGroupNum, nextGroupId, totalNum}) => {
    if(window.confirm('Уверены, что хотите создать следующий раунд?')) {
        const {data} = await $authHost.post(`api/heat/next/`, {groupId, round, nextRoundNum, nextGroupNum, nextGroupId, totalNum})
        return data
    }
}

export const addCompetitionTeamNextRoundHeat = async ({groupId, round}) => {
    if(window.confirm('Уверены, что хотите создать следующий раунд?')) {
        const {data} = await $authHost.post(`api/heat/team_next/`, {groupId, round})
        return data
    }
}

export const fetchCompetitionGroupHeats = async ({groupId, round}) => {
    const {data} = await $authHost.get(`api/heat/group/${groupId}`, {
        params:
            {round}})
    return data
}

export const fetchCompetitionTeamGroupHeats = async ({groupId, round}) => {
    const {data} = await $host.get(`api/heat/group_team/${groupId}`, {
        params:
            {round}})
    return data
}

export const fetchCurrentHeat = async ({id}) => {
    const {data} = await $authHost.get(`api/heat/current/${id}`)
    return data
}

export const addHeatTrick = async ({basePoints, modifiers, total, heatId, competitionTrickId, competitionId}) => {
    const {data} = await $authHost.post(`api/heat/trick` , {basePoints, modifiers, total, heatId, competitionTrickId, competitionId})
    return data
}

export const delHeatTrick = async ({id}) => {
    if(window.confirm('Уверены, что хотите удалить трюк из заезда?')) {
        const {data} = await $authHost.delete(`api/heat/trick/${id}`)
        return data
    }
}

export const delCompetitionTeamHeat = async ({teamHeatId}) => {
    if(window.confirm('Уверены, что хотите удалить команду из заезда?')) {
        const {data} = await $authHost.delete(`api/heat/team_heat/${teamHeatId}`)
        return data
    }
}

export const delCompetitionContestantHeat = async ({heatId}) => {
    if(window.confirm('Уверены, что хотите удалить участника из заезда?')) {
        const {data} = await $authHost.delete(`api/heat/current/${heatId}`)
        return data
    }
}

export const modifyHeatModifier = async ({id, value, trickId}) => {
    const {data} = await $authHost.patch(`api/heat/modifier/${id}`, {value})
    await $authHost.post(`api/heat/calculate_trick/${trickId}`)

    return data
}

export const calculateHeat = async ({heatId, bonus, teamId, bonusDescription, teamHeatId}) => {
    const {data} = await $authHost.post(`api/heat/calculate_heat/${heatId}`, {bonus, bonusDescription})
    if (teamHeatId && teamId) {
        await $authHost.post(`api/heat/calculate_team_heat/${teamHeatId}`, {teamId})
    }
    return data
}