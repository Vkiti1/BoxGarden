import firebase from "firebase/app";
import Vue from "vue";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAQcvWTANa2S9RaeTbF6QhJA0xikNPf3SQ"
  },
  installComponents: true
});
const firebaseConfig = {
  apiKey: "AIzaSyBD--DyCpxmjetpoJophaOigUyTWsw8c_g",
  authDomain: "boxgarden-fec52.firebaseapp.com",
  projectId: "boxgarden-fec52",
  storageBucket: "boxgarden-fec52.appspot.com",
  messagingSenderId: "240923397448",
  appId: "1:240923397448:web:2fc48d986571fe2812777d",
  measurementId: "G-BNECNJ0EQN"
};

firebase.initializeApp(firebaseConfig);
export default ({ Vue }) => {
  Vue.prototype.$auth = firebase.auth();
  Vue.prototype.$db = firebase.firestore();
  Vue.prototype.$storage = firebase.storage();
};
