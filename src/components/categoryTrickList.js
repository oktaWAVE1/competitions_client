import React from 'react';
import MyButton from "../UI/MyButton/MyButton";

const CategoryTrickList = ({tricks, currentCategory, addTrick}) => {

    return (
        <div>
            {(tricks?.length>0 && currentCategory) &&
                <div>
                    {tricks.filter(t => t.trick.categoryId.toString() === currentCategory).map(t =>
                        <MyButton onClick={() => addTrick(t.points, 0, t.points, t.id)} title={t?.trick?.description} key={t.id}>{t?.trick?.name}</MyButton>
                    )}
                </div>
            }
        </div>
    );
};

export default CategoryTrickList;