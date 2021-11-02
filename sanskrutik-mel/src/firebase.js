import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyBKZwNUXtKoSKS9WEgEhacaj3hee_CN6HE",
  authDomain: "sanskrutik-mel.firebaseapp.com",
  projectId: "sanskrutik-mel",
  storageBucket: "sanskrutik-mel.appspot.com",
  messagingSenderId: "204560343964",
  appId: "1:204560343964:web:1d8ed3824a21873696de59"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()
const db = firebase.firestore()

export { auth, provider }
export default db