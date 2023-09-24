import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {fetchAllCompetitionTricks, fetchCompetitionImages, fetchCurrentCompetition} from "../../http/competitionAPI";
import {fetchUsers} from "../../http/userAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import MyButton from "../../UI/MyButton/MyButton";
import {Accordion, Form} from "react-bootstrap";
import FullImgModal from "../modals/FullImgModal";
import CompetitionTrickList from "../competitionTrickList";
import CompetitionModifiersList from "../competitionModifiersList";
import Loader from "../../UI/Loader/Loader";
import {fetchCompetitionContestants, fetchCompetitionTeams} from "../../http/contestantAPI";

const CompetitionPublicPage = observer(() => {
    const {competitionId} = useParams()
    const {loading} = useContext(Context)
    const [current, setCurrent] = useState({});
    const [competitionTricks, setCompetitionTricks] = useState([]);
    const [teams, setTeams] = useState([]);
    const [contestants, setContestants] = useState([]);
    const [imgModal, setImgModal] = useState({show: false, img: '', path: ''});
    const [competitionImages, setCompetitionImages] = useState([]);


    useEffect(() => {
        loading.setLoading(true)
        fetchCompetitionImages({competitionId}).then((data) => setCompetitionImages(data))
        fetchAllCompetitionTricks({competitionId}).then((data) => setCompetitionTricks(data))
        fetchCurrentCompetition(competitionId).then((data) => {
            setCurrent(data)
            if(data.teamType) {
                fetchCompetitionTeams({competitionId}).then(data => setTeams(data))
            } else {
                fetchCompetitionContestants({competitionId}).then(data => setContestants(data))
            }
        }).finally(() => loading.setLoading(false))
    }, [competitionId]);
    if (loading.loading){
        return <Loader/>
    }
    return (
        <div className='w-100 p-2 public-page'>
            <h1>{current?.name}</h1>
            <h4>{current?.description}</h4>

            <Accordion className='mt-0'>
                <Accordion.Item eventKey={'tricks_modifiers'}>
                    <Accordion.Header className='classic_btn'>Список трюков и критериев оценки</Accordion.Header>
                    <Accordion.Body>
                        <CompetitionModifiersList modifiers={current?.competition_modifiers} />
                        <hr />
                        <CompetitionTrickList tricks={competitionTricks} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            {current?.groups?.length>0 &&
                <div>
                    <Accordion className='mt-0'>
                        <Accordion.Item eventKey={'groups'}>
                            <Accordion.Header className='classic_btn'>Список групп заездов:</Accordion.Header>
                            <Accordion.Body>
                                {current.groups.sort((a,b) => a.id-b.id).map(g =>
                                        <div key={g.id}><Link to={`/group/${g.id}`}>{g.description}</Link></div>

                                    )}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            }


            {teams?.length > 0 &&
                <div>
                    <div className='competition-team-list'>
                    <h3>Список команд и участников</h3>
                        <div className='header'>
                            <div>Изображение</div>
                            <div>Цвет</div>
                            <div>Название</div>
                            <div className='text-center'>Баллы</div>

                        </div>
                    {teams.sort((a,b) => b?.team_result?.total - a?.team_result?.total).map(t =>
                        <div className='team' key={t.id}>
                            <div className='team-mini-img'>{t.img && <img onClick={() => setImgModal({show: true, img: t.img, path: '/images/teams/'})} src={process.env.REACT_APP_API_URL+`/images/teams/mini/${t.img}`}/>}</div>
                            <div className='team-color' style={{backgroundColor: t.color, width: '40px', height: '30px'}}></div>
                            <Link to={`/team/${t.id}`}><div className='team-name'>{t.name}</div></Link>
                            <div className='text-center'>{t?.team_result?.total}</div>
                            {t?.contestants?.length>0 &&

                                <Accordion className='mt-0'>
                                    <Accordion.Item eventKey={t.id}>
                                        <Accordion.Header className='classic_btn'>Список участников</Accordion.Header>
                                        <Accordion.Body>
                                            {t.contestants.sort((a, b)=> a.teamOrder - b.teamOrder).map(c =>
                                                <div key={c.id}>
                                                    <Link to={`/contestant/${c.id}`}><div>{`${c.teamOrder}. ${c.name}` + `${c.number ? ` - ${c.number}` : ''}`}</div></Link>
                                                </div>
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            }
                        </div>
                    )}
                </div>
                </div>
            }


                    {(contestants?.length>0 && teams?.length < 1) &&
                        <Accordion className='mt-3'>
                            <Accordion.Item eventKey={'contestants'}>
                                <Accordion.Header className='classic_btn'>Список участников</Accordion.Header>
                                <Accordion.Body>
                                        {contestants.sort((a, b)=> a.id - b.id).map((c, index) =>
                                            <div key={c.id}>
                                                <div className='text-center'>{`${index+1}. ${c.name}` + `${c.number ? ` - ${c.number}` : ''}`}</div>
                                            </div>
                                        )}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>

                         }

            {competitionImages?.length>0 &&
                <div>
                    <h3 className='mt-3'>Изображения:</h3>
                    <div className="gallery">
                        {competitionImages.map(i =>
                            <div className="gallery-item" key={i.id}>
                                <img onClick={() => setImgModal({show: true, img: i.img, path: '/images/competitions/'})}  loading="lazy" src={process.env.REACT_APP_API_URL+`/images/competitions/mini/${i.img}`} />
                            </div>
                        )}
                    </div>
                </div>
            }

            <FullImgModal onHide={() => setImgModal({...imgModal, show: false})} show={imgModal.show} img={imgModal.img} path={imgModal.path} />
            <div className='d-flex justify-content-end'>
                <Link className='text-right' to={`/host/${competitionId}`}>Страница ведущего</Link>
            </div>

        </div>
    );
});

export default CompetitionPublicPage;