import React from 'react';
import './Profile.css';
import ReactLoading from 'react-loading';
import 'react-toastify/dist/ReactToastify.css';
import firebase from '../../Services/firebase';
import Images from '../../ProjectImages/ProjectImages';
import LoginString from '../Login/LoginStrings';


export default class Profile extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isLoading: false,
            documentKey: localStorage.getItem(LoginString.FirebaseDocumentId),
            id: localStorage.getItem(LoginString.ID),
            name: localStorage.getItem(LoginString.userName),
            aboutMe: localStorage.getItem(LoginString.Description),
            profilUrl: localStorage.getItem(LoginString.ProfilURL),
        }
        this.newPhoto = null
        this.newprofilUrl = ""
    }
    componentDidMount(){
        if(!localStorage.getItem(LoginString.ID)){
            this.props.history.push("/")
        }
    }
    onChangeNickname=(event)=>{
        this.setState({
            name: event.target.value
        })
    }
    onChangeAboutMe=(event)=>{
        this.setState({
            aboutMe: event.target.value
        })
    }
    onChangeAvatar =(event)=>{
        if(event.target.files && event.target.files[0]){
            const prefixFileType = event.target.files[0].type.toString()
            if(prefixFileType.indexOf(LoginString.PREFIX_IMAGE) !== 0){
                this.props.showToast(0, "Bu dosya bir resim dosyası değil")
                return 
            }
            this.newPhoto = event.target.files[0]
            this.setState({profilUrl: URL.createObjectURL(event.target.files[0])})
        }else{
            this.props.showToast(0, "Giriş dosyasında bir sorun var")
        }
    }
    uploadAvatar =()=>{
        this.setState({isLoading: true})
        if(this.newPhoto){
            const uploadTask = firebase.storage()
            .ref()
            .child(this.state.id)
            .put(this.newPhoto)
            uploadTask.on(
                LoginString.UPLOAD_CHANGED,
                null,
                err =>{
                    this.props.showToast(0, err.message)
                },
                ()=>{
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL=>{
                        this.updateUserInfo(true, downloadURL)
                    })
                }
            )
        }else{
            this.updateUserInfo(false ,null)
        }
    }
    updateUserInfo =(isUpdatedProfilURL, downloadURL)=>{
        let newinfo
        if(isUpdatedProfilURL){
            newinfo={
                userName: this.state.name,
                Description: this.state.aboutMe,
                URL: downloadURL
            }
        }else{
            newinfo={
                userName: this.state.name,
                Description: this.state.aboutMe
            }
            firebase.firestore().collection('users')
            .doc(this.state.documentKey)
            .update(newinfo)
            .then(data=>{
                localStorage.setItem(LoginString.userName, this.state.name)
                localStorage.setItem(LoginString.Description, this.state.aboutMe)
                if(isUpdatedProfilURL){
                    localStorage.setItem(LoginString.ProfilURL, downloadURL)
                }
                this.setState({isLoading: false})
                this.props.showToast(1, 'Yükleme başarılı')
            })
        }
    }
    render(){
        return(
            <div className="profileroot">
                <div className="headerprofile">
                    <span>PROFİL</span>
                </div>
                <img className="avatar" alt="" src={this.state.profilUrl}/>
                <div className="viewWrapInputFile">
                    <img
                    className="imgInputFile"
                    alt="icon gallery"
                    src={Images.choosefile}
                    onClick={()=>{this.refInput.click()}}
                    />
                    <input
                    ref={el =>{
                        this.refInput = el
                    }}
                    accept = "image/*"
                    className = "viewInputFile"
                    type = "file"
                    onChange = {this.onChangeAvatar}
                    />
                </div>
                    <span className="textLabel">İsim</span>
                    <input
                    className="textInput"
                    value={this.state.name ? this.state.name : ""}
                    placeholder="İsminiz..."
                    onChange={this.onChangeNickname}
                    />
                    <span className="textLabel">Hakkımda</span>
                    <input
                    className="textInput"
                    value={this.state.aboutMe ? this.state.aboutMe : ""}
                    placeholder="Kendinden bahset..."
                    onChange={this.onChangeAboutMe}
                    
                    />
                    <div>
                        <button className="btnUpdate" onClick={this.uploadAvatar}>
                            KAYDET
                        </button>
                        <button className="btnback" onClick={()=>{this.props.history.push('/chat')}}>
                            GERİ
                        </button>
                    </div>
                    {this.state.isLoading ?(
                        <div>
                            <ReactLoading
                                type={'spin'}
                                color={'#203152'}
                                height={'3%'}
                                width={'3%'}
                            />
                        </div>
                    ): null}
            </div>
        )
    }
}