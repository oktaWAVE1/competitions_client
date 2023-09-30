import React from 'react';
import HeatTrickItem from "./heatTrickItem";

const HeatTrickList = ({tricks, header, delTrick, modifiers, setRefresh, heatId}) => {
    return (
        <div className='heat-trick-list'>
            <h4>{header}</h4>
            {tricks?.length>0 &&
                <div>
                    <div className='header row'>
                        <div className='col'></div>
                        <div className='col-4'>Трюк</div>
                        <div className='col text-center'>Балл</div>
                        {modifiers?.length > 0 &&
                            <div className='col-5 row'>
                                {modifiers.sort((a, b) => a.order-b.order).map(m =>
                                    <div className='col text-center' key={m.id}>{m.name}
                                    </div>
                                )}
                            </div>
                        }
                        <div className='col text-center'>Итого</div>

                    </div>


                    {tricks.sort((a,b)=> a.id-b.id).map(t =>
                       <HeatTrickItem heatId={heatId} setRefresh={setRefresh} t={t} delTrick={delTrick} modifiers={modifiers} key={t.id} />
                        )}

                </div>
            }

        </div>
    );
};

export default HeatTrickList;