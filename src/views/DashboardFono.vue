<template>
    <div>
        <h2>Seja bem-vindo, fonoaudiólogo(a)</h2>
        <div class="add-patient-form" v-show="!showAddPatientForm && !showPatientTable">
            <a class="btn btn2" @click="addPatient">Adicionar Paciente</a>
            <a class="btn btn2" @click="showTable">Listar Pacientes</a>
        </div>
        <div class="add-patient" v-show="showAddPatientForm">
            <div class="add-patient-form">
                <div class="form__group field">
                    <input v-model="nome" type="text" class="form__field" placeholder="Nome" name="nome" id="nome" maxlength="100" required/>
                    <label for="nome" class="form__label">Nome</label>
                </div>
                <div class="form__group field">
                    <input v-model="email" type="email" class="form__field" placeholder="E-mail" name="email" id="email" maxlength="50" required/>
                    <label for="email" class="form__label">E-mail</label>
                </div>
                <div class="form__group field">
                    <input v-model="password" type="password" class="form__field" placeholder="Senha" name="password" id="password" required/>
                    <label for="password" class="form__label">Senha</label>
                </div>
            </div>
            <div class="add-patient-form">
                <a class="btn btn2" @click="savePatient">Salvar Paciente</a>
                <a class="btn btn2" @click="cancelAddPatient">Cancelar</a>
            </div>
        </div>
        

        <div v-show="showPatientTable">
            <a class="btn btn2" @click="showMenu">Voltar para o menu</a>
            <div class="patient-list-content">
                <table>
                    <thead>
                        <tr>
                            <th class="name-column">
                                Nome
                            </th>
                            <th>
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="patient in patients" :key="patient.uid">
                            <td class="name-column">
                                {{ patient.name }}
                            </td>
                            <td>
                                <a class="btn1 btn3" @click="addSymbol(patient)">Adiconar símbolo</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="add-symbol" v-if="showSymbolForms">
                    <p class="header-symbol-form">Adicionando símbolo para o paciente: {{ currentPatient.name }}</p>
                    <div class="form__group field">
                        <input v-model="symbolText" type="text" class="form__field" placeholder="Texto do símbolo" name="symbol" id="symbol" required/>
                        <label for="symbol" class="form__label">Texto do símbolo</label>
                    </div>
                    <input class="input-file" type="file" @change="previewFiles" multiple>
                    <a class="btn btn2" @click="saveSymbol">Salvar Símbolo</a>
                    <a class="btn1" @click="cancelSymbol">Cancelar</a>
                </div>
            </div>
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
            showPatientTable: false,
            showSymbolForms: false,
            firestore: firebase.firestore(),
            patients: [],
            symbolText: "",
            currentPatient: null
        }
    },
    mounted() {
        this.getPatients();
        this.picture = null;
        this.imageData = [];
    },
    methods: {
        cancelSymbol: function() {
            this.symbolText = "";
            this.showSymbolForms = false;
        },
        showMenu: function() {
            this.cancelSymbol();
            this.showPatientTable = false;
        },
        showTable: function() {
            this.showPatientTable = true;
        },
        addPatient: function() {
            this.showAddPatientForm = true;
        },
        cancelAddPatient: function() {
            this.cleanForm();
            this.showAddPatientForm = false;
        },
        savePatient: function() {
            
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.email, this.password)
                    .then((registeredUser) => {
                        const {docEmail, docPass} = this.$router.currentRoute.value.params;
                        firebase
                            .auth()
                            .signInWithEmailAndPassword(docEmail, docPass).then(() => {
                                  this.firestore.collection("patient")
                                    .add({
                                        uid: registeredUser.user.uid,
                                        name: this.nome,
                                        doctorUid: firebase.auth().currentUser.uid
                                    })
                                
                                    this.cleanForm();

                                    this.showAddPatientForm = false;

                                    this.getPatients();
                            })
                            .catch(error => {
                                alert(error.message);
                            });

                    })
                    .catch(error => {
                        alert(error.message);
                    });
        },
        getPatients: function() {
            const uid = firebase.auth().currentUser.uid;
            this.firestore.collection("patient").get().then((patients) => {
                let patientsList = [];
                patients.docs.forEach(patient => {
                    let patientInformations = patient.data();
                    patientsList.push(patientInformations);
                });
                patientsList = patientsList.filter(patient => patient.doctorUid === uid);
                this.patients = patientsList;
            })
        },
        cleanForm: function() {
            this.nome = "";
            this.password = "";
            this.email = "";
        },
        addSymbol: function(patient) {
            this.currentPatient = patient;
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
                        this.addCardToPatientCatalog(url);
                    });    
                }
            );
        },
        addCardToPatientCatalog: function(url) {
            this.firestore.collection("patientCatalog")
                            .add({
                                patientUid: this.currentPatient.uid,
                                symbolText: this.symbolText,
                                imageUrl: url
                            })
        }
    }
}
</script>

<style>
.header-symbol-form {
    font-size: larger;
    margin-top: 0px;
    margin-bottom: 0px;
}

.input-file {
    margin-top: 2vh;
}

.patient-list-content{
    display: flex;
    flex-direction: row;
    align-items: flex-start ;
}

.add-symbol {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
}

.btn{
  position: relative;
  display: block;
  color: #ffffff;
  font-size: 14px;
  font-family: "montserrat";
  text-decoration: none;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-right: 2vw;
  border: 2px solid #42b983;
  padding: 14px 0px;
  text-transform: uppercase;
  overflow: hidden;
  transition: 1s all ease;
  cursor: pointer;
  width: 20vw;
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

.btn1{
  position: relative;
  display: block;
  color: #ffffff;
  font-size: 14px;
  font-family: "montserrat";
  text-decoration: none;
  border: 2px solid #42b983;
  padding: 14px 0px;
  text-transform: uppercase;
  overflow: hidden;
  transition: 1s all ease;
  cursor: pointer;
  width: 20vw;
}

.btn1::before{
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
  width: 20vw;
  height: 0%;
}
.btn2:hover::before{
  height: 20vw;
}

.btn3::before{
  width: 20vw;
  height: 0%;
}
.btn3:hover::before{
  height: 20vw;
}

.add-patient-form {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.add-patient {
    background-color: rgb(129, 129, 129);
    padding: 10vh 10vw;
    border-radius: 10px;
    margin: 0vw 5vw;
}

.form__group {
    margin-right: 2vw;
}

.form__field {
    border-bottom: 2px solid #ffffff;
}

.form__label {
    color: #ffffff;
}

.name-column {
    width: 40vw;
}

table {
    border-collapse: collapse;
    margin-right: 2vw;
}

table td {
    padding : 1vw 2vh;
    border: 1px solid white;
}
 
table th {
    border: 1px solid white;
    background: rgb(129, 129, 129) ;
}
</style>
