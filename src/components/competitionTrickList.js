import React from 'react';

const CompetitionTrickList = ({tricks}) => {
    return (
        <div className='competition-trick-list'>
            {tricks?.length>0 &&
                <div>
                    <div  className='d-flex justify-content-between trick header'>
                        <div>Трюк</div>
                        <div>Баллы за трюк</div>
                    </div>
                    {tricks.sort((a, b) => a?.trick?.category?.categoryId - b?.trick?.category?.categoryId).map(t =>
                        <div key={t.id} className='d-flex justify-content-between trick'>
                            <div title={t?.trick?.description}>
                                {t?.trick?.category?.parent?.name && `${t.trick.category.parent.name} > `}
                                {`${t?.trick?.category?.name} > `}
                                {t?.trick?.name}
                            </div>
                            <div>{t?.trick?.defaultPoints}</div>
                        </div>
                    )
                    }
                </div>
            }

        </div>
    );
};

export default CompetitionTrickList;