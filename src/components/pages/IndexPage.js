import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {fetchAllCompetitions} from "../../http/competitionAPI";
import {Context} from "../../index";
import {Link} from "react-router-dom";
import Loader from "../../UI/Loader/Loader";
import {Helmet} from "react-helmet";

const IndexPage = observer(() => {
    const {loading} = useContext(Context)
    const [currentCompetition, setCurrentCompetition] = useState([]);
    useEffect(() => {
        loading.setLoading(true)
        fetchAllCompetitions().then(data => {
            setCurrentCompetition(data.sort((a, b) => b.id - a.id))}).finally(() => loading.setLoading(false))
    }, []);
    if(loading.loading) {
        return <Loader/>
    }
    return (
        <div className='w-100'>
            <h1>Список соревнований:</h1>
            {currentCompetition?.length>0 &&
                <div>
                    {currentCompetition.map(c =>
                    <div key={c.id} className='d-flex flex-column align-items-center index-competition'>
                        <Link to={`/competition/${c.id}`}>

                            <div><h2>{c?.name}</h2></div>
                            <div><h4>{c?.description}</h4></div>
                            {c?.competition_images?.length>0 &&
                                <div className='d-flex flex-column align-items-center'><img alt='' src={`${process.env.REACT_APP_API_URL}/images/competitions/mini/${c.competition_images.sort((a,b) => a?.id-b?.id)[0]['img']}`} /></div>
                            }
                        </Link>
                    </div>
                    )}
            </div>
            }
            <Helmet>
                <title>wow-contest.ru</title>
            </Helmet>
        </div>
    );
});

export default IndexPage;