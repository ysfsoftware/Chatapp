import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import "./Signup.css";
import {Card} from 'react-bootstrap';
import firebase from '../../Services/firebase';

import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LoginString from '../Login/LoginStrings';

export default class SignUp extends Component{
    constructor(){
        super();
        this.state= {
            email:"",
            password:"",
            userName:"",
            error:null
        }
        this.handlechange=this.handlechange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    }
    handlechange(event){
        this.setState({
            [event.target.name]: event.target.value
            
        });
    }
    async handleSubmit(event){
        const {userName,password,email}=this.state; 
        event.preventDefault();
        try{
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async result =>{
                firebase.firestore().collection('users')
                .add({
                    userName,
                    userID:result.user.uid,
                    email,
                    password,
                    URL:'',
                    description:'',
                    messages:[{notificationId:"",number: 0}]

                }).then((docRef)=>{
                    localStorage.setItem(LoginString.ID, result.user.uid);
                    localStorage.setItem(LoginString.userName, userName);
                    localStorage.setItem(LoginString.Email, email);
                    localStorage.setItem(LoginString.Password, password);
                    localStorage.setItem(LoginString.PhotoURL, "");
                    localStorage.setItem(LoginString.UPLOAD_CHANGED, 'state_changed');
                    localStorage.setItem(LoginString.Description, "");
                    localStorage.setItem(LoginString.FirebaseDocumentId, docRef.id);
                    this.setState({
                        userName:'',
                        password:'',
                        url:'',
                    });
                    this.props.history.push("/chat")
                })
                .catch((error) =>{
                    console.error("Error adding document",error) 
                })
            })
        } 
        catch(error){
            document.getElementById('1').innerHTML="Giriş yaparken hata oluştu lütfen tekrar deneyin"

        }
    }
    render(){
        const Signinsee={
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            color:'White',
            backgroundColor:'#1ebea5',
            width:'100%',
            boxShadow:"0 5px 5px #808888",
            height:"10rem",
            paddingTop:"48px",
            opactiy:"0.5",
            borderBottom:'5px solid green',
        }
        return (
            <div>
                <CssBaseline/>
                <Card style={Signinsee}>
                    <div>
                    <Typography component="h1" variant="h5">
                        Sign Up
                        To
                    </Typography>
                    </div>
                    <div>
                        <Link to="/">
                            <button class="btn"><i class="fa fa-home"></i>WebChat</button>
                        </Link>
                    </div>
                </Card>
              <Card className="formacontrooutside">
                  <form className="customform" noValidate onSubmit={this.handleSubmit}>

                    <TextField 
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Adres Örneği:abc@gmail.com"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={this.handlechange}
                    value={this.state.email}
                    />
                    
                    <TextField 
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Şifre"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    autoFocus
                    onChange={this.handlechange}
                    value={this.state.password}
                    />
                    <TextField 
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="userName"
                    label="İsim Giriniz"
                    name="userName"
                    autoComplete="userName"
                    autoFocus
                    onChange={this.handlechange}
                    value={this.state.userName}
                    />
                   <div className="CenterAliningItems">
                       <button class="button1" type="submit">
                           <span>Kayıt Ol</span>
                       </button>
                   </div>
                   <div>
                       <p style={{color:'grey'}}>Bir Hesabınız var mı?</p>
                       <Link to="/login">
                           Giriş Yap
                       </Link>
                   </div>
                   <div className="error">
                       <p id='1' style={{color:'red'}}></p>
                   </div>
                  </form>
              </Card>
            </div>
        )
    }
}