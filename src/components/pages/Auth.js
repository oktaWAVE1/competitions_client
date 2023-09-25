import React, {useContext, useState} from 'react';
import {Form, Card, Container, Alert} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {Link, useLocation} from "react-router-dom";
import MyButton from "../../UI/MyButton/MyButton";
import {login, registration} from "../../http/userAPI";
import {validate} from "email-validator";
import {Helmet} from "react-helmet";


const Auth = observer(() => {
    const {user} = useContext(Context)
    const [isDisabled, setIsDisabled] = useState(false)
    const [currentUser, setCurrentUser] = useState({
        name: '', email: '', telephone: '', password: '', passwordConfirm: ''
    })
    const [alertMessage, setAlertMessage] = useState({title: '', message: '', show: false, variant: 'danger'})

    const location = useLocation()
    const isLogin = location.pathname === "/login"
    const doAuth = async (event) => {
        event.preventDefault();
        let data
        try {
            if (isLogin){
                    setIsDisabled(false)
                    data = await login(currentUser.email, currentUser.telephone, currentUser.password)
                    user.setUser(data)
                if(user.user.role) {
                    user.setIsAuth(true)
                }
            }
            else{
                setIsDisabled(true)
                if (!validate(currentUser.email)){
                    setAlertMessage({message: 'Вы ввели некорректный email', show: true, variant: 'danger'})
                } else if (currentUser.password!==currentUser.passwordConfirm){
                    setAlertMessage({message: 'Пароли не совпадают', show: true, variant: 'danger'})
                } else {
                    await registration(currentUser.name, currentUser.telephone, currentUser.email, currentUser.password).then(data => {
                            setAlertMessage({
                                message: 'На ваш Email отправлено письмо с подтверждением регистрации. Пожалуйста пройдите по ссылке в письме.',
                                show: true,
                                variant: 'success'
                            });

                        }
                    )
                }

            }


    } catch (e) {
            setAlertMessage({message: e.response.data.message, show: true, variant: 'danger'})
    }
    }

    return (
        <Container className="loginPage">
            <div className='p-2'>
                <Form onSubmit={doAuth} className='auth_form d-flex flex-column gap-1'>
                    <h1>{isLogin ? 'Авторизация' : 'Регистрация'}</h1>
                    {alertMessage.show &&
                        <Alert variant={alertMessage.variant} onClose={() => setAlertMessage({show: false})} dismissible>
                            <Alert.Heading>{alertMessage.title}</Alert.Heading>
                            <p>
                                {alertMessage.message}
                            </p>
                        </Alert>
                    }

                    {!isLogin &&
                        <Form.Control

                            value={currentUser.name}
                            onChange={e => setCurrentUser({...currentUser, name: e.target.value})}
                            placeholder='Имя'
                            type='text'
                        />}
                    {!isLogin &&
                        <Form.Control
                        value={currentUser.telephone}
                        onChange={e => setCurrentUser({...currentUser, telephone: e.target.value})}
                        placeholder='Телефон в формате +7 XXX XXX XX XX'
                        maxLength='10'
                        size='10'
                        type='tel'
                        />

                    }

                    <Form.Control
                        value={currentUser.email}
                        onChange={e => setCurrentUser(isLogin? {...currentUser, email: e.target.value, telephone: e.target.value} : {...currentUser, email: e.target.value} )}

                        placeholder={isLogin ? 'Email или телефон' : 'Email'}
                        type='text'
                    />
                    <Form.Control
                        value={currentUser.password}
                        onChange={e => setCurrentUser({...currentUser, password: e.target.value})}
                        placeholder='Пароль'
                        type='password'
                    />
                    {!isLogin &&
                        <Form.Control
                            value={currentUser.passwordConfirm}
                            onChange={e => setCurrentUser({...currentUser, passwordConfirm: e.target.value})}
                            placeholder='Еще раз пароль'
                            type='password'
                            title={currentUser.passwordConfirm!==currentUser.password ? 'Пароли не совпадают' : ''}
                            className={currentUser.passwordConfirm!==currentUser.password && 'pass_dont_match'}
                        />
                    }
                    <MyButton
                    disabled={isDisabled}
                    type='submit'
                    >
                        {isLogin? "ВОЙТИ" : "ЗАРЕГИСТРИРОВАТЬСЯ"}
                    </MyButton>
                    <div className='d-flex justify-content-end'>

                        <div className='d-flex flex-column align-items-end'>
                            {isLogin ?
                                <div>Нет аккаунта? <Link to='/reg' onClick={() => setCurrentUser({email:'', name: '', telephone: '', password: ''})}> Регистрация.</Link></div>
                                :
                                <div>Уже зарегестрированы? <Link to='/login' onClick={() => setCurrentUser({email:'', name: '', telephone: '', password: ''})}> Авторизация.</Link></div>
                            }
                            {isLogin &&
                                <div>Забыли пароль?<Link to='/reset_pass'> Восстановить.</Link></div>
                            }
                        </div>
                    </div>


                </Form>
            </div>
            <Helmet>
                <title>Страница аутентефикации | Зоолайнер</title>
            </Helmet>
        </Container>
    );
});

export default Auth;