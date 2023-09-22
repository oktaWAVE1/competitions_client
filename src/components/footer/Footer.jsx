import React from 'react';
import cl from "./Footer.module.css"

const Footer = () => {
    const currentYear =  new Date().getFullYear()
    return (
        <div className={cl.footer}>
            <h6>WOW-contests?! © 2022-{currentYear} Все права защищены.</h6>
        </div>
    );
};

export default Footer;