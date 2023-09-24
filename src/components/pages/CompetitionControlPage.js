import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Context} from "../../index";
import {fetchCompetitionGroups, fetchCurrentCompetition, modifyCompetitionGroup} from "../../http/competitionAPI";
import {Dropdown, Form} from "react-bootstrap";
import MyButton from "../../UI/MyButton/MyButton";
import {
    addCompetitionFirstGroupHeats, addCompetitionTeamHeats, addCompetitionTeamNextRoundHeat,
    fetchCompetitionGroupHeats,
    fetchCompetitionTeamGroupHeats
} from "../../http/heatAPI";
import {flushSync} from "react-dom";
import useDebounce from "../../hooks/useDebounce";
import NextRoundBlock from "../nextRoundBlock";
import {fetchCompetitionTeams} from "../../http/contestantAPI";

const CompetitionControlPage = observer(() => {
    const {competitionId} = useParams()
    const {competition, loading} = useContext(Context)
    const [teamType, setTeamType] = useState(false);
    const [groups, setGroups] = useState([]);
    const [addTeams, setAddTeams] = useState(false);
    const [updGroup, setUpdGroup] = useState(1);
    const rounds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const statuses = ['Ожидание', 'В процессе', 'Пауза', 'Завершено']
    const [currentHeats, setCurrentHeats] = useState([]);
    const [currentTeam, setCurrentTeam] = useState({name: '', id: ''});
    const [currentTeamHeats, setCurrentTeamHeats] = useState([]);
    const [teams, setTeams] = useState([]);
    const [nextRound, setNextRound] = useState(false);
    const [currentGroup, setCurrentGroup] = useState({description: '', round: '', status: '', id: ''});
    const navigate = useNavigate()

    useEffect(() => {
        loading.setLoading(true)
        fetchCompetitionGroups({competitionId}).then((data) => setGroups([...data].sort((a,b) => a.id - b.id)))
        fetchCurrentCompetition(competitionId).then((data) => competition.setCurrentCompetition(data))
        fetchCompetitionTeams({competitionId}).then((data) => setTeams(data))
        if (currentGroup.id) {
            fetchCompetitionGroupHeats({groupId: currentGroup.id, round: currentGroup.round}).then((data) => setCurrentHeats([...data].sort((a, b) => a.order - b.order)))
        }
        if (currentGroup.id && teamType) {
            fetchCompetitionTeamGroupHeats({groupId: currentGroup.id, round: currentGroup.round}).then((data) => {
                console.log(data)
                setCurrentTeamHeats([...data].sort((a, b) => a.order -b.order))
            })
        }
        loading.setLoading(false)
    }, [loading.refresh, currentGroup.id, teamType]);

    useDebounce(async () => await modifyCompetitionGroup({id: currentGroup.id, round: currentGroup.round, status: currentGroup.status})
        .then(() => loading.setRefresh(prev => prev +1)), 100, [updGroup])

    const addFirstGroupHeats = async () => {
        await addCompetitionFirstGroupHeats({
            groupId: currentGroup.id,
            round: currentGroup.round
        }).then(() => loading.setRefresh(prev => prev + 1))
    }

    const addTeamNextRound = async () => {
        await addCompetitionTeamNextRoundHeat({
            groupId: currentGroup.id,
            round: currentGroup.round
        })
    }

    const addTeamGroupHeats = async () => {
        let order = 1 + (currentTeamHeats?.length || 0)
        await addCompetitionTeamHeats({
            teamId: currentTeam.id,
            round: currentGroup.round,
            groupId: currentGroup.id,
            order: order
        }).then(() => loading.setRefresh(prev => prev + 1))
    }

    const modifyGroup = async (id, description, round, status) => {
        setCurrentGroup({id, description, round, status})
        setUpdGroup(prev => prev+1)

    }

    const click = () => {
        console.log(currentTeamHeats)
    }


    return (
        <div className='competition-control w-100 p-2 d-flex flex-column align-items-center'>
            <MyButton classes='back-nav-btn' onClick={() => navigate(`/edit_competition/${competitionId}`)}>Назад к сореванованию</MyButton>
            <h1>Управление соревнованием. {competition.currentCompetition?.name}.</h1>
            {competition.currentCompetition?.teamType &&
            <Form>
                <Form.Switch value={teamType} onChange={() => setTeamType(prev => !prev)} label='Командный режим' />
            </Form>
            }
            {groups?.length>0 &&
                <div className='group-list mt-3 p-2'>
                    <div className='header'>
                        <div>Группа</div>
                        <div className='text-center'>Раунд</div>
                        <div className='text-center'>Статус</div>
                    </div>
                    {groups.map(g =>
                        <div className='group pt-1 pb-2' key={g.id}>
                            <div><Form>
                                <Form.Check
                                    className='d-flex gap-2 align-items-center'
                                    type='radio'
                                    value={g.id}
                                    label={g.description}
                                    onChange={(e) => {
                                        setCurrentGroup({description: g.description, round: g.round, status: g.status, id: g.id})
                                    }}
                                    checked={g.id === currentGroup.id}
                                />
                            </Form></div>
                            <div>
                                <Dropdown className="col-sm d-flex justify-content-center">
                                    <Dropdown.Toggle className='w-50 round'>{g.round}</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {rounds?.length >= 1 && rounds.map(r =>
                                            <Dropdown.Item onClick={() => modifyGroup(g.id, g.decsription, r, g.status)} title={r} key={r}>{r} </Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown></div>
                            <div>
                                <Dropdown className="col-sm d-flex justify-content-center ">
                                    <Dropdown.Toggle className='w-100 status'>{g.status}</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {statuses?.length >= 1 && statuses.map(s =>
                                            <Dropdown.Item onClick={() => modifyGroup(g.id, g.decsription, g.round, s)} title={s} key={s}>{s} </Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown></div>
                        </div>

                        )
                    }
                    {(currentGroup.round === 1 && !currentHeats.length>0 && !teamType) &&
                        <MyButton classes='w-100 mt-3' onClick={() => addFirstGroupHeats()}>Добавить первый круг
                            заездов</MyButton>
                    }
                </div>
            }
            {currentHeats.length>0 && currentGroup.id &&
            <Form>
                <Form.Switch value={nextRound} onChange={() => setNextRound(prev => !prev)} label='Следующий раунд' />
            </Form>
            }
            {(currentHeats.length>0 && nextRound && currentGroup.id && !teamType ) &&
                <NextRoundBlock round={currentGroup.round} groupId={currentGroup.id} groups={groups} contestantsNumber={currentHeats?.length} />
            }

            {(nextRound && currentGroup.id && teamType) &&
                <MyButton onClick={() => addTeamNextRound()}>Добавить новый командный раунд</MyButton>
            }
            {teamType &&
            <Form>
                <Form.Switch value={addTeams} onChange={() => setAddTeams(prev => !prev)} label='Добавить команды'/>
            </Form>
            }

            {teamType && addTeams && teams?.length>0 &&
            <div>
                <h4>Добавить заезды для команды:</h4>
                <Dropdown className="col-sm d-flex justify-content-center">
                    <Dropdown.Toggle className='w-50 round'>{currentTeam?.name ? currentTeam?.name : 'Выберите команду'}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {teams.map(t =>
                            <Dropdown.Item onClick={() => setCurrentTeam({id: t.id, name: t.name})} title={t.name} key={t.id}>{t.name} </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                <MyButton disabled={!currentGroup.id || !currentTeam.id  || !currentGroup.round} onClick={() => addTeamGroupHeats()} classes='mt-2 w-100'>Создать список заездов для команды</MyButton>
            </div>
            }


            {currentHeats.length>0 && !teamType &&
                <div className='group-list mt-3'>
                    <h4>Список заездов:</h4>
                    <div className='header d-flex justify-content-between mb-2'>
                        <div>Участник</div>
                        <div>Сумма баллов</div>
                    </div>
                    {currentHeats.map(h =>
                        <div className='d-flex justify-content-between' key={h.id}>
                            <div><Link to={`/heat/${h.id}`}>{h.order}. {h?.contestant?.name} {h?.contestant?.number>0 && `- ${h.contestant.number}`}</Link></div>
                            <div className='text-right'>{h.total}</div>
                        </div>
                        )}
                </div>
            }

            {currentTeamHeats.length>0 && teamType &&
                <div className='group-list mt-3'>
                    <h4>Список заездов:</h4>
                    <div className='header d-flex justify-content-between mb-2'>
                        <div>Участник</div>
                        <div>Сумма баллов</div>
                    </div>
                    {currentTeamHeats.map(cth =>
                        <div key={cth.id}>
                            <div className='header d-flex justify-content-between mb-2 mt-3'>
                                <div>{cth.order}. {cth?.team?.name}</div>
                                <div><strong>{cth.total}</strong></div>
                            </div>
                            {cth?.heat?.length>0 &&
                            <div>
                                {cth.heat.sort((a,b) => a?.contestant?.teamOrder - b?.contestant?.teamOrder).map((h, index) =>
                                    <div className='d-flex justify-content-between' key={h.id}>
                                        <div><Link to={`/heat/${h.id}`}>{index+1}. {h?.contestant?.name} {h?.contestant?.number>0 && `- ${h.contestant.number}`}</Link></div>
                                        <div className='text-right'>{h.total}</div>
                                    </div>
                                )}
                            </div>
                            }

                        </div>

                    )}








                </div>
            }


        </div>
    );
});

export default CompetitionControlPage;