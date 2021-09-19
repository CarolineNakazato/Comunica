<template>
    <div>
        <h2>Bem-vindo, Paciente!</h2>
        <Card @poop="popCard" :symbols="symbols"/>
    </div>
</template>

<script>
import firebase from "firebase/app";
import 'firebase/firestore';

import Card from "../components/Card";

export default {
    name: "dashboard-paciente",
    components: {
        Card
    },
    data() {
        return {
            symbols: [],
            firestore: firebase.firestore(),
        }
    },
    mounted() {
        const uid = firebase.auth().currentUser.uid;
        this.firestore.collection("patientCatalog").get().then((symbolsCatalog) => {
            let symbols = [];
            symbolsCatalog.docs.forEach(symbol => {
                let symbolInformations = symbol.data();
                symbols.push(symbolInformations);
            });
            symbols = symbols.filter(symbol => symbol.patientUid === uid);
            this.symbols = symbols;
        })
    },
    methods: {
        popCard(index) {
            this.symbols.splice(index, 1);
        }
    }
}
</script>

<style>
.card {
  align-items: center;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  font-size: 72px;
  height: 200px;
  justify-content: center;
  left: calc(50% - 100px);
  position: absolute;
  top: calc(50% - 100px);
  width: 200px;
}

</style>