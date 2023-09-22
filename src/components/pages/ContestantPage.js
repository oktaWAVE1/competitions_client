import React, {useEffect, useState} from 'react';
import {fetchContestant} from "../../http/contestantAPI";
import {useNavigate, useParams} from "react-router-dom";
import MyButton from "../../UI/MyButton/MyButton";
import {Accordion} from "react-bootstrap";

const ContestantPage = () => {
    const {id} = useParams()
    const [contestant, setContestant] = useState({});
    const navigate = useNavigate()
    useEffect(() => {
        fetchContestant({id}).then(data => setContestant(data))
    }, [id]);


    return (
        <div className='contestant-page w-100 p-2'>
            <MyButton onClick={() => console.log(contestant)}>click</MyButton>

            <h1>{contestant?.name}.{contestant?.number>0 && ` Номер - ${contestant.number}`}</h1>
            <hr/>
            <h3>Всего баллов за соревнование: {contestant?.contestant_result?.total}</h3>
            {contestant?.heat?.length>0 &&
            <div>
                <hr />
                <h3>Заезды:</h3>
                {contestant?.heat.filter(h => h?.total>0).sort((a,b)=> a?.groupId - b?.groupId).sort((a,b)=> a.group.round - b.group.round).map(h =>
                    <div key={h.id}>
                    <div  className='d-flex justify-content-between p-2  mt-3 heat-groups'>
                        <div className='col-4'>Группа: {h?.group?.description}</div>
                        <div className='col-4 text-center'>Раунд: {h.round}</div>
                        <div className='col-4 text-end'>Баллов за заезд: <strong>{h?.total}</strong></div>
                    </div>
                        <Accordion className='mt-0 w-100 col-12' flush>
                            <Accordion.Item eventKey={h.id}>
                                <Accordion.Header className='classic_btn'>Список трюков.</Accordion.Header>
                                <Accordion.Body className='show'>
                                    <div className='contestant-trick-list'>
                                        <div className='text-center'>Бонус за заезд: {h.bonus}. {h.bonusDescription}</div>
                                    <div className='header'>
                                        <div>Трюк</div>
                                        <div className='text-center'>Базовый балл</div>
                                        <div className='text-center'>Надбавки/штрафы</div>
                                        <div className='text-center'>Итог</div>

                                    </div>

                                        {h?.heat_tricks.sort((a,b) => a.id- b.id).map(ht =>
                                            <div  key={ht.id} className='trick'>
                                                <div className='col-4' title={ht?.competition_trick?.trick?.description}>
                                                    {ht?.competition_trick?.trick?.category?.parent?.name && `${ht.competition_trick.trick.category.parent.name} > `}
                                                    {`${ht?.competition_trick?.trick?.category?.name} > `}
                                                    {ht?.competition_trick?.trick?.name}
                                                </div>
                                                <div className='text-center'>{ht?.basePoints}</div>
                                                <div className='text-center'>

                                                    <Accordion className='' flush>
                                                        <Accordion.Item eventKey={h.id+ht.id}>
                                                            <Accordion.Header>{ht?.modifiers.toFixed(1)}</Accordion.Header>
                                                            <Accordion.Body className='show'>
                                                                {ht?.heat_trick_modifiers?.length>0 &&
                                                                <div>
                                                                    {ht?.heat_trick_modifiers.sort((a,b)=> a.id-b.id).map(htm =>
                                                                        <div key={h.id+ht.id+htm.id}>
                                                                            <div>{htm?.competition_modifier?.name}: {htm?.value.toFixed(1)}</div>

                                                                        </div>
                                                                        )}
                                                                </div>
                                                                }

                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </Accordion>

                                                </div>
                                                <div className='text-center'><strong>{ht?.total.toFixed(1)}</strong></div>

                                            </div>
                                        )}

                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>

                    </div>
                    )}

            </div>
            }
            <MyButton classes='mt-2 w-100' onClick={() => navigate(-1)}>Перейти назад</MyButton>
        </div>
    );
};

export default ContestantPage;