import React from 'react'
import  firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAcRopcd1mG1LSJbhfMbl0EvZkuQPofnWc",
    authDomain: "talkto-7b6ec.firebaseapp.com",
    databaseURL: "https://talkto-7b6ec.firebaseio.com",
    projectId: "talkto-7b6ec",
    storageBucket: "talkto-7b6ec.appspot.com",
    messagingSenderId: "151506466036",
    appId: "1:151506466036:web:9a070f37b0cc639c131aa1",
    measurementId: "G-EMCPKH7G9X"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;