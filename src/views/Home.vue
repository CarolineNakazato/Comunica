<template>
  <div class="login-form">     
    <h2>Login</h2>
    <div class="form__group field">
      <input v-model="email" type="email" class="form__field" placeholder="E-mail" name="email" id="email" maxlength="50" required/>
      <label for="email" class="form__label">E-mail</label>
    </div>
    <div class="form__group field">
      <input v-model="password" type="password" class="form__field" placeholder="Senha" name="password" id="password" required/>
      <label for="password" class="form__label">Senha</label>
    </div>
    <a class="btn btn2" @click="login">Login</a>
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
            console.log(loggedUserInfo);

            
            const loggedUserInfo = usersInformations.filter(user => user.uid === loggedUserInformation.user.uid);
            console.log(loggedUserInfo);
            if (loggedUserInfo.length === 0) {
              this.$router.push('/dashboardPaciente');
            }
            else {
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

<style>
.btn{
  position: relative;
  display: block;
  color: #ffffff;
  font-size: 14px;
  font-family: "montserrat";
  text-decoration: none;
  margin: 30px 0;
  border: 2px solid #42b983;
  padding: 14px 60px;
  text-transform: uppercase;
  overflow: hidden;
  transition: 1s all ease;
  cursor: pointer;
}

.btn::before{
  background: #42b983;
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: -1;
  transition: all 0.6s ease;
}

.btn2::before{
  width: 100%;
  height: 0%;
}
.btn2:hover::before{
  height: 100%;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.form__group {
	 position: relative;
	 padding: 15px 0 0;
	 margin-top: 10px;
	 width: 20vw;
}
 .form__field {
	 font-family: inherit;
	 width: 100%;
	 border: 0;
	 border-bottom: 2px solid #9b9b9b;
	 outline: 0;
	 font-size: 1.3rem;
	 color: #fff;
	 padding: 7px 0;
	 background: transparent;
	 transition: border-color 0.2s;
}
 .form__field::placeholder {
	 color: transparent;
}
 .form__field:placeholder-shown ~ .form__label {
	 font-size: 1.3rem;
	 cursor: text;
	 top: 20px;
}
 .form__label {
	 position: absolute;
	 top: 0;
	 display: block;
	 transition: 0.2s;
	 font-size: 1rem;
	 color: #9b9b9b;
}
 .form__field:focus {
	 padding-bottom: 6px;
	 font-weight: 700;
	 border-width: 3px;
	 border-image: linear-gradient(to right, #11998e, #38ef7d);
	 border-image-slice: 1;
}
 .form__field:focus ~ .form__label {
	 position: absolute;
	 top: 0;
	 display: block;
	 transition: 0.2s;
	 font-size: 1rem;
	 color: #11998e;
	 font-weight: 700;
}
/* reset input */
 .form__field:required, .form__field:invalid {
	 box-shadow: none;
}
/* demo */
 body {
	 font-size: 1.5rem;
	 background-color: #222;
}
 
</style>
