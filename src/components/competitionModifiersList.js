import React from 'react';

const CompetitionModifiersList = ({modifiers}) => {
    return (
        <div>
            {modifiers?.length >0 &&
            <div>
                <div className='row header'>
                    <div className='col-6'>Критерий</div>
                    <div className='col text-center' title='Минимальное значение'>Min</div>
                    <div className='col text-center' title='Максималное значение'>Max</div>
                </div>
                {modifiers.sort((a,b) => a.order - b.order).map(m =>
                        <div className='row' key={m.id}>
                            <div className='col-6' title={m.description}>{m.name}</div>
                            <div className='col text-center' title='Минимальное значение'>{m.min}</div>
                            <div className='col text-center' title='Максималное значение'>{m.max}</div>
                        </div>
                    )}
            </div>
            }
        </div>
    );
};

export default CompetitionModifiersList;