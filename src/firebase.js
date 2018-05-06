import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAB1tqPGrlHvkgV2YIUwU1_m4uz4l91uPM",
    authDomain: "simple-note-5ecab.firebaseapp.com",
    databaseURL: "https://simple-note-5ecab.firebaseio.com",
    projectId: "simple-note-5ecab",
    storageBucket: "",
    messagingSenderId: "122748685879"
  };


firebase.initializeApp(config);

export default firebase;
export const db = firebase.database();
export const auth = firebase.auth();
export const fbProvider = new firebase.auth.FacebookAuthProvider();
export const ggProvider = new firebase.auth.GoogleAuthProvider();