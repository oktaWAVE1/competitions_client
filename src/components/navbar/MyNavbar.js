import React, {useContext, useRef} from 'react';
import {Container, Nav, Navbar} from "react-bootstrap";
import cl from './MyNavbar.module.css'
import {Link, NavLink} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {userLogout} from "../../http/userAPI";


const MyNavbar = observer(() => {
    const {user} = useContext(Context)
    const logout = () => {
        user.setUser({})
        user.setIsAuth(false)
        localStorage.removeItem('token')
        userLogout()
        hideMobileMenu()
    }
    const menuRef = useRef(null)
    const togglerRef = useRef(null)
    const hideMobileMenu = () => {
        const mobileMenu = menuRef.current
        mobileMenu.className = 'navbar-collapse collapse'
        const toggler = togglerRef.current
        toggler.className = "navbar-toggler collapsed"
    }

    return (
        <div>
            <Navbar className={cl.navbar} collapseOnSelect expand="lg" variant="dark">
                <Container className={cl.container}>
                    <Navbar.Brand><Link to='/'>
                            <img alt='logo' src={process.env.REACT_APP_API_URL+'/images/logo.webp'} className={cl.navbarlogo}/>
                    </Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"  ref={togglerRef} />
                    <Navbar.Collapse id="responsive-navbar-nav" ref={menuRef}>


                            {user.isAuth && <Nav>
                                {user.user.role === 'ADMIN' &&
                                    <NavLink onClick={hideMobileMenu} className={cl.navbarItem} to='/admin'>Админ</NavLink>
                                }
                                {user.user.role === 'MODERATOR' &&
                                    <NavLink onClick={hideMobileMenu} className={cl.navbarItem} to='/moderator'>Соревнования</NavLink>
                                }
                                <NavLink onClick={hideMobileMenu} className={cl.navbarItem} to='/user'>Аккаунт</NavLink>
                                <div onClick={() => logout()} className={[cl.logout_btn, cl.navbarItem].join(" ")}>Выйти</div>

                            </Nav>
                            }
                            {!user.isAuth &&
                                <Nav>
                                    <NavLink onClick={hideMobileMenu} className={cl.navbarItem} to='/login'>Авторизация</NavLink>

                                </Nav>
                            }

                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </div>
    );
});

export default MyNavbar;