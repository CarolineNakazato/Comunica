<template>
    <div>
        <form @submit.prevent="register">
        <h2>Register</h2>
        <input type="email" placeholder="Email address..." v-model="email" />
        <input type="password" placeholder="password..." v-model="password" />
        <input type="number" placeholder="CRFa..." v-model="crfa" />
        <button type="submit">Register</button>
        </form>
    </div>
</template>

<script>
import firebase from "firebase/app";
import 'firebase/firestore';

export default {
    name: "about",
    data() {
        return {
            email: "",
            password: "",
            crfa: "",
            firestore: firebase.firestore()
        };
    },
    methods: {
        async register() {
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.email, this.password)
                    .then((registeredUser) => {
                        this.firestore.collection("usersCollection")
                            .add({
                                uid: registeredUser.user.uid,
                                crfa: this.crfa
                            })
                        alert('Successfully registered! Please login.');
                        this.$router.push('/');
                    })
                    .catch(error => {
                        alert(error.message);
                    });
        },
    },
};
</script>
