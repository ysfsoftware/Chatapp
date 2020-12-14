import React from 'react';
import './Header.css'
import { Link } from 'react-router-dom';

function Header(){
    return(
        <header class="header-login-signup">
            <div class="header-limiter">
                <h1><a href="/">Chat<span>App</span></a></h1>
                <nav>
                    <Link to="/">Anasayfa</Link>
                    <a class="selected"><Link to="/">Hakkında</Link></a>
                    <a><Link to="/">İletişim</Link></a>
                </nav>
                <ul>
                    <li><Link to="/login">Giriş</Link></li>
                    <li><Link to="/signup">Kayıt Ol</Link></li>
                </ul>
            </div>
        </header>
    )
}
export default Header