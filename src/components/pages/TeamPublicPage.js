import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {fetchTeam} from "../../http/contestantAPI";
import MyButton from "../../UI/MyButton/MyButton";

const TeamPublicPage = () => {
    const [team, setTeam] = useState({});
    const {teamId} = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        fetchTeam({id: teamId}).then(data => setTeam(data))
    }, [teamId]);

    return (
        <div className='w-100 p-2'>
            <MyButton onClick={() => console.log(team)}>click</MyButton>
            <h3>Команда: {team?.name}</h3>
            <h3>Сумма баллов команды: <strong>{team?.team_result?.total}</strong></h3>
            {team?.contestants?.length>0 &&
                <div>
                    <hr />
                    <h3>Список участников: </h3>

                            {team.contestants.sort((a, b)=> a.teamOrder - b.teamOrder).map(c =>
                                <div key={c.id} className='text-center'>
                                    <Link to={`/contestant/${c.id}`}><div>{`${c.teamOrder}. ${c.name}` + `${c.number ? ` - ${c.number}` : ''}`}</div></Link>
                                </div>
                            )}
                    <hr />
                </div>
            }

            {team?.team_heats?.length>0 &&
                <div>

                    {team.team_heats.sort((a,b) => a.round - b.round).map(th =>
                        <div key={th.id}>
                            <div>Раунд: {th.round}. Сумма баллов за заезд: <strong>{th.total}</strong>. {th.bonus>0 && `(В том числе бонус: ${th.bonus}. ${th.bonusDescription})`}</div>
                        </div>
                        )}

                </div>
            }

            <MyButton classes='mt-2 w-100' onClick={() => navigate(-1)}>Перейти назад</MyButton>
        </div>
    );
};

export default TeamPublicPage;