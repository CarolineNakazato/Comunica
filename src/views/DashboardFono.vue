<template>
    <div>
        <h2>Seja bem-vindo, fonoaudiólogo(a)</h2>
        <button @click="addPatient">Adicionar Paciente</button>
        <div v-show="showAddPatientForm">
            <h2>Adicionar paciente</h2>
            <input type="text" placeholder="Nome..." v-model="nome" />
            <input type="email" placeholder="E-mail..." v-model="email" />
            <input type="password" placeholder="Senha..." v-model="password" />
            <button @click="savePatient">Salvar Paciente</button>
        </div>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>
                            Nome
                        </th>
                        <th>
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="patient in patients" :key="patient.uid">
                        <td>
                            {{ patient.name }}
                        </td>
                        <td>
                            <button @click="addSymbol(patient)">Adiconar símbolo</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showSymbolForms">
            <h2>Adicionar símbolo</h2>
            <input type="text" placeholder="Texto do símbolo..." v-model="symbolText" />
            <input type="file" @change="previewFiles" multiple>
            <button @click="saveSymbol">Salvar Símbolo</button>
        </div>
    </div>    
</template>

<script>
import firebase from "firebase/app";
import 'firebase/firestore';

export default {
    data() {
        return {
            email: "",
            password:"",
            nome: "",
            showAddPatientForm: false,
            showSymbolForms: false,
            firestore: firebase.firestore(),
            patients: [],
            symbolText: ""
        }
    },
    mounted() {
        this.getPatients();
    },
    methods: {
        addPatient: function() {
            this.showAddPatientForm = true;
        },
        savePatient: function() {
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.email, this.password)
                    .then((registeredUser) => {
                        this.firestore.collection("patient")
                            .add({
                                uid: registeredUser.user.uid,
                                name: this.nome
                            })
                        alert('Successfully registered! Please login.');
                    
                        this.cleanForm();

                        this.showAddPatientForm = false;

                        this.getPatients();
                    })
                    .catch(error => {
                        alert(error.message);
                    });
        },
        getPatients: function() {
            this.firestore.collection("patient").get().then((patients) => {
                let patientsList = [];
                patients.docs.forEach(patient => {
                    let patientInformations = patient.data();
                    console.log(patientInformations);
                    patientsList.push(patientInformations);
                });
                console.log(patientsList);
                this.patients = patientsList;
            })
        },
        cleanForm: function() {
            this.name = "";
            this.password = "";
            this.email = "";
        },
        addSymbol: function(patient) {
            console.log(patient);
            this.showSymbolForms = true;
            
        },
        previewFiles: function(event) {
            this.updloadValue = 0;
            this.picture = null;
            this.imageData = event.target.files[0];
        },
        saveSymbol: function() {
            this.picture = null;
            const storageRef = firebase.storage().ref(`${this.imageData.name}`).put(this.imageData);
            storageRef.on(`state_changed`, 
                snapshot => {
                    this.updloadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                }, 
                error =>{console.log(error.message)},
                ()=>{
                    this.uploadValue=100;
                    storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                        this.picture = url;
                    });    
                }
            );
        }
    }
}
</script>
