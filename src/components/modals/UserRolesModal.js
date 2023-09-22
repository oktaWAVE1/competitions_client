import React, {useState} from 'react';
import {Card, Dropdown, Form, Modal} from "react-bootstrap";
import {Link} from "react-router-dom";
import MyButton from "../../UI/MyButton/MyButton";
import {useUserSearch} from "../../hooks/useUserSearch";
import {modifyUserRole} from "../../http/userAPI";

const UserRolesModal = ({onHide, show, users, setRefresh}) => {
    const [query, setQuery] = useState('');
    const [role, setRole] = useState('');
    const [checkedUser, setCheckedUser] = useState(null);
    const roles = ['USER', 'REFEREE', 'MODERATOR', 'ADMIN']
    const searchedUsers = useUserSearch(users, query)
    const changeQuery = (e) => {
        setCheckedUser(null)
        setQuery(e.target.value)
    }

    const applyRole = async (e) => {
        e.preventDefault()
        await modifyUserRole(checkedUser, role).then(() => setRefresh(prev => prev+1))
    }

    return (
        <Modal
            className='modal user-list-modal'
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h1>Список пользователей: </h1>

                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control type='input' value={query} placeholder='Найти пользователя...' onChange={e => changeQuery(e)} />
                    <Form.Group>

                    {searchedUsers?.length>0 &&
                        <div>
                            <hr/>
                            {searchedUsers.filter(u=> u.id!==1).map(u =>
                                <div key={u.id}>
                                <div className='user-list m-2 w-100'>
                                    <Form.Check type='radio' className='d-flex align-items-center gap-2' checked={u.id===checkedUser} value={`id: ${u.id}. ${u.name}`} label={u.name} onChange={() => setCheckedUser(u.id)} />
                                    <div><p className='d-flex align-items-center gap-2'><span className="material-symbols-outlined">
                                            call
                                    </span> {u.telephone}</p>
                                        <p className='d-flex align-items-center gap-2'>
                                        <span className="material-symbols-outlined">
                                            mail
                                        </span> email: {u.email}</p></div>
                                    <div>роль: {u.role}</div>
                                    </div>
                                    <hr/>
                                </div>

                            )}

                        </div>
                    }
                    <div className='d-flex justify-content-between'>
                        <Dropdown className="d-flex w-auto p-0 mt-1 compSwitch" >
                            <Dropdown.Toggle disabled={!checkedUser}>{role ? role : "Выберите роль:"}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {roles.map(r =>
                                    <Dropdown.Item onClick={(e) => setRole(r)} title={r} key={r}>{r} </Dropdown.Item>
                                )}

                            </Dropdown.Menu>

                        </Dropdown>
                        <MyButton disabled={!role || !checkedUser} onClick={(e) => applyRole(e)}>Назначить роль</MyButton>
                    </div>

                    </Form.Group>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <MyButton onClick={onHide}>Закрыть</MyButton>
            </Modal.Footer>
        </Modal>
    );
};



export default UserRolesModal;