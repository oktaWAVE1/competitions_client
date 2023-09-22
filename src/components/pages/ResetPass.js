import React, {useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {Alert, Card, Container, Form} from "react-bootstrap";
import MyButton from "../../UI/MyButton/MyButton";
import {userResetPass, userResetPassMail} from "../../http/userAPI";
import {Helmet} from "react-helmet";

const ResetPass = () => {
    const [email, setEmail] = useState('')
    const [isDisabled, setIsDisabled] = useState(false)
    const [alertMessage, setAlertMessage] = useState({title: '', message: '', show: false, variant:''})
    const [pass, setPass] = useState({pass:'', confPass: ''})
    const {activationLink} = useParams()
    const navigate = useNavigate()
    const resetPass = async (e) => {
        e.preventDefault()
        try {
        await userResetPass(activationLink, pass.pass).then(data => navigate('/login'))
        } catch (error) {
            setAlertMessage({message: error.response.data.message, show: true, variant: 'danger'})
        }
    }

    const sendMail = async (event) => {
        event.preventDefault()
        try {
            await userResetPassMail(email).then(data => setAlertMessage({
                show: true,
                message: data,
                variant: 'success'
            }))
            setIsDisabled(true)
        } catch (error) {
            setAlertMessage({message: error.response.data.message, show: true, variant: 'danger'})
        }
    }
    return (
        <div className='w-100'>
            <Container className="loginPage w-100">


                <div className='w-100'>
                    <h1>Восстановление пароля:</h1>
                <Form>
                    {!activationLink &&
                        <div className='d-flex flex-column gap-1'>
                        <Form.Control
                            type='text'
                            placeholder='Введите email'
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                        />
                                <MyButton
                                    disabled={isDisabled}
                                    onClick={(e) => sendMail(e)}
                                    style={{width: "100%"}}>ВОССТАНОВИТЬ</MyButton>
                            <div className='d-flex flex-column align-items-end'>
                                    <div>Вернуться к <Link to='/login'>авторизации</Link></div>

                            </div>
                        </div>
                    }
                    {activationLink &&
                        <div>
                        <Form.Control
                            type='password'
                            placeholder='Введите новый пароль'
                            value={pass.pass}
                            onChange={e => setPass({...pass, pass: e.target.value})}
                        />
                        <Form.Control
                            type='password'
                            placeholder='Повторите новый пароль'
                            value={pass.confPass}
                            onChange={e => setPass({...pass, confPass: e.target.value})}
                        />
                            <MyButton
                                title={pass.pass.length<8 ? 'Длина пароля должна быть больше 8 символов' : !pass.pass===pass.confPass ? "Пароли не совпадают" : ''}
                                disabled={!pass.pass===pass.confPass || pass.pass.length<8}
                                style={{width: "100%"}} onClick={(e) => resetPass(e)}>СОХРАНИТЬ НОВЫЙ ПАРОЛЬ</MyButton>
                        </div>
                    }
                </Form>
                    {alertMessage.show &&
                        <Alert className='mt-2' variant={alertMessage.variant} onClose={() => setAlertMessage({show: false})} dismissible>
                            <Alert.Heading>{alertMessage.title}</Alert.Heading>
                            <p>
                                {alertMessage.message}
                            </p>
                        </Alert>
                    }
                </div>

            </Container>
            <Helmet>
                <title>Сброс пароля | Зоолайнер</title>
            </Helmet>
        </div>
    );
};

export default ResetPass;