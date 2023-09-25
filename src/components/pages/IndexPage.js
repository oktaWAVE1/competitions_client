import React, {useContext, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {fetchAllCompetitions} from "../../http/competitionAPI";
import {Context} from "../../index";
import {Link} from "react-router-dom";
import Loader from "../../UI/Loader/Loader";
import {Helmet} from "react-helmet";

const IndexPage = observer(() => {
    const {competition, loading} = useContext(Context)
    useEffect(() => {
        loading.setLoading(true)
        fetchAllCompetitions().then(data => competition.setCompetition(data.sort((a, b) => b.id - a.id))).finally(() => loading.setLoading(false))
    }, []);
    if(loading.loading) {
        return <Loader/>
    }
    return (
        <div className='w-100'>
            <h1>Список соревнований:</h1>
            {competition?.competition?.length>0 &&
                <div>
                    {competition.competition.map(c =>
                    <div key={c.id} className='d-flex flex-column align-items-center index-competition'>
                        <Link to={`/competition/${c.id}`}>

                            <div><h2>{c?.name}</h2></div>
                            <div><h4>{c?.description}</h4></div>
                            {c?.competition_images?.length>0 &&
                                <div className='d-flex flex-column align-items-center'><img alt='' src={`${process.env.REACT_APP_API_URL}/images/competitions/mini/${c.competition_images[0]['img']}`} /></div>
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