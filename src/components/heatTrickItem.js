import React, {useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import useDebounce from "../hooks/useDebounce";
import {calculateHeat, modifyHeatModifier} from "../http/heatAPI";
import {observer} from "mobx-react-lite";

const HeatTrickItem = observer(({t, delTrick, modifiers, setRefresh, heatId}) => {
    const [currentMods, setCurrentMods] = useState({});
    const [modToChange, setModToChange] = useState({id: '', value: ''});
    useEffect(() => {
        let tempMods = {}
        t?.heat_trick_modifiers.forEach(m => tempMods[m.id]='')
        setCurrentMods(tempMods)
    }, [t]);

    useDebounce(async() => {
        if(modToChange.id){
            await modifyHeatModifier({
                id: modToChange.id,
                value: modToChange.value,
                trickId: modToChange.trickId
            }).then(async () => await calculateHeat({heatId})).then(() => setRefresh(prev => prev+1))
        }}
    , 1000, [modToChange])

    const handleChange = (e, modId, id, trickId) => {
        const mod = modifiers.filter(m => m.id===modId)[0]
        const value = Math.max(mod.min, Math.min(mod.max, parseFloat(e.target.value)))
        setCurrentMods({...currentMods, [id]: value})
        setModToChange({id: id, value, trickId})
    }

    return (
        <div className='trick row align-items-center' key={t.id}>
                            <span title='Удалить трюк из заезда' onClick={() => delTrick(t.id)} className="del-mini-btn material-symbols-outlined col">
                                        close
                                    </span>
            <div className='col-4' title={t?.competition_trick?.trick?.description}>
                {t?.competition_trick?.trick?.category?.parent?.name && `${t.competition_trick.trick.category.parent.name} > `}
                {`${t?.competition_trick?.trick?.category?.name} > `}
                {t?.competition_trick?.trick?.name}
            </div>
            <div className='col text-center'>{t?.basePoints}</div>

            <Form className='col-5 row'>
                {t?.heat_trick_modifiers.sort((a,b) => a.id - b.id).map(m =>
                    <div className='col text-center d-flex flex-column align-items-center' key={t.id + m.id +1}>
                        <span>{currentMods[m.id]?.toString().length>0 ? currentMods[m.id] : m.value}</span>

                        <input
                            type='range'
                            min={m?.competition_modifier?.min}
                            max={m?.competition_modifier?.max}
                            step={m?.competition_modifier?.step}
                            value={currentMods[m.id]?.toString().length>0 ? currentMods[m.id] : m.value}
                            onChange={e => handleChange(e, m.competitionModifierId, m.id, t.id)}/>
                    </div>
                )}
            </Form>

            <div className='col text-center'>{t?.total.toFixed(1)}</div>
        </div>
    );
});

export default HeatTrickItem;