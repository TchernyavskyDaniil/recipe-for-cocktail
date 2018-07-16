import firebase from 'firebase';
import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
  apiKey: "SECRET KEY",
  authDomain: "ninja-smoothies-tchernyavsky.firebaseapp.com",
  databaseURL: "https://ninja-smoothies-tchernyavsky.firebaseio.com",
  projectId: "ninja-smoothies-tchernyavsky",
  storageBucket: "ninja-smoothies-tchernyavsky.appspot.com",
  messagingSenderId: "SECRET ID"
};
const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings({ timestampsInSnapshots: true });

export default firebaseApp.firestore();
