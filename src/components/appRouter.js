import React, {useContext} from 'react';
import {Route, Routes, Navigate} from "react-router-dom";
import {adminRoutes, authRoutes, publicRoutes} from "../routes";
import {Context} from "../index";
import {observer} from "mobx-react-lite";


const AppRouter = observer(() => {
    const {user} = useContext(Context)

    return (
        <Routes>
            {user.isAuth ?
                authRoutes.map(r =>
                    <Route key={r.path} path={r.path} element={r.element}/>
                ) :
                publicRoutes.map(r =>
                    <Route key={r.path} path={r.path} element={r.element}/>
                )
            }
            {user.user.role==='ADMIN' &&
                adminRoutes.map(r =>
                    <Route key={r.path} path={r.path} element={r.element}/>
                )
            }
            <Route path="/*" element=<Navigate to='/' /> />

        </Routes>

    );
});

export default AppRouter;