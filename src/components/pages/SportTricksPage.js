import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {fetchCategory, fetchCurrentSport} from "../../http/sportAPI";
import {Card, Container, Form} from "react-bootstrap";
import MyButton from "../../UI/MyButton/MyButton";
import {addCategoryTrick, delCategoryTrick, modifyCategoryTrick} from "../../http/trickAPI";
import CategoryList from "../categoryList";

const SportTricksPage = () => {
    const {id} = useParams()
    const [sport, setSport] = useState({});
    const [oneMore, setOneMore] = useState(false);
    const [refresh, setRefresh] = useState(1);
    const [category, setCategory] = useState({});
    const [checked, setChecked] = useState(null);
    const [checkedTrick, setCheckedTrick] = useState(null);
    const [newTrick, setNewTrick] = useState({name:'', defaultPoints:'', defaultLevel:'', description: ''});
    const [currentTrick, setCurrentTrick] = useState({name:'', defaultPoints:'', defaultLevel:'', description: '', id: ''});
    const changeTrickSection = useRef(null)
    const navigate = useNavigate()

    const delTrick = async (e, id) => {
        e.preventDefault()
        await delCategoryTrick({id}).then(() => setRefresh(prev => prev +1)).then(() => {
            setCurrentTrick({name: '', defaultPoints: '', defaultLevel: '', description: '', id: ''})
            setCheckedTrick(null)
    })
    }
    const modifyTrick = async (e) => {
        e.preventDefault()
        await modifyCategoryTrick({
            name: currentTrick.name,
            description: currentTrick.description,
            defaultLevel: currentTrick.defaultLevel,
            defaultPoints: currentTrick.defaultPoints,
            id: currentTrick.id
        }).then(() => setRefresh(prev => prev +1)).then(() => {
            setCurrentTrick({name: '', defaultPoints: '', defaultLevel: '', description: '', id: ''})
            setCheckedTrick(null)
        })
    }

    const switchCategory = (e) => {
        setChecked(e.target.value)
        setCurrentTrick({name:'', defaultPoints:'', defaultLevel:'', description: '', id: ''})
        setCheckedTrick(null)
    }

    const addTrick = async (e) => {
        e.preventDefault()
        await addCategoryTrick({
            name: newTrick.name,
            description: newTrick.description,
            defaultLevel: newTrick.defaultLevel,
            defaultPoints: newTrick.defaultPoints,
            categoryId: checked,
            sportId: id,
        }).then(() => {
            setRefresh(prev => prev +1)
            setNewTrick({name:'', defaultPoints:'', defaultLevel:'', description: ''})
        })
    }

    useEffect(() => {
        if(checked){
            fetchCategory(checked).then((data) => setCategory(data))
        }
    }, [checked, refresh]);

    useEffect(() => {
        fetchCurrentSport(id).then(data => setSport(data))
    }, []);
    return (
        <div className='w-100'>
            <MyButton classes='back-nav-btn' onClick={() => navigate(`/admin`)}>Назад в админку</MyButton>
            <Container >
                <h1 className="text-uppercase">Набор трюков. {sport.name}</h1>
                {sport?.categories?.length > 0 &&
                    <Card className='p-3'>
                        <CategoryList header={'Категории:'} categories={sport?.categories} checked={checked} switchCategory={switchCategory} />
                    </Card>
                }


                <Form className="d-flex flex-column gap-1">
                    <Form.Switch
                        checked={oneMore}
                        onChange={() => setOneMore(prev => !prev)}
                        label='Добавить трюк в категорию'
                        className='d-flex align-items-center justify-content-center gap-3'
                        />
                    {oneMore &&
                        <div className='d-flex flex-column gap-1'>
                        <Form.Control type='input' placeholder='Название трюка' value={newTrick.name}
                                      onChange={e => setNewTrick({...newTrick, name: e.target.value})}/>
                        <Form.Control type='number' placeholder='Базовое количество баллов' value={newTrick.defaultPoints} onChange={e => setNewTrick({...newTrick, defaultPoints: e.target.value})}/>
                        <Form.Control type='number' placeholder='Базовый уровень сложности (1 - новички, 2 - любители, 3 - мастера)' value={newTrick.defaultLevel} onChange={e => setNewTrick({...newTrick, defaultLevel: e.target.value})}/>
                        <textarea type='input' placeholder='Описание трюка' value={newTrick.description} onChange={e => setNewTrick({...newTrick, description: e.target.value})}/>
                        <MyButton
                        onClick={(e) => addTrick(e)}
                        classes='w-100'
                        disabled={!checked || !newTrick.defaultLevel || !newTrick.name || !newTrick.defaultPoints || !newTrick.description}
                        >Добавить трюк в категорию</MyButton>
                        </div>
                    }
                </Form>
                {category?.tricks?.length > 0 &&

                    <div className='mt-3'>
                        <h5>Список трюков в категории:</h5>
                        <div className="sport-category-trick header">
                            <div>Название</div>
                            <div title='базовый уровень баллов за трюк'>Баллы</div>
                            <div title='базовый уровень сложности трюка'>Уровень</div>
                            <div>Описание</div>
                            <div></div>
                        </div>

                        {category.tricks.map(t =>
                            <div key={t.id} className="sport-category-trick trick">
                                <div><Form.Check
                                    className='d-flex gap-2 align-items-center pl-3'
                                    type='radio'
                                    value={t.id}
                                    label={t.name}
                                    onChange={(e) => {
                                        setCheckedTrick(e.target.value)
                                        setCurrentTrick({name: t.name, defaultPoints: t.defaultPoints, defaultLevel: t.defaultLevel, description: t.description, id: t.id})
                                        window.scrollTo({ top: changeTrickSection.current.offsetTop, behavior: 'smooth', })
                                    }}
                                    checked={t.id.toString() === checkedTrick}
                                /></div>
                                <div>{t.defaultPoints}</div>
                                <div>{t.defaultLevel}</div>
                                <div>{t.description}</div>
                                <div className='d-flex'>
                                    <span title='Удалить трюк' onClick={e => delTrick(e, t.id)}
                                          className="del-btn material-symbols-outlined">
                                                                delete_forever
                                            </span>
                                </div>


                            </div>
                        )}

                                {checkedTrick &&
                                    <div className='mt-3'>
                                <h5>Внести изменения в трюк:</h5>
                                <Form className="d-flex flex-column gap-1">
                                    <Form.Control type='input' placeholder='Название трюка' value={currentTrick.name} onChange={e => setCurrentTrick({...currentTrick, name: e.target.value})}/>
                                    <Form.Control type='number' placeholder='Базовое количество баллов' value={currentTrick.defaultPoints} onChange={e => setCurrentTrick({...currentTrick, defaultPoints: e.target.value})}/>
                                    <Form.Control type='number' placeholder='Базовый уровень сложности (1 - новички, 2 - любители, 3 - мастера)' value={currentTrick.defaultLevel} onChange={e => setCurrentTrick({...currentTrick, defaultLevel: e.target.value})}/>
                                    <textarea type='input' placeholder='Описание трюка' value={currentTrick.description} onChange={e => setCurrentTrick({...currentTrick, description: e.target.value})}/>
                                    <MyButton
                                        onClick={(e) => modifyTrick(e)}
                                        classes='w-100'
                                        disabled={!currentTrick.defaultLevel || !currentTrick.name || !currentTrick.defaultPoints || !currentTrick.description}
                                    >Внести изменения</MyButton>
                                </Form>

                            </div>
                        }<div ref={changeTrickSection} >
                        </div>
                    </div>
                }

            </Container>
        </div>
    );
};

export default SportTricksPage;