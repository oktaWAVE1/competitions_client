import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {useNavigate, useParams} from "react-router-dom";
import MyButton from "../../UI/MyButton/MyButton";
import Loader from "../../UI/Loader/Loader";
import {fetchGroup} from "../../http/competitionAPI";

const GroupPublicPage = observer(() => {
    const {loading} = useContext(Context)
    const {groupId} = useParams()
    const navigate = useNavigate()
    const [group, setGroup] = useState({});

    useEffect(() => {
        fetchGroup({groupId}).then(data => setGroup(data)).finally(() => loading.setLoading(false))
    }, [groupId]);

    if (loading.loading) {
        return <Loader/>
    }
    return (
        <div className='w-100 p-2'>
            <h1>Группа заездов. {group?.description}.</h1>
            {group?.heat?.length>0 &&
                <div>
                    <h3>Участники: </h3>
                    <div className='row header'>
                        <div className='col text-center'>Раунд</div>
                        <div className='col-6'>Участник</div>
                        <div className='col-4 text-center'>Итоговый балл</div>
                        <hr />
                    </div>
                    {group.heat.sort((a,b) => b?.total - a?.total).sort((a,b) => b?.round - a?.rount).map(h =>
                        <div key={h.id} className='row'>
                            <div className='col text-center'>{h?.round}</div>
                            <div className='col-6'>{h?.contestant?.name} {h?.contestant?.number>0 && `- ${h.contestant.number}`}</div>
                            <div className='col-4 text-center'>{h?.total}</div>
                            <hr />
                        </div>

                    )}

                </div>
            }



            <MyButton classes='mt-2 w-100' onClick={() => navigate(-1)}>Перейти назад</MyButton>
        </div>
    );
});

export default GroupPublicPage;