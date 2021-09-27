import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBHn0tC1gshzbCCnZ2RskTqixakCHCcNGc",
    authDomain: "comunica-d93af.firebaseapp.com",
    projectId: "comunica-d93af",
    storageBucket: "comunica-d93af.appspot.com",
    messagingSenderId: "586210287956",
    appId: "1:586210287956:web:7847c922f1f6f3b42da8c1",
    measurementId: "G-V9PJMY1CHH"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

createApp(App).use(router).mount("#app");