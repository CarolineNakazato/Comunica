<template>
  <div>   
    <form @submit.prevent="login">     
      <h2>Login</h2>     
      <input type="email" placeholder="Email address..." v-model="email"/>     
      <input type="password" placeholder="password..." v-model="password"/>     
      <button type="submit">Login</button>   
    </form> 
  </div>
</template>

<script>
import firebase from "firebase/app";
import 'firebase/firestore';

export default {
  name: "Home",
  data() {
    return {
      email: "",
      password: "",
      firestore: firebase.firestore(),
      ehFono: false
    };
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.firestore.collection("usersCollection").get().then((users) => {
            users.docs.forEach(user => {
              let userInformations = user.data();
              
              if (userInformations.crfa) {
                alert('Successfully logged in');
                this.$router.push({ name: 'Dashboard Fono', params: {docEmail: this.email, docPass: this.password }});
              }
              else {
                alert('Successfully logged in');
                this.$router.push('/dashboardPaciente');
              }
            });
          })
        })
        .catch(error => {
          alert(error.message);
        });
    },
  },
};
</script>
