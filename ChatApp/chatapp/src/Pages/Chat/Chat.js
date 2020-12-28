import React from 'react'
import LoginString from "../Login/LoginStrings";
import firebase from "../../Services/firebase";
import './Chat.css';
import ChatBox from '../ChatBox/ChatBox';
import WelcomeBord from '../Welcome/Welcome';
import ReactLoading from 'react-loading';

export default class Chat extends React.Component{
    constructor(props){
        super(props)
        this.state={
            isLoading: true,
            isOpenDialogConfirmLogout: false,
            currentPeerUser: null,
            displayedContactSwitchedNotification:[],
            displayedContacts: []
        }
        this.currentUserName = localStorage.getItem(LoginString.userName);
        this.currentUserId = localStorage.getItem(LoginString.ID)
        this.currentUserPhoto = localStorage.getItem(LoginString.ProfilURL);
        this.currentUserDocumentId = localStorage.getItem(LoginString.FirebaseDocumentId)

        this.searchUsers = [];
        this.displayedContacts = [];
        this.currentUserMessages = [];
        this.notificationMessagesErase = []
        this.onProfileClick = this.onProfileClick.bind(this);
        this.getListUser = this.getListUser.bind(this);
        this.renderListUser = this.renderListUser.bind(this);
        this.getClassnameforUserandNotification = this.getClassnameforUserandNotification.bind(this);
        this.notificationErase = this.notificationErase.bind(this);
        this.updaterenderList = this.updaterenderList.bind(this);
    }
    logout = ()=>{
    firebase.auth().signOut()
    this.props.history.push('/')
    localStorage.clear()

    }
    onProfileClick = ()=>{
this.props.history.push('/profile')
    }
    componentDidMount (){
        firebase.firestore().collection('users').doc(this.currentUserDocumentId).get()
        .then((doc)=>{
            doc.data().messages.map((item)=>{
                this.currentUserMessages.push({
                    notificationId: item.notificationId,
                    number: item.number
                })
            })
            this.setState({
                displayedContactSwitchedNotification: this.currentUserMessages
            })
        })
        this.getListUser()
    }
    getListUser = async()=>{
        const result = await firebase.firestore().collection('users').get();
        if(result.docs.length > 0){
            let listUsers = []
            listUsers = [...result.docs]
            listUsers.forEach((item, index)=>{
                this.searchUsers.push(
                    {
                        key: index,
                        documentKey: item.id,
                        id: item.data().id,
                        userName: item.data().userName,
                        messages: item.data().messages,
                        ProfilURL: item.data().ProfilURL,
                        description: item.data().description
                    }
                )

            })
            this.setState({
                isLoading: false
            })
        }
        this.renderListUser()

    }
    getClassnameforUserandNotification = (itemId)=>{
        let number = 0
        let className = ""
        let check = false;
        if(this.state.currentPeerUser && 
            this.state.currentPeerUser.id === itemId){
                className = 'viewWrapItemFocused'
            }else{
                this.state.displayedContactSwitchedNotification.forEach((item)=>{
                    if(item.notificationId.length > 0){
                        if(item.notificationId === itemId){
                            check = true
                            number = item.number

                        }
                    }
                })
                if(check === true){
                    className = "viewWrapItemNotification"
                }
                else{
                    className = 'viewWrapItem'
                }
            }
            return className
    }
    notificationErase =(itemId)=>{
        this.state.displayedContactSwitchedNotification.forEach((el)=>{
            if(el.notificationId.length > 0){
                if(el.notificationId != itemId){
                    this.notificationMessagesErase.push(
                        {
                            notificationId: el.notificationId,
                            number: el.number
                        }
                    )
                }
            }
        })
        this.updaterenderList()
    }
    updaterenderList =()=>{
        firebase.firestore().collection('users').doc(this.currentUserDocumentId).update(
            {messages: this.notificationMessagesErase}
        )
        this.setState({
            displayedContactSwitchedNotification: this.notificationMessagesErase
        })
    }

