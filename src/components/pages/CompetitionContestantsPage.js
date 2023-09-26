import React, {useContext, useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {observer} from "mobx-react-lite";
import MyButton from "../../UI/MyButton/MyButton";
import Loader from "../../UI/Loader/Loader";
import {Context} from "../../index";
import {Accordion, Dropdown, Form} from "react-bootstrap";
import AddImgModule from "../addImgModule";
import {
    addCompetitionContestant,
    addCompetitionTeam, changeCompetitionContestant, changeCompetitionContestantImg, changeCompetitionTeam,
    changeCompetitionTeamImg, delCompetitionContestant, delCompetitionContestantImg,
    delCompetitionTeam,
    delCompetitionTeamImg, fetchCompetitionContestants, fetchCompetitionTeams
} from "../../http/contestantAPI";
import FullImgModal from "../modals/FullImgModal";
import {fetchCurrentCompetition} from "../../http/competitionAPI";
import {Helmet} from "react-helmet";

const CompetitionContestantsPage = observer(() => {

    const location = useLocation()
    const [imgModal, setImgModal] = useState({show: false, img: '', path: ''});
    const navigate = useNavigate()
    const {competitionId} = useParams()
    const {competition, loading} = useContext(Context)
    const [teams, setTeams] = useState([]);
    const [contestants, setContestants] = useState([]);
    const [currentTeam, setCurrentTeam] = useState({name: '', color: '#FFFFFF', img: '', id: '' });
    const [teamImg, setTeamImg] = useState(null);
    const [contestantImg, setContestantImg] = useState();
    const [activeBlock, setActiveBlock] = useState({newTeam: false, newContestant: false});
    const [currentContestant, setCurrentContestant] = useState({name: '', number: '', teamId: '', teamName: '', teamOrder: '', id: ''});
    const isTeamType = location.pathname === `/competition_teams/${competitionId}`


    useEffect(() => {
        loading.setLoading(true)
        if (!isTeamType){
            fetchCompetitionContestants({competitionId}).then(data => {
            setContestants(data)
        })
        } else {
            fetchCompetitionTeams({competitionId}).then(data => {
                setTeams(data)
            })
        }
        fetchCurrentCompetition(competitionId).then((data) => competition.setCurrentCompetition(data))

        setTeamImg(null)
        setContestantImg(null)
        setCurrentTeam({name: '', color: '#FFFFFF', img: '', id: '' })
        setCurrentContestant({name: '', number: '', teamId: '', teamName: '', teamOrder: '', id: ''})
        loading.setLoading(false)

    }, [competitionId, loading.refresh, isTeamType]);

    const delTeam = async (id) => {
        try {
            await delCompetitionTeam({id}).then(() => loading.setRefresh(prev => prev+1))
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const delContestant = async () => {
        try {
            await delCompetitionContestant({id: currentContestant.id}).then(() => loading.setRefresh(prev => prev+1))
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const delTeamImg = async (e) => {
        e.preventDefault()
        await delCompetitionTeamImg({id: currentTeam.id}).then(() => loading.setRefresh(prev => prev+1))
    }

    const delContestantImg = async () => {
        await delCompetitionContestantImg({id: currentContestant.id}).then(() => loading.setRefresh(prev => prev+1))
    }


    const editTeam = async () => {
        try {
            if (teamImg){
                const formData = new FormData()
                formData.append('file', teamImg[0])
                formData.append('id', currentTeam.id)
                await changeCompetitionTeamImg(formData)
            }
            await changeCompetitionTeam({
                id: currentTeam.id,
                name: currentTeam.name,
                color: currentTeam.color,
            }).then(() => loading.setRefresh(prev => prev+1))

        } catch (e) {
        alert(e.response.data.message)
    }
    }

    const editContestant = async () => {
        try {
            if (contestantImg){
                const formData = new FormData()
                formData.append('file', contestantImg[0])
                formData.append('id', currentContestant.id)
                await changeCompetitionContestantImg(formData)
            }
            await changeCompetitionContestant({
                id: currentContestant.id,
                name: currentContestant.name,
                number: currentContestant.number || 0,
                teamOrder: currentContestant.teamOrder,
                teamId: currentContestant.teamId
            }).then(() => loading.setRefresh(prev => prev+1))

        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const addTeam = () => {
        try {
            const formData = new FormData()
            formData.append('name', currentTeam.name)
            formData.append('color', currentTeam.color)
            if(teamImg){
                formData.append('file', teamImg[0])
            }
            formData.append('competitionId', competitionId)
            addCompetitionTeam(formData).then(() => loading.setRefresh(prev => prev +1))
        } catch (e) {
            alert(e.response.data.message)
        }

    }

    const addContestant = () => {
        try {
            const formData = new FormData()
            formData.append('name', currentContestant.name)
            if (currentContestant.number){
                formData.append('number', currentContestant.number)
            } else {
                formData.append('number', 0)
            }
            formData.append('teamId', currentContestant.teamId)
            formData.append('teamOrder', currentContestant.teamOrder)
            if (contestantImg) {
                formData.append('file', contestantImg[0])
            }
            formData.append('competitionId', competitionId)
            addCompetitionContestant(formData).then(() => loading.setRefresh(prev => prev +1))
        } catch (e) {
            alert(e.response.data.message)
        }

    }


    if(loading.loading) {
        return <Loader />
    }
    return (
        <div className='w-100 p-2'>
            <MyButton classes='back-nav-btn' onClick={() => navigate(`/edit_competition/${competitionId}`)}>Назад к сореванованию</MyButton>
            {isTeamType ?
            <h2>Редактировать команды и участников соревнования. {competition?.currentCompetition?.name}</h2> :
            <h2>Редактировать участников соревнования. {competition?.currentCompetition?.name}</h2>
               }
            {(isTeamType && teams?.length>0) &&
            <div className='competition-team-list'>
                <h5>Список команд:</h5>
                <div className='header'>
                    <div>Изображение</div>
                    <div>Цвет</div>
                    <div>Название</div>

                </div>
                {teams.map(t =>
                    <div className='team' key={t.id}>
                        <div className='team-mini-img'>{t.img && <img alt='' onClick={() => setImgModal({show: true, img: t.img, path: '/images/teams/'})} src={process.env.REACT_APP_API_URL+`/images/teams/mini/${t.img}`}/>}</div>
                        <div className='team-color' style={{backgroundColor: t.color, width: '40px', height: '30px'}}></div>
                        <div className='team-name'><Form.Check
                            className='d-flex gap-2 align-items-center pl-3'
                            type='radio'
                            value={t.id}
                            label={t.name}
                            onChange={(e) => {
                                setCurrentTeam({name: t.name, color: t.color, img: t.img, id: t.id})
                                setActiveBlock({...activeBlock, newContestant: false})
                                setCurrentContestant({name: '', number: '', teamId: '', teamName: '', teamOrder: '', id: ''})

                            }}
                            checked={t.id === currentTeam.id}
                        /></div>

                        {t?.contestants?.length>0 &&

                        <Accordion className='mt-0'>
                            <Accordion.Item eventKey={t.id}>
                                <Accordion.Header className='classic_btn'>Список участников</Accordion.Header>
                                <Accordion.Body>
                                    {t.contestants.sort((a, b)=> a.teamOrder - b.teamOrder).map(c =>
                                        <div key={c.id}>
                                            <div>
                                                <Form.Check
                                                    className='d-flex gap-2 align-items-center pl-3'
                                                    type='radio'
                                                    value={c.id}
                                                    label={`${c.teamOrder}. ${c.name} ${c.number>0 ? ` - ${c.number}` : ''}`}
                                                    onChange={(e) => {
                                                        setCurrentContestant({name: c.name, teamId: c.teamId, teamOrder: c.teamOrder, number: c.number, img: c.img, id: c.id, teamName: t.name})
                                                        setActiveBlock({...activeBlock, newTeam: false})
                                                        setCurrentTeam({name: '', color: '', img: '', id: '' })

                                                    }}
                                                    checked={c.id === currentContestant.id}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        }

                    </div>
                        )}
            </div>
            }
            {isTeamType &&
                <div>

                    {!currentTeam.id &&
                        <Form>
                            <Form.Switch onClick={() => setCurrentContestant({
                                name: '',
                                number: '',
                                teamId: '',
                                teamName: '',
                                teamOrder: ''
                            })} label='Добавить команду' checked={activeBlock.newTeam}
                                         onChange={(prev) => setActiveBlock({
                                             ...activeBlock,
                                             newContestant: false,
                                             newTeam: !activeBlock.newTeam
                                         })}/>
                        </Form>
                    }
                    {(activeBlock.newTeam || currentTeam.id) &&
                        <div className='add-change-team'>
                            <h3>{currentTeam.id ? 'Изменить команду' : 'Добавить команду:'}</h3>
                            {currentTeam.id &&
                                <div className='d-flex justify-content-between mb-2'>
                                    <MyButton onClick={() => setCurrentTeam({name: '', color: '', img: '', id: ''})}>Создать
                                        новую команду</MyButton>
                                    <MyButton onClick={() => delTeam(currentTeam.id)}>Удалить команду</MyButton>
                                </div>
                            }
                            <Form className='d-flex flex-column gap-1'>
                                <Form.Control type='input' placeholder='Название команды' value={currentTeam.name}
                                              onChange={e => setCurrentTeam({...currentTeam, name: e.target.value})}/>
                                <div className='d-flex flex-row align-items-end gap-3'>Выберите цвет:
                                    <Form.Control className='w-25' type='color' placeholder='Цвет'
                                                  value={currentTeam.color} onChange={e => setCurrentTeam({
                                        ...currentTeam,
                                        color: e.target.value
                                    })}/>
                                </div>
                                {currentTeam.img &&
                                    <div className='d-flex justify-content-center flex-column align-items-center'>
                                        <img className='change-img' alt=''
                                             src={process.env.REACT_APP_API_URL + `/images/teams/mini/${currentTeam.img}`}/>
                                        <MyButton onClick={(e) => delTeamImg(e)}>Удалить изображение</MyButton>
                                    </div>
                                }
                            </Form>
                            <AddImgModule header={currentTeam.id ? 'Изменить изображение' : null} setFile={setTeamImg}/>
                            {currentTeam.id ?
                                <MyButton onClick={() => editTeam()} classes='mt-1 w-100'>Изменить команду</MyButton> :
                                <MyButton onClick={() => addTeam()} classes='mt-1 w-100'>Добавить команду</MyButton>
                            }
                        </div>
                    }



            {(!currentContestant.id || !isTeamType) &&
            <Form>
                <Form.Switch onClick={() => setCurrentContestant({name: '', color: '', img: '', id: '' })} label='Добавить участника' checked={activeBlock.newContestant} onChange={() => setActiveBlock({...activeBlock, newTeam: false, newContestant: !activeBlock.newContestant})} />
            </Form>
            }
                </div>
            }
            {(activeBlock.newContestant || currentContestant.id || !isTeamType) &&
                <div className='add-change-contestant'>
                    {currentContestant.id ? <h3>Изменить участника</h3> : <h3>Добавить участника</h3>}
                    {currentContestant.id &&
                        <div className='d-flex justify-content-between mb-2'>
                            <MyButton onClick={() => setCurrentContestant({
                                name: '',
                                number: '',
                                teamId: '',
                                teamName: '',
                                teamOrder: '',
                                id: ''
                            })}>Добавить
                                нового участника</MyButton>
                            <MyButton onClick={() => delContestant()}>Удалить участника</MyButton>
                        </div>
                    }
                    <Form className='d-flex flex-column gap-1'>
                        <Form.Control type='input' placeholder='Фамилия, Имя участника' value={currentContestant.name} onChange={e => setCurrentContestant({...currentContestant, name: e.target.value})}/>
                        <Form.Control type='number' placeholder='Номер участника' value={currentContestant.number || ''} onChange={e => setCurrentContestant({...currentContestant, number: e.target.value})}/>
                        {isTeamType &&
                            <div>
                                <Dropdown className="d-flex w-auto p-0 justify-content-center w-100 m-2">
                                    <Dropdown.Toggle>{currentContestant.teamName ? `Команда: ${currentContestant.teamName}` : "Выберите команду"}</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {teams?.length >= 1 && teams.map(t =>
                                            <Dropdown.Item onClick={(e) => setCurrentContestant({
                                                ...currentContestant,
                                                teamId: t.id,
                                                teamName: t.name
                                            })} title={t.name} key={t.id}>{t.name} </Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>

                                </Dropdown>
                                <Form.Control type='number' placeholder='Порядковый номер в команде'
                                              value={currentContestant.teamOrder || ''} onChange={e => setCurrentContestant({
                                    ...currentContestant,
                                    teamOrder: e.target.value
                                })}/>
                            </div>
                        }
                    </Form>
                    {currentContestant.img &&
                        <div className='d-flex justify-content-center flex-column align-items-center'>
                            <img alt='' className='change-img' src={process.env.REACT_APP_API_URL+`/images/contestants/mini/${currentContestant.img}`} />
                            <MyButton onClick={(e) => delContestantImg(e)}>Удалить изображение</MyButton>
                        </div>
                    }
                        <AddImgModule setFile={setContestantImg} />
                    {currentContestant.id ?
                        <MyButton

                            onClick={() => editContestant()} classes='mt-1 w-100'>Изменить участника</MyButton> :
                        <MyButton

                            onClick={() => addContestant()} classes='mt-1 w-100'>Добавить участника</MyButton>
                    }
                </div>

            }

            {!isTeamType &&
                <div className='solo-competition-contestants-list'>
                    {contestants?.length > 0 ?
                        <h3>Список участников</h3> :
                        <h3>Участников пока нет</h3>

                    }

                    {contestants?.length > 0 &&
                        <div>
                            <div className="header">
                                <div>Имя</div>
                                <div>Номер</div>
                                <div>фото</div>
                                <div>Статус</div>
                            </div>
                            {contestants?.map(c =>
                                <div className='contestant' key={c.id}>
                                    <div><Form.Check
                                        className='d-flex gap-2 align-items-center pl-3'
                                        type='radio'
                                        value={c.id}
                                        label={c.name}
                                        onChange={(e) => {
                                            setCurrentContestant({name: c.name, teamId: c.teamId, teamOrder: c.teamOrder, number: c.number, img: c.img, id: c.id})
                                        }}
                                        checked={c.id === currentContestant.id}
                                    /></div>
                                    <div>{c.number > 0 && c.number}</div>
                                    <div>{c.img && <img alt='' onClick={() => setImgModal({show: true, img: c.img, path: '/images/contestants/'})}
                                        src={process.env.REACT_APP_API_URL + `/images/contestants/mini/${c.img}`}/>}</div>
                                    <div>{c.status}</div>
                                </div>
                            )}

                        </div>
                    }
                </div>
            }

            <FullImgModal onHide={() => setImgModal({...imgModal, show: false})} show={imgModal.show} img={imgModal.img} path={imgModal.path} />
            <Helmet>
                <title>Участники и команды | wow-contest.ru</title>
            </Helmet>
        </div>
    );
});

export default CompetitionContestantsPage;