import React, {Component} from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import './Home.css';
import Images from '../../ProjectImages/ProjectImages';
import {Link} from 'react-router-dom';

export default class HomePage extends Component{
    render(){
    return(
       <div>
            <Header/>
            <div class="splash-container">
                <div class="splash">
                    <h1 class="splash-head">WEB CHAT UYGULAMASI</h1>
                    <p class="splash-subhead">
                        Hadi sevdiğin biriyle konuş.
                    </p>
                    <div id="custom-button-wrapper">
                        <Link to = '/Login'>
                            <a class="my-super-cool-btn">
                                <div class="dots-container">
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                </div>
                                <span className="buttoncooltext">Başla</span>
                            </a>
                        </Link>
                    </div>
                </div>
            </div>

            <div class="content-wrapper">
                <div class="content">
                    <h2 class="content-head is-center">Features of WebChat Application</h2>
                </div>
            </div>
       </div>
        
    )
    }
}