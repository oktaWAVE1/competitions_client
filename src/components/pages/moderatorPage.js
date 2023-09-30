import React, {useContext, useEffect, useState} from 'react';
import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import {Context} from "../../index";
import Loader from "../../UI/Loader/Loader";
import {fetchAllCompetitions} from "../../http/competitionAPI";
import {observer} from "mobx-react-lite";

const ModeratorPage = observer(() => {
    const {loading} = useContext(Context)
    const [competitions, setCompetitions] = useState([]);
    useEffect( () => {
        fetchAllCompetitions().then(data => setCompetitions(data.sort((a, b) => b.id - a.id)))
    }, []);

    if (loading.loading){
        return <Loader />
    }
    return (
        <div className='w-100 text-center'>
            <h2>Список соревнований: </h2>
            <hr />

        {competitions?.length>0 &&
            <div>
                {competitions.map(comp =>
                    <div key={comp.id}>
                        <Link title='Редактировать' to={`/edit_competition/${comp.id}`}>
                            <h4>{comp.name}</h4>
                        </Link>
                        <div className="p-2">{comp.description}</div>
                        <hr />
                    </div>
                )}
            </div>
        }
        </div>
    );
});

export default ModeratorPage;