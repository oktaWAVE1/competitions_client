import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {fetchCompetitionGroups, fetchCurrentCompetition} from "../../http/competitionAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {fetchCompetitionGroupHeats, fetchCompetitionTeamGroupHeats} from "../../http/heatAPI";
import usePolling from "../../hooks/usePolling";
import {Helmet} from "react-helmet";

const HostPage = observer(() => {
    const {competitionId} = useParams()
    const {loading, competition} = useContext(Context)
    const [group, setGroup] = useState();
    const [currentHeats, setCurrentHeats] = useState([]);
    const [currentTeamHeats, setCurrentTeamHeats] = useState([]);
    const [refresh, setRefresh] = useState(1)
    useEffect(() => {
        loading.setLoading(true)
        fetchCompetitionGroups({competitionId}).then(async (data) => {
            const currentGroup = [...data].filter(g => g.status==='В процессе')[0]
            setGroup(currentGroup)
            if (currentGroup){
            await fetchCompetitionGroupHeats({groupId: currentGroup.id, round: currentGroup.round}).then((data) => setCurrentHeats([...data].sort((a, b) => a.order - b.order)))
            await fetchCompetitionTeamGroupHeats({groupId: currentGroup.id, round: currentGroup.round})
                .then((data) => setCurrentTeamHeats([...data].sort((a, b) => a.order - b.order)))
                }
        })
        fetchCurrentCompetition(competitionId).then((data) => competition.setCurrentCompetition(data))
        loading.setLoading(false)
    }, [competitionId, refresh]);

    usePolling(() => setRefresh(prev => prev +1), 20000)


    return (
        <div className='p-2'>
            <h1>Страница ведущего мероприятия. {competition.currentCompetition?.name}.</h1>
            <h4>Группа заездов: {group?.description}</h4>
            <h4>Раунд: {group?.round}</h4>
            <h2>Список участников</h2>
            {currentHeats?.length>0 && currentTeamHeats?.length<1 &&
                <div className='group-list mt-3'>
                    <h4>Список заездов:</h4>
                    <div className='header d-flex justify-content-between mb-2'>
                        <div>Участник</div>
                        <div>Сумма баллов</div>
                    </div>
                    {currentHeats.map(h =>
                        <div className='d-flex justify-content-between' key={h.id}>
                            <div><Link to={`/contestant/${h.contestantId}`}>{h.order}. {h?.contestant?.name} {h?.contestant?.number>0 && `- ${h.contestant.number}`}</Link></div>
                            <div className='text-right'>{h.total}</div>
                        </div>
                    )}
                </div>
            }
            {currentTeamHeats?.length>0 &&
                <div className=''>
                    <h4>Список заездов:</h4>
                    <div className='header d-flex justify-content-between mb-2'>
                        <div>Команда/Участник</div>
                        <div>Сумма баллов</div>
                    </div>
                    {currentTeamHeats.map(th =>
                        <div  key={th.id} className='mt-3'>
                        <div className='d-flex justify-content-between header'>
                            <div><Link to={`/team/${th?.teamId}`}>{th.order}. {th?.team?.name}</Link></div>
                            <div className='text-right'>{th.total}</div>
                        </div>
                            {th?.heat?.length>0 &&
                                <div className='mt-2'>
                                    {th.heat.sort((a,b) => a?.contestant?.teamOrder-b?.contestant?.teamOrder).map((h, index) =>
                                        <div className='d-flex justify-content-between' key={h.id}>
                                        <div><Link to={`/contestant/${h.contestantId}`}>{index + 1}. {h?.contestant?.name} {h?.contestant?.number>0 && `- ${h.contestant.number}`}</Link></div>
                                        <div className='text-right'>{h.total}</div>

                                        </div>
                                        )}
                                </div>
                            }


                        </div>
                    )}
                </div>
            }
            <Helmet>
                <title>Страница ведущего | wow-contest.ru</title>
            </Helmet>


        </div>
    );
});

export default HostPage;