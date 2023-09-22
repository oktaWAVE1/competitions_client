import React from 'react';
import cl from './MyButton.module.css'
const MyButton = ({children, classes, ...props}) => {

    return (
        <button {...props} className={classes ? classes + " " + cl.button : cl.button}>
            {children}
        </button>
    );
};

export default MyButton;