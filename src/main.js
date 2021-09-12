import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBOF8LFvRQ__Z1QVdTENEBR_303oyABbF4",
    authDomain: "vue-firebase-tutorial-1b911.firebaseapp.com",
    projectId: "vue-firebase-tutorial-1b911",
    storageBucket: "vue-firebase-tutorial-1b911.appspot.com",
    messagingSenderId: "252575828557",
    appId: "1:252575828557:web:f4e1a1244e1d0c31fa6a04"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

createApp(App).use(router).mount("#app");