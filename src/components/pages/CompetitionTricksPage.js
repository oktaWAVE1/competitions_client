import React, {useContext, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {
    addAllCompetitionTricks,
    addCompetitionTrick,
    delAllCompetitionTricks,
    delCompetitionTrick,
    fetchCurrentCompetition, modifyCompetitionTrick
} from "../../http/competitionAPI";
import Loader from "../../UI/Loader/Loader";
import MyButton from "../../UI/MyButton/MyButton";
import {fetchAllTricks} from "../../http/trickAPI";
import {Form} from "react-bootstrap";

const CompetitionTricksPage = observer(() => {
    const {competitionId} = useParams()
    const {competition} = useContext(Context)
    const navigate = useNavigate()
    const [addTricks, setAddTricks] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(1);
    const [tricks, setTricks] = useState([]);
    const [currentTricks, setCurrentTricks] = useState([]);
    const [currentCompetitionTricks, setCurrentCompetitionTricks] = useState();
    const [checked, setChecked] = useState(null);
    const [currentTrick, setCurrentTrick] = useState({points:'', level:'', id: '', name: ''});
    const changeTrickSection = useRef(null)
    useEffect(() => {
        fetchCurrentCompetition(competitionId).then(async (data) => {
            competition.setCurrentCompetition(data)
        }).then(async () => {

            await fetchAllTricks({sportId: competition.currentCompetition.sportId})
                .then(data => setTricks(data)).then(() => {
                    let array = []
                    competition.currentCompetition.competition_tricks.forEach(t => array.push(t.trickId))
                    setCurrentTricks(array)
                })
        }).then(() =>
        setCurrentCompetitionTricks([...competition.currentCompetition?.competition_tricks]
            .sort((a, b) => a.points - b.points)
            .sort((a, b) => a.trick.categoryId - b.trick.categoryId))
        ).finally(() => setLoading(false))
    }, [competitionId, refresh]);


    const modifyTrick = async (e) => {
        e.preventDefault()
        await modifyCompetitionTrick({id: currentTrick.id, level: currentTrick.level, points: currentTrick.points}).then(() => {
            setChecked(null)
            setCurrentTrick({points:'', level:'', id: '', name: ''})
            setRefresh(prev => prev+1)
        })

    }

    const addTrick = async (trickId) => {
        setLoading(true)
        await addCompetitionTrick({competitionId, trickId}).then(() => setRefresh(prev => prev + 1))
    }

    const addAllTricks = async() => {
        setLoading(true)
        await addAllCompetitionTricks({competitionId, sportId: competition.currentCompetition.sportId}).then(() => setRefresh(prev => prev + 1))

    }

    const delTrick = async (e, id) => {
        e.preventDefault()
        setLoading(true)
        await delCompetitionTrick({id}).then(() => setRefresh(prev => prev + 1))
    }

    const delAll = async () => {
        setLoading(true)
        await delAllCompetitionTricks({competitionId}).then(() => setRefresh(prev => prev + 1)).then(() => setRefresh(prev => prev + 1))
    }

    if(loading){
        return <Loader />
    }
    return (
        <div className='w-100'>
            <MyButton classes='back-nav-btn' onClick={() => navigate(`/edit_competition/${competitionId}`)}>Назад к сореванованию</MyButton>
            <h1>Список трюков</h1>
            <h3>{competition?.currentCompetition?.name}</h3>
            <div>
                <Form className='d-flex justify-content-between align-items-center'>
                    <Form.Switch checked={addTricks} onChange={() => setAddTricks(prev => !prev)} label='Добавить трюки'/>
                    <MyButton onClick={() => addAllTricks()} disabled={currentTricks.length===tricks.length}>Добавить все трюки</MyButton>
                </Form>
                {addTricks &&
                    <div>
                    {(currentTricks.length===tricks.length) ?
                        <h3>Все трюки добавлены</h3> :
                        <div>

                            <h5 className='mt-2'>Список недобавленных трюков: </h5>
                            {tricks?.length>0 &&
                                <div className='add-competition-tricks'>
                                    <div className='header'>
                                        <div>Категория</div>
                                        <div>Название</div>
                                        <div>Описание</div>
                                    </div>
                                    {tricks.filter(t => !currentTricks.includes(t.id)).map(t =>
                                    <div key={t.id} className='trick'>
                                        <div>{t?.category?.parent?.id ? `${t.category.parent.name} > ${t.category.name}` : t.category.name}</div>
                                        <div>{t.name}</div>
                                        <div>{t.description}</div>
                                        <div><span onClick={() => addTrick(t.id)} className="add-mini-btn material-symbols-outlined">
                                                add
                                            </span></div>
                                    </div>
                                     )}
                                </div>
                             }
                    </div>
                    }
                    </div>
                }
            </div>
            <div className="mt-3">
                {currentCompetitionTricks?.length<1 ?
                    <h3>Трюки пока не добавлены</h3> :
                <div>

                    <h5>Список добавленных трюков</h5>
                    <div className='current-competition-tricks'>
                        <div className='header'>
                            <div>Категория</div>
                            <div>Название</div>
                            <div>Описание</div>
                            <div className='text-center'>Баллы</div>
                            <div className='text-center'>Сложность</div>
                        </div>
                        {currentCompetitionTricks.map(t =>
                            <Form className='trick' key={t.id}>
                                <div>{t?.trick?.category?.parent?.id ? `${t?.trick?.category?.parent?.name} > ${t?.trick?.category?.name}` : t?.trick?.category?.name}</div>
                                <div>
                                    <Form.Check
                                        className='d-flex gap-2 align-items-center pl-3'
                                        type='radio'
                                        value={t.id}
                                        label={t?.trick?.name}
                                        onChange={(e) => {
                                            setChecked(e.target.value)
                                            setCurrentTrick({points: t.points, level: t.level, id: t.id, name: t.trick.name})
                                            window.scrollTo({ top: changeTrickSection.current.offsetTop, behavior: 'smooth'})
                                        }}
                                        checked={t.id.toString() === checked}
                                    /></div>
                                <div>{t?.trick?.description}</div>
                                <div className='text-center'>{t.points}</div>
                                <div className='text-center'>{t.level}</div>
                                <div><span title='Удалить трюк из соревнования' onClick={(e) => delTrick(e, t.id)} className="del-mini-btn material-symbols-outlined">
                                        close
                                    </span></div>
                            </Form>
                            )}
                    </div>
                    <div className='d-flex justify-content-end'>
                        <MyButton onClick={() => delAll()}>Удалить все трюки</MyButton>
                    </div>
                    {checked &&
                        <div className='mt-3'>
                            <h5>Внести изменения в трюк:</h5>
                            <Form className="d-flex flex-column gap-1">
                                <div>Название</div><Form.Control type='input' placeholder='Название трюка' disabled={true} value={currentTrick.name} onChange={e => setCurrentTrick({...currentTrick, name: e.target.value})}/>
                                <div>Баллы за трюк</div><Form.Control type='number' placeholder='Базовое количество баллов' value={currentTrick.points} onChange={e => setCurrentTrick({...currentTrick, points: e.target.value})}/>
                                <div>Уровень сложности</div><Form.Control type='number' placeholder='Базовый уровень сложности (1 - новички, 2 - любители, 3 - мастера)' value={currentTrick.level} onChange={e => setCurrentTrick({...currentTrick, level: e.target.value})}/>
                                <MyButton
                                    onClick={(e) => modifyTrick(e)}
                                    classes='w-100'
                                    disabled={!currentTrick.level || !currentTrick.points || !checked}
                                >Внести изменения</MyButton>
                            </Form>

                        </div>
                    }<div ref={changeTrickSection} >
                </div>

                </div>
                }
            </div>

        </div>
    );
});

export default CompetitionTricksPage;