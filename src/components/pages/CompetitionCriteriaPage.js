import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {useNavigate, useParams} from "react-router-dom";
import {
    addCompetitionModifier,
    delCompetitionModifier,
    fetchCompetitionModifiers,
    modifyCompetitionModifier
} from "../../http/competitionAPI";
import Loader from "../../UI/Loader/Loader";
import MyButton from "../../UI/MyButton/MyButton";
import {Form} from "react-bootstrap";
import {Context} from "../../index";
import {Helmet} from "react-helmet";

const CompetitionCriteriaPage = observer(() => {

    const {competitionId} = useParams()
    const {loading} = useContext(Context)
    const [oneMoreModifier, setOneMoreModifier] = useState(false);
    const [checked, setChecked] = useState();
    const [newModifier, setNewModifier] = useState({name: '', description: '', multiplier: false, min:'', max:'', defaultValue: '', order: ''});
    const [currentModifier, setCurrentModifier] = useState({name: '', description: '', multiplier: false, min:'', max:'', defaultValue: '', order: ''});
    const [modifiers, setModifiers] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        loading.setLoading(true)
        fetchCompetitionModifiers({competitionId}).then(async(data) => {
            setModifiers(data.sort((a,b) => a.order-b.order))
        })
        .finally(() => loading.setLoading(false))
    }, [competitionId, loading.refresh]);


    const hideEditBlock = () => {
        setCurrentModifier({name: '', description: '', multiplier: false, min:'', max:'', defaultValue: '', order: ''})
        setChecked(null)
    }

    const delModifier = async (e, id) => {
        e.preventDefault()
        await delCompetitionModifier({id}).then(() => loading.setRefresh(prev => prev +1))
    }

    const editModifier = async (e) => {
        e.preventDefault()
        await modifyCompetitionModifier({
            id: checked,
            name: currentModifier.name,
            description: currentModifier.description,
            multiplier: currentModifier.multiplier,
            min: currentModifier.min,
            max: currentModifier.max,
            order: currentModifier.order,
            defaultValue: currentModifier.defaultValue
        }).then(() => loading.setRefresh(prev => prev +1)).then(() => setChecked(null))
    }

    const addModifier = async () => {
        await addCompetitionModifier({
            name: newModifier.name,
            description: newModifier.description,
            multiplier: newModifier.multiplier,
            min: newModifier.min,
            max: newModifier.max,
            defaultValue: newModifier.defaultValue,
            order: newModifier.order,
            competitionId
        }).then(() => loading.setRefresh(prev => prev +1))
            .then(() => setNewModifier({name: '', description: '', multiplier: false, min:'', max:'', defaultValue: '', order: ''}))
    }

    if (loading.loading) {
        return <Loader />
    }
    return (

        <div className='w-100 p-2'>
            <MyButton classes='back-nav-btn' onClick={() => navigate(`/edit_competition/${competitionId}`)}>Назад к сореванованию</MyButton>
            <h1>Критерии оценки соревнования.</h1>
            <div>
                <h5>Список критериев оценки:</h5>
                {!modifiers?.length>0 ?
                    <h3>Критерии пока не добавлены:</h3> :
                    <div className='competition-criteria-list'>
                        <div className='header'>
                            <div title="Порядок">#</div>
                            <div>Название</div>
                            <div>Описание</div>
                            <div className='text-center'>Тип</div>
                            <div className='text-center' titile='Минимальное значение'>Min</div>
                            <div className='text-center' titile='Максимальное значение'>Max</div>
                            <div className='text-center' titile='Стандартное значение'>Ст. значение</div>
                            <div></div>

                        </div>
                        {modifiers.map(m =>
                            <div key={m.id} className='modifier'>
                                <div title="Порядок">{m.order}</div>
                                <div><Form.Check
                                    className='d-flex gap-2 align-items-center pl-3'
                                    type='radio'
                                    value={m.id}
                                    label={m.name}
                                    onChange={(e) => {
                                        setChecked(e.target.value)
                                        setCurrentModifier({
                                            name: m.name,
                                            description: m.description,
                                            multiplier: m.multiplier,
                                            min: m.min,
                                            max: m.max,
                                            defaultValue: m.defaultValue,
                                            order: m.order
                                        })
                                        setOneMoreModifier(false)
                                    }}
                                    checked={m.id.toString() === checked}
                                /></div>
                                <div>{m.description}</div>
                                <div className='text-center'>{m.multiplier ? 'Коэффициент' : 'Доп. баллы'}</div>
                                <div className='text-center' titile='Минимальное значение'>{m.min}</div>
                                <div className='text-center' titile='Максимальное значение'>{m.max}</div>
                                <div className='text-center'>{m.defaultValue}</div>
                                <div><span title='Удалить трюк из соревнования' onClick={(e) => delModifier(e, m.id)} className="del-mini-btn material-symbols-outlined">
                                        close
                                    </span></div>
                            </div>
                        )}
                    </div>
                }
            </div>
            {checked &&
                <div className='mt-3'>
                    <h5>Внести изменения в критерий:</h5>
                    <div>
                        <span className='hide-edit-block' onClick={() => hideEditBlock()}>скрыть</span>
                    </div>
                    <Form className="d-flex flex-column gap-1">
                        <div>Название</div><Form.Control type='input' placeholder='Название трюка' value={currentModifier.name} onChange={e => setCurrentModifier({...currentModifier, name: e.target.value})}/>
                        <div>Описание</div><Form.Control type='text' placeholder='Описание' value={currentModifier.description} onChange={e => setCurrentModifier({...currentModifier, description: e.target.value})}/>
                        <div title='Дополнительные баллы или коэффициент' className='d-flex justify-content-center align-items-center flex-row gap-2'>
                            <div className={!currentModifier.multiplier ? 'm-2 active' : 'm-2'}>Баллы</div>
                            <Form.Switch checked={currentModifier.multiplier} onChange={() => setCurrentModifier({...currentModifier, multiplier: !currentModifier.multiplier})} />
                            <div className={currentModifier.multiplier ? 'active' : ''}>Коэффициент</div>
                        </div>
                        <div>Минимальное значение</div><Form.Control type='number' placeholder='Базовое количество баллов' value={currentModifier.min} onChange={e => setCurrentModifier({...currentModifier, min: e.target.value})}/>
                        <div>Максимальное значение</div><Form.Control type='number' placeholder='Базовое количество баллов' value={currentModifier.max} onChange={e => setCurrentModifier({...currentModifier, max: e.target.value})}/>
                        <div>Стандартное значение</div><Form.Control type='number' placeholder='Базовое количество баллов' value={currentModifier.defaultValue} onChange={e => setCurrentModifier({...currentModifier, defaultValue: e.target.value})}/>
                        <div>Порядок</div><Form.Control type='number' placeholder='Порядок' value={currentModifier.order} onChange={e => setCurrentModifier({...currentModifier, order: e.target.value})}/>
                        <MyButton
                            onClick={(e) => editModifier(e)}
                            classes='w-100'
                            disabled={!currentModifier.name || !currentModifier.min.length<1 || !currentModifier.max.length<1 || !currentModifier.defaultValue.length<1 || !currentModifier.order || !checked}
                        >Внести изменения</MyButton>
                    </Form>

                </div>
            }
            <Form className='mt-3 p-2'>
                 <Form.Switch checked={oneMoreModifier} onChange={() => {
                     setOneMoreModifier(prev => !prev)
                     hideEditBlock()
                 }} label='Добавить новый критерий' />
            </Form>
            {(oneMoreModifier || !modifiers?.length>0) &&
            <div>
                <h5>Добавить новый критерий оценки:</h5>
                <Form className='d-flex flex-column gap-1'>
                    <Form.Control type='input' placeholder='Название' value={newModifier.name} onChange={e => setNewModifier({...newModifier, name: e.target.value})}/>
                    <Form.Control type='input' placeholder='Описание' value={newModifier.description} onChange={e => setNewModifier({...newModifier, description: e.target.value})}/>
                    <div title='Дополнительные баллы или коэффициент' className='d-flex justify-content-center align-items-center flex-row gap-2'>
                        <div className={!newModifier.multiplier ? 'm-2 active' : 'm-2'}>Баллы</div>
                        <Form.Switch checked={newModifier.multiplier} onChange={() => setNewModifier({...newModifier, multiplier: !newModifier.multiplier})} />
                        <div className={newModifier.multiplier ? 'active' : ''}>Коэффициент</div>
                    </div>
                    <Form.Control type='number' placeholder='Минимальное значение' value={newModifier.min} onChange={e => setNewModifier({...newModifier, min: e.target.value})}/>
                    <Form.Control type='number' placeholder='Максимальное значение' value={newModifier.max} onChange={e => setNewModifier({...newModifier, max: e.target.value})}/>
                    <Form.Control type='number' placeholder='Стандартное значение' value={newModifier.defaultValue} onChange={e => setNewModifier({...newModifier, defaultValue: e.target.value})}/>
                    <Form.Control type='number' placeholder='Порядок (влияет на итоговый подсчет баллов)' value={newModifier.order} onChange={e => setNewModifier({...newModifier, order: e.target.value})}/>
                </Form>
                <MyButton onClick={() => addModifier()} classes='mt-3 w-100' disabled={!newModifier.name || !newModifier.max || !newModifier.min || !newModifier.order || !newModifier.defaultValue}>Добавить критерий</MyButton>

            </div>
            }
            <Helmet>
                <title>Редактирование критериев оценки | wow-contest.ru</title>
            </Helmet>
        </div>
    );
});

export default CompetitionCriteriaPage;