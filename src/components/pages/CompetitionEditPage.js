import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {useNavigate, useParams} from "react-router-dom";
import {Context} from "../../index";
import {
    addCompetitionImg, addCompetitionReferee, delCompetition,
    delCompetitionImg, delCompetitionReferee, editCompetition,
    fetchCurrentCompetition
} from "../../http/competitionAPI";
import {Card, Container, Dropdown, Form, Row} from "react-bootstrap";
import MyButton from "../../UI/MyButton/MyButton";
import AddImgModule from "../addImgModule";
import useDebounce from "../../hooks/useDebounce";
import Loader from "../../UI/Loader/Loader";
import {fetchUsers} from "../../http/userAPI";
import UserSearch from "../userSearch";

const CompetitionEditPage = observer(() => {
    const {competitionId} = useParams()
    const {competition, loading} = useContext(Context)
    const [delConfirm, setDelConfirm] = useState(false);
    const [file, setFile] = useState(null);
    const [current, setCurrent] = useState({name: '', description: '', admin: '', adminId: '', competition_images: [], teamType: false, sport: {name: ''}, referees: []});
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [newReferee, setNewReferee] = useState({id: '', name: ''});
    useEffect(() => {
        loading.setLoading(true)
        fetchCurrentCompetition(competitionId).then((data) => {
            setCurrent(data)
            competition.setCurrentCompetition(data)
            fetchUsers().then(data => setUsers(data.sort((a, b) => a.name - b.name)))

        }).finally(() => loading.setLoading(false))
    }, [competitionId]);

    useDebounce(() => {
        loading.setLoading(true)
        fetchCurrentCompetition(competitionId).then((data) => {
        setCurrent(data)
        competition.setCurrentCompetition(data)
        loading.setLoading(false)
    })}, 1000, [loading.refresh])


    const addReferee = async (e) => {
        e.preventDefault()
        await addCompetitionReferee({userId: newReferee.id, competitionId}).then(() => loading.setRefresh(prev => prev+1))
    }

    const delReferee = async (e, id) => {
        await delCompetitionReferee({id}).then(() => loading.setRefresh(prev => prev+1))
    }

    const addImg = async (e) => {
        e.preventDefault()
        try {
            for (let i =0; i<= file.length; i++){
                let formData = new FormData()
                formData.append('competitionId', competitionId)
                formData.append('file', file[i])
                await addCompetitionImg(formData)
            }
                setFile(null)
            loading.setRefresh(prev => prev + 1)

        } catch (e) {
            alert(e.response.data.message)
        }

    }

    const editContest = async (e) => {
        e.preventDefault()
        try {
            await editCompetition({
                name: current.name,
                description: current.description,
                teamType: current.teamType,
                adminId: current.adminId,
                id: competitionId
            }).then(() => {
                loading.setRefresh(prev => prev + 1)
                }
            )

        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const delContest = async (e) => {
        e.preventDefault()
        await delCompetition(competitionId).then(() => navigate('/admin'))
    }

    const delImg = async (e, id) => {
        e.preventDefault()
        await delCompetitionImg(id).then(() => loading.setRefresh(prev => prev + 1))
    }

    if (loading.loading){
        return <Loader/>
    }
    return (
            <Container className="w-100 edit-competition">
                <MyButton classes='back-nav-btn' onClick={() => navigate(`/admin`)}>Назад в админку</MyButton>
                <h1>Внести изменения в соревнование:</h1>
                <div className="w-100">
                <Row >
                    <Card className="p-3 mb-3 gap-2 d-flex">
                        <div className="d-flex justify-content-between">
                            <div>Спорт: {current?.sport?.name}</div>
                            <div>
                                <Form>
                                    <Form.Switch checked={delConfirm} onChange={() => setDelConfirm(prev => !prev)} label='Удалить соревнование'/>
                                    {delConfirm &&
                                        <MyButton  onClick={e => delContest(e)}>Удалить соревнование</MyButton>
                                    }
                                </Form>

                            </div>
                        </div>
                        <Form className="d-flex flex-column gap-2">
                        <MyButton classes="w-100" onClick={(e) => editContest(e)}>Сохранить изменения</MyButton>
                        <Form.Control value={current.name} onChange={event => setCurrent({...current, name: event.target.value})} placeholder='Название' title='Название' />
                        <textarea className="rounded p-2 w-100" type='text' value={current.description} onChange={event => setCurrent({...current, description: event.target.value})} title='Описание' placeholder='Описание' />
                            <div className="switch-line d-flex align-items-center justify-content-center gap-3"><span className={`${!current.teamType ? 'active' : ''}`}>Одиночное</span>
                                <Form.Switch checked={current.teamType} onChange={e => setCurrent({...current, teamType: !current.teamType})}/>
                                <span className={`${current.teamType ? 'active' : ''}`}>Командное</span>
                            </div>
                        </Form>
                        <h5>Администратор:</h5>
                        {users.filter(u => u.id===current.adminId)?.[0]?.['name']}
                        <UserSearch
                            name='adminName'
                            id='adminId'
                            user={current}
                            setUser={setCurrent}
                            users={users}
                            placeholder='Поиск администратора'
                            label='Сменить администратора'
                            dropdownLabel = 'Выберите администратора'
                            anyrole={false}
                            roles={['ADMIN', 'MODERATOR', 'REFEREE']} />

                            <h5>Список судей:</h5>
                        <UserSearch
                            name='name'
                            id='id'
                            label={'Добавить судью'}
                            anyrole={true}
                            roles={[]}
                            placeholder={'Найти судью'}
                            dropdownLabel = 'Выберите судью'
                            users={users}
                            setUser={setNewReferee}
                            button={true}
                            buttonLabel='Добавить судью'
                            callback={addReferee}
                            user={newReferee} />

                            {current?.referees?.length===0 ?
                            <div>Судьи пока не назначены</div> :
                            <div>
                                {current?.referees.map(r =>
                                    <div key={r.id}>
                                        <div><span>{r.user.name}</span>
                                            <span title='Удалить категорию' onClick={e => delReferee(e, r.id)}
                                                  className="del-mini-btn material-symbols-outlined">
                                                                                            close
                                            </span>
                                        </div>
                                    </div>
                                    )}
                            </div>
                            }
                            <MyButton onClick={() => navigate(`/competition_tricks/${competitionId}`)}>Перейти к списку трюков</MyButton>
                            <MyButton onClick={() => navigate(`/competition_criteria/${competitionId}`)}>Перейти к списку дополнительных критериев оценки</MyButton>
                        {competition?.currentCompetition.teamType ?
                            <MyButton onClick={() => navigate(`/competition_teams/${competitionId}`)}>Перейти к списку команд и участников</MyButton> :
                            <MyButton onClick={() => navigate(`/competition_contestants/${competitionId}`)}>Перейти к списку участников</MyButton>
                        }
                        <MyButton onClick={() => navigate(`/competition_groups/${competitionId}`)}>Группы и участники групп</MyButton>
                        <MyButton onClick={() => navigate(`/competition_control/${competitionId}`)}>Перейти к управлению соревнованием</MyButton>
                                <AddImgModule multiple={true} setFile={setFile} />
                                <MyButton disabled={!file} classes="w-100 mt-2" onClick={(e) => addImg(e)}>ДОБАВИТЬ</MyButton>
                            {current?.competition_images.length>0 &&
                            <div>
                                <h3 className='mt-3'>Изображения:</h3>
                                <div className="gallery">
                                    {current.competition_images.map(i =>
                                        <div className="gallery-item" key={i.id}>
                                            <img loading="lazy" src={process.env.REACT_APP_API_URL+`/images/competitions/mini/${i.img}`} />
                                            <span title='Удалить изображение' className='del-btn' onClick={(e) => delImg(e, i.id)}><span
                                                className="material-symbols-outlined">
                                                delete_forever
                                                </span></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                    </Card>
                </Row>
                </div>

            </Container>


    );
});

export default CompetitionEditPage;