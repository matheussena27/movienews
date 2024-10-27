import React from 'react';
import logo from '../../../assets/images/logo.png'; // Importa a logo
import style from './Menu.module.css'
import { Navigate, useNavigate, Link } from 'react-router-dom';

function Menu(){
    return(
    <header>
        <div className={style.logo}>
            <Link to="/"><img src={logo} alt="logo" />
            Movienews</Link>
        </div>
        <nav>
            <ul>
                <li><Link to="/sobre">Sobre</Link></li>
                <li><Link to="/logout">Logout</Link></li>
            </ul>
        </nav>
    </header>
    );
};

export default Menu;