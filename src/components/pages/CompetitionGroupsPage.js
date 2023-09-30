import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Context} from "../../index";
import Loader from "../../UI/Loader/Loader";
import MyButton from "../../UI/MyButton/MyButton";
import {
    addAllContestantsToGroup,
    addCompetitionGroup, addContestantToGroup, delCompetitionGroup, delCompetitionGroupMember,
    fetchCompetitionGroups,
    fetchCurrentCompetition,
    modifyCompetitionGroup
} from "../../http/competitionAPI";
import {Accordion, Dropdown, Form} from "react-bootstrap";
import {fetchCompetitionContestants} from "../../http/contestantAPI";
import {useSearch} from "../../hooks/useSearch";
import useDebounce from "../../hooks/useDebounce";
import {Helmet} from "react-helmet";

const CompetitionGroupsPage = () => {
    const {competitionId} = useParams()
    const {competition, loading, user} = useContext(Context)
    const [refresh, setRefresh] = useState(1);
    const [groups, setGroups] = useState([]);
    const [query, setQuery] = useState('');
    const [groupType, setGroupType] = useState(true);
    const [contestants, setContestants] = useState([]);
    const [currentGroup, setCurrentGroup] = useState({id: '', description: '', level: '', status :''});
    const [currentContestant, setCurrentContestant] = useState({id: '', groupDescription: '', groupId :'', currentMembers: []});
    const navigate = useNavigate()
    const searchedContestants = useSearch(contestants, query)

    useEffect(() => {
        loading.setLoading(true)
        fetchCurrentCompetition(competitionId).then((data) => competition.setCurrentCompetition(data))
        fetchCompetitionContestants({competitionId}).then((data) => setContestants(data))
        fetchCompetitionGroups({competitionId}).then((data) => setGroups([...data].sort((a, b) => a.id - b.id))).finally(() => loading.setLoading(false))
    }, [loading.refresh, refresh]);

    useDebounce(() => {
        if(currentContestant.groupId){
            loading.setLoading(true)
            let members = []
            const groupMembers = groups.filter(g => g.id === currentContestant.groupId)[0]['group_members']
            for (let i = 0; i < groupMembers.length; i++) {
                members.push(groupMembers[i]['contestantId'])
            }
            setCurrentContestant({...currentContestant, currentMembers: members})
            loading.setLoading(false)
        }
    }, 200, [currentContestant.groupId, groups, refresh])


    const addGroup = async () => {
        await addCompetitionGroup({
            competitionId,
            description: currentGroup.description,
            level: currentGroup.level,
            status: currentGroup.status
        }).then(() => loading.setRefresh(prev => prev +1)).then(() => setCurrentGroup({id: '', description: '', level: '', status :''}))
    }

    const delGroupMember = async(id) => {
        await delCompetitionGroupMember({id}).then(() => setRefresh(prev => prev +1))
    }

    const addGroupMember = async (contestantId) => {
        await addContestantToGroup({
            groupId: currentContestant.groupId,
            contestantId
        }).then(() => setRefresh(prev => prev +1))
    }

    const addAllContestants = async () => {
        await addAllContestantsToGroup({groupId: currentContestant.groupId, competitionId})
            .then(() => loading.setRefresh(prev => prev +1)).then(() => setCurrentContestant({id: '', groupDescription: '', groupId :'', currentMembers: []}))
    }

    const editGroup = async () => {
        await modifyCompetitionGroup({
            id: currentGroup.id,
            description: currentGroup.description,
            status: currentGroup.status,
            level: currentGroup.level
        }).then(() => loading.setRefresh(prev => prev +1)).then(() => setCurrentGroup({id: '', description: '', level: '', status :''}))
    }

    const delGroup = async (id) => {
        await delCompetitionGroup({id}).then(() => setRefresh(prev => prev +1))
    }

    if (loading.loading) {
        return <Loader />
    }
    return (
        <fieldset disabled={user?.user?.role!=='ADMIN' && Number(user?.user?.id)!==Number(competition?.currentCompetition?.adminId)} className='w-100 p-2 competition-groups-list'>
            <MyButton classes='back-nav-btn' onClick={() => navigate(`/edit_competition/${competitionId}`)}>Назад к сореванованию</MyButton>
                <h2>Редактировать группы и их участников. {competition?.currentCompetition?.name}</h2>
            <div className='d-flex flex-row justify-content-center gap-3 m-3'>
                <span className={!groupType ? 'active' : ''}>Добавить участника</span>
                <Form style={{marginLeft: '10px'}}>
                    <Form.Switch checked={groupType} onChange={() => {
                        setGroupType(prev => !prev)
                        setCurrentContestant({id: '', groupDescription: '', groupId :'', currentMembers: []})
                        setCurrentGroup({id: '', description: '', level: '', status :''})
                    }
                    } />
                </Form>
                <span className={groupType ? 'active' : ''}>Добавить Группу</span>
            </div>
            {groupType ?
                <div>
                    {currentGroup.id ? <h3>Изменить группу</h3> : <h3>Добавить группу:</h3>}
                    {currentGroup.id &&
                        <MyButton onClick={() => setCurrentGroup({id: '', description: '', level: '', status: ''})}>Новая
                            группа</MyButton>}
                    <Form className='d-flex flex-column gap-1 mb-1'>
                        <Form.Control type='input' value={currentGroup.description}
                                      onChange={e => setCurrentGroup({...currentGroup, description: e.target.value})}
                                      placeholder='Описание группы'/>
                        <Form.Control type='number' value={currentGroup.level}
                                      onChange={e => setCurrentGroup({...currentGroup, level: e.target.value})}
                                      placeholder='Уровень мастерства. (1 - новички, 2 -любители, 3 - мастера, 9 - все)'/>
                        <Form.Control type='input' value={currentGroup.status}
                                      onChange={e => setCurrentGroup({...currentGroup, status: e.target.value})}
                                      placeholder='Статус'/>
                    </Form>
                    {currentGroup.id ?
                        <MyButton onClick={() => editGroup()}
                                  disabled={!currentGroup.description || !currentGroup.level} classes='w-100'>Изменить
                            группу</MyButton> :
                        <MyButton onClick={() => addGroup()} disabled={!currentGroup.description || !currentGroup.level}
                                  classes='w-100'>Добавить группу</MyButton>
                    }
                </div> :
                <div>


                    <h3>Добавить члена группы:</h3>
                    <div className="row mb-3 mt-3">
                        <div className="col-sm d-flex justify-content-start"><h4>Выберите группу</h4></div>

                    <Dropdown className="col-sm d-flex justify-content-center">
                        <Dropdown.Toggle>{currentContestant.groupDescription ? `${currentContestant.groupDescription}` : "Выберите группу"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {groups?.length >= 1 && groups.map(g =>
                                <Dropdown.Item onClick={() => setCurrentContestant({...currentContestant, groupDescription: g.description, groupId: g.id})
                                } title={g.description} key={g.id}>{g.description} </Dropdown.Item>
                            )}
                        </Dropdown.Menu>

                    </Dropdown>
                        <div className="col-sm d-flex justify-content-end">
                            <MyButton disabled={!currentContestant.groupId} onClick={() => addAllContestants()}>Добавить всех участников</MyButton>
                        </div>
                    </div>
                    {currentContestant.groupDescription &&
                        <div>
                            {searchedContestants.filter(c => (!currentContestant?.currentMembers.includes(c.id)))?.length > 0 ?
                                <Form>
                                    <Form.Control className='mb-3' type='input' value={query}
                                                  onChange={e => setQuery(e.target.value)}
                                                  placeholder='Поиск участника'/>
                                </Form> :
                                <h4>Все участники добавлены</h4>
                            }
                            {searchedContestants?.length > 0 &&
                                <div>
                                    {searchedContestants.filter(c => (!currentContestant.currentMembers.includes(c.id))).map(c =>
                                        <div className='d-flex flex-row' key={c.id}>
                                            <div>{c.name} {c.number > 0 && c.number}
                                            </div>
                                            <div><span title='Добавить участника в группу' onClick={() => addGroupMember(c.id)} className="mini-btn material-symbols-outlined">
                                                    add
                                                 </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            }
                        </div>
                    }
                </div>

            }
            {groups?.length<1 ?
                <h2 className='mt-3'>Групп пока нет.</h2> :
                <div className='mt-3'>

                    <div className='header mt-3'>
                        <div>Описание</div>
                        <div className='text-center'>Уровень</div>
                        <div className='text-center'>Статус</div>
                    </div>
                    <div>

                            <div>
                            {groups.map(g =>
                                <div className='group' key={g.id}>
                                    <div>
                                        <Form>
                                            <Form.Check
                                            className='d-flex gap-2 align-items-center'
                                            type='radio'
                                            value={g.id}
                                            label={g.description}
                                            onChange={(e) => {
                                                setCurrentGroup({description: g.description, level: g.level, status: g.status, id: g.id})
                                                setGroupType(true)
                                            }}
                                            checked={g.id === currentGroup.id}
                                            />
                                        </Form>
                                    </div>
                                    <div className='text-center'>{g.level}</div>
                                    <div className='text-center'>{g.status}</div>
                                    <div className='d-flex align-items-center'>
                                        {(user.user.role === 'ADMIN' || user.user.id === competition.currentCompetition.adminId) &&
                                            <span title='Удалить категорию' onClick={() => delGroup(g.id)}
                                                  className="del-mini-btn material-symbols-outlined">
                                                                                                    close
                                                    </span>
                                        }
                                    </div>
                                    <Accordion className='mt-0 w-100' defaultActiveKey={g.id} flush>
                                        <Accordion.Item eventKey={g.id}>
                                            <Accordion.Header className='classic_btn'>Список участников</Accordion.Header>
                                            <Accordion.Body className='show'>
                                                <ul>
                                                    {g.group_members.map(gm =>
                                                            <li key={gm.id}>{gm?.contestant?.name} {gm?.contestant?.number>0 && gm?.contestant?.number}   <span title='Удалить участника' onClick={() => delGroupMember(gm.id)}
                                                                                                                                                                className="del-mini-btn material-symbols-outlined">
                                                                                                                                                                        close
                                                                                                                                                                    </span></li>
                                                    )}
                                                </ul>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>

                                </div>
                                )}
                            </div>

                    </div>
                </div>
            }
            <Helmet>
                <title>Редактирование групп соревнования | wow-contest.ru</title>
            </Helmet>
        </fieldset>
    );
};

export default CompetitionGroupsPage;