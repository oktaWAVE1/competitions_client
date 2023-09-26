import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {
    addHeatTrick,
    calculateHeat,
    delHeatTrick,
    fetchCompetitionGroupHeats,
    fetchCurrentHeat
} from "../../http/heatAPI";
import MyButton from "../../UI/MyButton/MyButton";
import {Card, Form} from "react-bootstrap";
import {fetchAllCompetitionTricks} from "../../http/competitionAPI";
import {fetchCurrentSport} from "../../http/sportAPI";
import CategoryList from "../categoryList";
import CategoryTrickList from "../categoryTrickList";
import {Context} from "../../index";
import useDebounce from "../../hooks/useDebounce";
import HeatTrickList from "../heatTrickList";
import {Helmet} from "react-helmet";

const HeatPage = () => {
    const {loading} = useContext(Context)
    const {heatId} = useParams()
    const [nextId, setNextId] = useState(null);
    const navigate = useNavigate()
    const [bonus, setBonus] = useState({bonus: '', bonusDescription: ''});
    const [refresh, setRefresh] = useState(1);
    const [heat, setHeat] = useState({});
    const [tricks, setTricks] = useState([]);
    const [sportCategories, setSportCategories] = useState([]);
    const [checkedCategory, setCheckedCategory] = useState(null);
    const [searchParams] = useSearchParams()

    useEffect(() => {
        loading.setLoading(true)
        fetchCurrentHeat({id: heatId}).then(async (data) => {
            setHeat(data)
            await fetchCompetitionGroupHeats({groupId: data?.groupId, round: data?.round})
                .then((heats) => {
                    setNextId(heats.filter(h => h.teamHeatId===data.teamHeatId)
                        .filter(h => Number(h.order)===Number(data.order)+1)?.[0]?.['id'])
                })
            await fetchAllCompetitionTricks({competitionId: data.competitionId})
                .then(tricksData => setTricks([...tricksData].filter(t => t.level<=data?.group?.level)))
                .then(async () => await fetchCurrentSport(data?.competition?.sportId)
                .then(sportData => setSportCategories([...sportData.categories]))
            )})
            .finally(() => loading.setLoading(false))
        // eslint-disable-next-line
    }, [heatId, loading.refresh]);


    useDebounce(() => {
            let categoriesSet = new Set()
            tricks.forEach(t => {
                categoriesSet.add(t?.trick?.categoryId)
                categoriesSet.add(t?.trick?.category?.categoryId)
            })
            setSportCategories([...sportCategories].filter(sc => categoriesSet.has(sc.id)))
    }, 300, [tricks]);

    useDebounce(async () => {
        if(bonus.bonus) {await calculateHeat({heatId, bonus: bonus.bonus, teamId: heat?.contestant?.teamId, teamHeatId: heat?.teamHeatId, bonusDescription: (bonus.bonusDescription || heat.bonusDescription)})
            .then(async () =>
                await fetchCurrentHeat({id: heatId}).then((data) => setHeat(data)))}
    }, 2000, [bonus])

    useDebounce(async () =>{
        console.log(heat?.contestant?.teamId)
    await calculateHeat({heatId, teamHeatId: heat?.teamHeatId, teamId: heat?.contestant?.teamId}).then(async () =>
        await fetchCurrentHeat({id: heatId}).then((data) => setHeat(data)))}, 200, [refresh])

    const addTrick = async (basePoints, modifiers, total, competitionTrickId) => {
        await addHeatTrick({
            basePoints: basePoints,
            modifiers: modifiers,
            total: total,
            competitionTrickId: competitionTrickId,
            heatId: heatId,
            competitionId: heat.competitionId
        }).then(() => setRefresh(prev => prev + 1))
    }

    const delTrick = async (id) => {
        await delHeatTrick({id}).then(() => setRefresh(prev => prev + 1))
    }


    const switchCategory = (e) => {
            setCheckedCategory(e.target.value)
    }

    return (
        <div className='w-100 p-3 heat-page'>
            <MyButton classes='back-nav-btn' onClick={() => navigate(-1)}>Назад</MyButton>
            <h2>Заезд. Раунд {heat?.round}. Участник: {heat?.contestant?.name}{heat?.contestant?.number>0 && ` - ${heat.contestant.number}`}.</h2>
            <Card className='p-2 mb-3'>
                <h4>Добавить трюк</h4>
                <div className='row'>
                    <div className='col'>
                <CategoryList categories={sportCategories} checked={checkedCategory} switchCategory={switchCategory} />
                    </div>
                    <div className='col-8'>
                <CategoryTrickList addTrick={addTrick} tricks={tricks} currentCategory={checkedCategory} />
                    </div>
                </div>
            </Card>
            {}
                <HeatTrickList heatId={heat.id} header='Список сделанных трюков' setRefresh={setRefresh} modifiers={heat?.competition?.competition_modifiers} tricks={heat?.heat_tricks} delTrick={delTrick} />
            {!!heat?.total &&
            <div className='mt-3'>
                <h4>Дополнительные баллы</h4>
                <Form className='row gap-1'>
                    <Form.Control className='col' placeholder='Доволнительный балл за проезд' type='number' value={bonus.bonus || heat?.bonus} onChange={e => (setBonus({...bonus, bonus: e.target.value}))} />
                    <Form.Control className='col' placeholder='Описание' value={bonus.bonusDescription || heat?.bonusDescription} onChange={e => setBonus({...bonus, bonusDescription: e.target.value})} />
                </Form>

                <h1 className='mt-3'>Итого баллов:</h1>
                <h1 className='header'>{(heat.total).toFixed(1)}</h1>
            </div>
            }
            {nextId ?
                <MyButton classes='back-nav-btn' onClick={() => navigate(`/heat/${nextId}?${searchParams}`)}>К следующему заезду</MyButton> :
                <MyButton classes='back-nav-btn' onClick={() => navigate(`/competition_control/${heat?.competitionId}?${searchParams}`)}>Назад к сореванованию</MyButton>
            }
            <MyButton classes='mt-2 w-100' onClick={() => navigate(-1)}>Перейти назад</MyButton>

            <Helmet>
                <title>Заезд | wow-contest.ru</title>
            </Helmet>
        </div>
    );
};

export default HeatPage;