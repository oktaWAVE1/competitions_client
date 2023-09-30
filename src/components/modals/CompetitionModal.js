import {Dropdown, Form, Modal} from "react-bootstrap";
import MyButton from "../../UI/MyButton/MyButton";
import React, {useState} from "react";
import {createCompetition} from "../../http/competitionAPI";
import AddImgModule from "../addImgModule";
import UserSearch from "../userSearch";


const CompetitionModal = ({onHide, show, competitions, sports, setRefresh, users} ) => {
    const [competition, setCompetition] = useState({name:'', description: '', adminId: '', adminName: '', teamType: false, competitionId: 0, competitionName: '', sportId: null, sportName: ''});
    const [file, setFile] = useState(null)
    const [copy, setCopy] = useState(false);

    const addCompetition = (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            for (const [key, value] of Object.entries(competition)) {
                formData.append(`${key}`, `${value}`)
            }
            if (file){
            formData.append('file', file[0])
                            }
            formData.append('copy', copy)
            createCompetition(formData).then(() => {
                setCompetition({name:'', description: '', adminId: '', adminName: '', teamType: false, competitionId: 0, competitionName: '', sportId: null, sportName: ''})
                setFile(null)
            })
            setRefresh(prev => prev +1)
            onHide()
        } catch (e) {
            alert(e.response.data.message)
        }

    }


    return (
        <Modal
            className='modal'
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h1>Создать соревнование: </h1>

                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div>
                        <div className="d-flex justify-content-between">
                        {sports?.length>0 &&
                            <Dropdown className="d-flex w-auto p-0 mt-1 compSwitch" >
                                <Dropdown.Toggle>{competition.sportName ? competition.sportName : "Выберите спорт:"}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {sports.map(s =>
                                        <Dropdown.Item onClick={(e) => setCompetition({...competition, sportId: s.id, sportName: s.name})} key={s.id}>{s.name}</Dropdown.Item>
                                    )}
                                </Dropdown.Menu>

                            </Dropdown>}
                        {competition.sportId &&
                            <Form.Switch className="d-flex align-items-center gap-3" checked={copy} onChange={() => setCopy(!copy)} label={'Копировать соревнование'} />
                        }
                        </div>
                        {copy &&
                        <Dropdown className="d-flex w-auto p-0 mt-3 compSwitch" >
                            <Dropdown.Toggle>{competition.sportName ? competition.sportName : "Выберите соревнование для копирования:"}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {sports.length>=1 && sports.map(s =>
                                    <Dropdown.Item onClick={(e) => setCompetition({...competition, sportId: s.id, sportName: s.name})} title={s.name} key={s.id}>{s.name} </Dropdown.Item>
                                )}
                            </Dropdown.Menu>

                        </Dropdown>
                        }

                    </div>

                    <Form.Control placeholder="Название" type="input" value={competition.name} onChange={e => setCompetition({...competition, name: e.target.value})} />
                    <textarea className="rounded p-2 w-100" placeholder="Описание" type="input" value={competition.description} onChange={e => setCompetition({...competition, description: e.target.value})} />
                    <div className="switch-line d-flex align-items-center justify-content-center gap-3"><span className={`${!competition.teamType ? 'active' : ''}`}>Одиночное</span>
                        <Form.Switch checked={competition.teamType} onChange={e => setCompetition({...competition, teamType: !competition.teamType})}/>
                        <span className={`${competition.teamType ? 'active' : ''}`}>Командное</span>
                    </div>
                </Form>

                <UserSearch
                    name='adminName'
                    id='adminId'
                    user={competition}
                    setUser={setCompetition}
                    users={users}
                    placeholder='Поиск администратора'
                    label='Выбрать администратора'
                    dropdownLabel = 'Выберите администратора'
                    anyrole={false}
                    alwaysOn={true}
                    roles={['ADMIN', 'MODERATOR', 'REFEREE']} />
                        <AddImgModule multiple={false} setFile={setFile} />
                    <MyButton classes="w-100" disabled={!competition.name || !competition.adminId || !competition.sportId || !competition.description || (!competition.competitionId && copy)} onClick={(e) => addCompetition(e)}>Добавить соревнование</MyButton>
            </Modal.Body>
            <Modal.Footer>
                <MyButton onClick={onHide}>Закрыть</MyButton>
            </Modal.Footer>
        </Modal>
    );
};

export default CompetitionModal;