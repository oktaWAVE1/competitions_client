import React, {useContext, useEffect, useState} from 'react';
import {Accordion, Alert, Container, Form} from "react-bootstrap";
import {Context} from "../../index";
import {getUser, modifyUser} from "../../http/userAPI";
import MyButton from "../../UI/MyButton/MyButton";
import {passwordValidator} from "../../utils/passwordValidator";

const UserPage = () => {
    const {user} = useContext(Context)
    const [currentUser, setCurrentUser] = useState({name: '', email: '', telephone: '', address: ''})
    const [pass, setPass] = useState({password: '', newPassword: '', confirmNewPassword: ''})
    const [alertMessage, setAlertMessage] = useState({title: '', message: '', show: false, variant: 'danger'})
    const updateUser = async (event) => {
        event.preventDefault()
        try {
            if (passwordValidator(pass.newPassword)===true || (pass.newPassword==='' && pass.confirmNewPassword==='')){
                await modifyUser(
                    currentUser.email,
                    pass.password,
                    currentUser.name,
                    currentUser.telephone,
                    currentUser.address,
                    currentUser.id,
                    pass.newPassword
                ).then(res => setAlertMessage({message: 'Изменения успешно сохранены!', show: true, variant: 'success'})).finally(setPass({
                    password: '',
                    newPassword: '',
                    confirmNewPassword: ''
                }))
            }
            else {
                setAlertMessage({message: passwordValidator(pass.newPassword), show: true, variant: 'danger'})
            }

        } catch (e) {
            setAlertMessage({message: e.response.data.message, show: true, variant: 'danger'})
        }
        }
    useEffect(() => {
        getUser(user.user.id).then(data => setCurrentUser(data))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user.isAuth])
    return (
        <div className='userPage'>
            <Container className='mt-3 mb-5'>
                <h1>Изменить данные профиля:</h1>

                <Form>
                    <label className="p-1">Имя</label>
                    <Form.Control
                        value={currentUser.name}
                        onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                    />
                    <label className="p-1">Email</label>
                    <Form.Control
                        value={currentUser.email}
                        onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                    />
                    <label className="p-1">Телефон</label>
                    <Form.Control
                        value={currentUser.telephone}
                        onChange={(e) => setCurrentUser({...currentUser, telephone: e.target.value})}
                    />
                    <label className="p-1">Адрес</label>
                    <Accordion className='mt-2'>
                            <Accordion.Item eventKey='0'>
                                <Accordion.Header className='classic_btn'>Сменить пароль</Accordion.Header>
                                <Accordion.Body>
                                    <div>
                                        <label className="p-1" >Новый пароль:</label>
                                        <Form.Control
                                            type='password'
                                            value={pass.newPassword}
                                            onChange={(e) => setPass({...pass, newPassword: e.target.value})}
                                        />
                                        <label className="p-1" >Подтверждение нового пароля:</label>
                                        <Form.Control
                                            type='password'
                                            value={pass.confirmNewPassword}
                                            onChange={(e) => setPass({...pass, confirmNewPassword: e.target.value})}
                                        />
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                    </Accordion>
                    <label className="p-1" >Введите старый пароль для потверждения изменений!</label>
                    <Form.Control
                        type='password'
                        placeholder='Обязательно'
                        value={pass.password}
                        onChange={(e) => setPass({...pass, password: e.target.value})}
                    />

                    {alertMessage.show &&
                        <Alert className='mt-2 mb-2' variant={alertMessage.variant} onClose={() => setAlertMessage({show: false})} dismissible>
                            <Alert.Heading>{alertMessage.title}</Alert.Heading>
                            <p>
                                {alertMessage.message}
                            </p>
                        </Alert>
                    }
                <div className='mt-2'>
                <MyButton style={{width: "100%"}}
                title={!pass.password ? "Введите пароль" : pass.newPassword!==pass.confirmNewPassword ? "Пароли не совпадают" : ''}
                disabled={!pass.password || pass.newPassword!==pass.confirmNewPassword}
                onClick={(e) => updateUser(e)}
                >Сохранить изменения</MyButton>
                </div>

                </Form>
            </Container>
        </div>
    );
};

export default UserPage;