import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyDuh_DCHkHYjI3S-RAL4vzdv45PtWjg6pA",
  authDomain: "grocery-app-3516f.firebaseapp.com",
  databaseURL: "https://grocery-app-3516f.firebaseio.com",
  projectId: "grocery-app-3516f",
  storageBucket: "grocery-app-3516f.appspot.com",
  messagingSenderId: "935910581449"
};

firebase.initializeApp(config);

//can add more providers by exporting
export const providerA = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;
