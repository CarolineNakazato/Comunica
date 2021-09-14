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
        .then((loggedUserInformation) => {
          console.log(loggedUserInformation);
          this.firestore.collection("usersCollection").get().then((users) => {
            let usersInformations = [];

            users.docs.forEach(user => {
              usersInformations.push(user.data());
            });

            const loggedUserInfo = usersInformations.filter(user => user.uid === loggedUserInformation.user.uid);

            if (loggedUserInfo.length === 0) {
              alert('Successfully logged in');
              this.$router.push('/dashboardPaciente');
            }
            else {
              alert('Successfully logged in');
              this.$router.push({ name: 'Dashboard Fono', params: {docEmail: this.email, docPass: this.password }});
            }
          })
        })
        .catch(error => {
          alert(error.message);
        });
    },
  },
};
</script>