    renderListUser = ()=>{
        if(this.searchUsers.length > 0){
            let viewListUser = []
            let classname =""
            this.searchUsers.map((item)=>{
                if(item.id != this.currentUserId){
                    classname= this.getClassnameforUserandNotification(item.id)
                    viewListUser.push(
                        <button
                        id={item.key}
                        className = {classname}
                        onClick = {()=>{
                            this.notificationErase(item.id)
                            this.setState({currentPeerUser: item})
                            document.getElementById(item.key).style.backgroundColor = '#fff'
                            document.getElementById(item.key).style.color = '#fff'
                        }}
                        >

                            <img
                            className = "viewAvatarItem"
                            src = {item.ProfilURL}
                            alt = ""
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">
                                    {`userName : ${item.userName}`}
                                </span>
                            </div>
                            {classname === 'viewWrapItemNotification' ?
                            <div className="notificationparagraph">
                            <p id={item.key} className="newmessages">Yeni Mesajlar</p>
                            </div>: null}
                        </button>
                    )
                        
                    
                }
            })
            this.setState({
                displayedContacts: viewListUser
            })
        }else{
            console.log("No User is Present")

        }
    }
    searchHandler =(event)=>{
        let searchQuery = event.target.value.toLowerCase(),
        displayedContacts = this.searchUsers.filter((el)=>{
            let SearchValue = el.userName.toLowerCase();
            return SearchValue.indexOf(searchQuery) != -1;
        })
        this.displayedContacts = displayedContacts
        this.displayedSearchedContacts()
    }
    displayedSearchedContacts =()=>{
        if(this.searchUsers.length > 0){
            let viewListUser = []
            let classname =""
            this.displayedContacts.map((item)=>{
                if(item.id != this.currentUserId){
                    classname= this.getClassnameforUserandNotification(item.id)
                    viewListUser.push(
                        <button
                        id={item.key}
                        className = {classname}
                        onClick = {()=>{
                            this.notificationErase(item.id)
                            this.setState({currentPeerUser: item})
                            document.getElementById(item.key).style.backgroundColor = '#fff'
                            document.getElementById(item.key).style.color = '#fff'
                        }}
                        >

                            <img
                            className = "viewAvatarItem"
                            src = {item.ProfilURL}
                            alt = ""
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">
                                    {`userName : ${item.userName}`}
                                </span>
                            </div>
                            {classname === 'viewWrapItemNotification' ?
                            <div className="notificationparagraph">
                            <p id={item.key} className="newmessages">Yeni Mesajlar</p>
                            </div>: null}
                        </button>
                    )
                        
                    
                }
            })
            this.setState({
                displayedContacts: viewListUser
            })
        }else{
            console.log("No User is Present")

        }
    }
    render(){
        return(
            <div className="root">
                <div className="body">
                    <div className="viewListUser">
                        <div className="profileviewleftside">
                            <img
                            className="ProfilePicture"
                            alt=""
                            src={this.currentUserPhoto}
                            onClick={this.onProfileClick}
                            />
                            <button className="Logout" onClick={this.logout}>Çıkış Yap</button>
                        </div>
                        <div classname="rootsearchbar">
                            <div classname="input-container">
                            <i class="fa fa-search icon"></i>
                                <input class="input-field"
                                type="text"
                                onChange={this.searchHandler}
                                placeholder="Ara"
                                />                         
                            </div>
                        </div>
                        {this.state.displayedContacts}
                    </div>
                    <div className="viewBoard">
                        {this.state.currentPeerUser ? (
                            <ChatBox currentPeerUser = {this.state.currentPeerUser}
                            showToast = {this.state.showToast}
                            />):(<WelcomeBord
                                currentUserName={this.currentUserName}
                                currentUserPhoto={this.currentUserPhoto}/>
                        
                    )}
                    </div>
                </div>               
            </div>
        )
    }
}