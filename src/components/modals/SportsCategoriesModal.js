import React, {useState} from 'react';
import {Accordion, Card, Form, Modal} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import MyButton from "../../UI/MyButton/MyButton";
import {useSearch} from "../../hooks/useSearch";
import {addCategory, addSport, deleteCategory, deleteSport, modifySport} from "../../http/sportAPI";

const SportsCategoriesModal = ({onHide, show, sports, setRefresh} ) => {
    const [query, setQuery] = useState('');
    const [current, setCurrent] = useState('');
    const [addNew, setAddNew] = useState(false);
    const [newSport, setNewSport] = useState('');
    const [basicCategory, setBasicCategory] = useState(false);
    const [newSubCategory, setNewSubCategory] = useState(null);
    const searchedSports = useSearch(sports, query)
    const navigate = useNavigate()
    const createSport = async (e) => {
        e.preventDefault()
        await addSport(newSport).then(() => {
            setRefresh(prev => prev + 1)
            setAddNew(false)
            onHide()
        })
    }


    const basicSubSwitch = (e) => {
        setNewSubCategory(null)
        setBasicCategory(prev => !prev)
    }

    const editSport = async (e, id) => {
        e.preventDefault()
        await modifySport(current, id).then(() => setRefresh(prev => prev + 1))
    }
    const delSport = async (e, id) => {
        e.preventDefault()
        await deleteSport(id).then(() => setRefresh(prev => prev+1))
    }

    const delCategory = async (e, id) => {
        e.preventDefault()
        await deleteCategory(id).then(() => setRefresh(prev => prev+1))
    }

    const createCategory = async (e, sportId) => {
        e.preventDefault()
            if(newSubCategory) {
                await addCategory(current, newSubCategory).then(() => setRefresh(prev => prev+1))
            } else {
                await addCategory(current, null, sportId).then(() => setRefresh(prev => prev+1))
            }
            setCurrent('')
    }

    return (
        <Modal
            className='modal sports-categories-modal'
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h1>Виды спорта и категории трюков: </h1>

                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Switch className="d-flex align-items-center gap-2 " checked={addNew} onChange={() => setAddNew(prev => !prev)} label="Добавить новый вид спорта"/>
                    {addNew &&
                    <div>
                        <Form.Control type='input' placeholder='Название...' value={newSport} onChange={e => setNewSport(e.target.value)} />
                        <MyButton classes='w-100' disabled={(newSport.length===0)} onClick={e => createSport(e)}>Добавить</MyButton>

                    </div>

                    }
                </Form>
                {!addNew &&
                    <div>
                        <Form>
                            <Form.Control type="input" value={query} onChange={e => setQuery(e.target.value)} placeholder='Найти вид спорта...' />
                        </Form>
                        {searchedSports?.length>0 &&
                        <div>
                            {searchedSports.map(s =>
                                <Card key={s.id} >
                                    <div className='sport-edit-row p-3'>
                                        <Link to={`/sport_tricks/${s.id}`} title='Перейти к редактированию трюков'><div>{s.name}</div></Link>
                                        <MyButton classes="pt-0 pb-0" onClick={() => navigate(`/sport_tricks/${s.id}`)}>Редактировать трюки</MyButton>

                                        <div>
                                            <span onClick={e => delSport(e, s.id)}
                                                className="del-btn material-symbols-outlined">
                                                                delete_forever
                                            </span>
                                        </div>
                                    </div>
                                    <Accordion className='mt-0'>
                                        <Accordion.Item eventKey='0'>
                                            <Accordion.Header className='classic_btn' onClick={() => setCurrent('')}>Редактировать</Accordion.Header>
                                            <Accordion.Body>
                                                <div>
                                                    <label className="p-1" >Изменить название:</label>
                                                    <Form.Control
                                                        type='input'
                                                        value={current}
                                                        onChange={(e) => setCurrent(e.target.value)}
                                                    />
                                                    <MyButton disabled={current.length===0} onClick={e => editSport(e, s.id)}>Изменить название</MyButton>

                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                    <Accordion className='mt-0'>
                                        <Accordion.Item eventKey='0'>
                                            <Accordion.Header className='classic_btn' onClick={() => setCurrent('')}>Категории трюков</Accordion.Header>
                                            <Accordion.Body>
                                                <div>
                                                    {s?.categories?.length > 0 &&
                                                        <Form>
                                                            <Form.Group>


                                                            {s.categories.map(cat =>
                                                            <div key={cat.id}>
                                                                <div className='d-flex align-items-center'>
                                                                    <Form.Check
                                                                        className='d-flex gap-2 align-items-center'
                                                                        disabled={basicCategory}
                                                                        type='radio'
                                                                        value={cat.id}
                                                                        label={cat.name}
                                                                        onChange={e => setNewSubCategory(e.target.value)}
                                                                        checked={cat.id.toString() === newSubCategory}
                                                                    /><span title='Удалить категорию' onClick={e => delCategory(e, cat.id)}
                                                                            className="del-mini-btn material-symbols-outlined">
                                                                                            close
                                                                                        </span>
                                                                </div>

                                                                {cat?.children?.length>0 &&
                                                                <ul>
                                                                    {cat.children.map(subCat =>
                                                                        <li key={subCat.id}>
                                                                            <span className='mr-2'>
                                                                                {subCat.name}
                                                                            </span>
                                                                            <span title='Удалить категорию' onClick={e => delCategory(e, subCat.id)}
                                                                                           className=" del-mini-btn material-symbols-outlined">
                                                                                        close
                                                                                    </span>
                                                                        </li>
                                                                        )}
                                                                </ul>
                                                                }
                                                            </div>
                                                        )}
                                                            </Form.Group>
                                                        </Form>
                                                    }
                                                    <h4 className="p-1" >Добавить категорию:</h4>
                                                    <div className='d-flex flex-row gap-3 justify-content-center align-items-center'>
                                                        <span className={!basicCategory ? "active" : ''}>Подкатегория</span>
                                                    <Form.Switch checked={basicCategory} onChange={e => basicSubSwitch(e)} />
                                                        <span className={basicCategory ? "active" : ''}>Основная категория</span>
                                                    </div>
                                                    <Form.Control
                                                        type='input'
                                                        disabled={!newSubCategory && !basicCategory}
                                                        value={current}
                                                        onChange={(e) => setCurrent(e.target.value)}
                                                        placeholder={basicCategory ? "Введите название базовой категории" : "Выберите категорию и введите название подкатегории"}
                                                    />
                                                    <MyButton
                                                        disabled={!newSubCategory && !basicCategory || current.length===0}
                                                        onClick={e => createCategory(e, s.id)}
                                                        classes='w-100'
                                                    >Добавить</MyButton>

                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </Card>
                        )}
                        </div>

                }
                    </div>
                }
            </Modal.Body>
            <Modal.Footer>
                <MyButton onClick={onHide}>Закрыть</MyButton>
            </Modal.Footer>
        </Modal>
    );
};

export default SportsCategoriesModal;