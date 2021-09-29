<template>
    <div>
        <h2>Bem-vindo, Paciente!</h2>
        <div class="icons">
            <img class="img-size" src="../assets/nao.png" />
            <img class="img-size" src="../assets/sim.png" />
        </div>
        <section class="cards">
            <div class="cards-content" v-if="symbols && symbols.length > 0">
                <template v-for="(symbol, i) in symbols" :key="symbol.imageUrl" >
                    <vue-swing :config="config"
                        @throwout="popCard(i)" 
                        @throwoutright="sayText(symbol.symbolText)"
                        ref="vueswing" 
                    >
                        <div class="cards__card" :style="{ zIndex:symbols.length-i }">
                            <img :src="symbol.imageUrl"/>
                            <h3>{{symbol.symbolText}}</h3>
                        </div>
                    </vue-swing>
                </template>
            </div>
        </section>
    </div>
</template>

<script>
import VueSwing from 'vue-swing';

import webgazer from 'webgazer';

import firebase from "firebase/app";
import 'firebase/firestore';

export default {
    name: "dashboard-paciente",
    components: {
        VueSwing
    },
    data() {
        return {
            symbols: [],
            firestore: firebase.firestore(),
            config: {
                allowedDirections: [VueSwing.Direction.LEFT, VueSwing.Direction.RIGHT],
                isThrowOut: function(xOffset, yOffset, element, throwOutConfidence) {
                return throwOutConfidence > 0.5;
                },
                minThrowOutDistance: 100,
                maxThrowOutDistance: 120,
                maxRotation: 50,
            },
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
        });

        const viewer = {
            width: 240,
            height: 180
        };

        webgazer.params.showVideoPreview = true;
        webgazer.params.videoViewerWidth = viewer.width;
        webgazer.params.videoViewerHeight = viewer.height;

        webgazer.begin();

        let self = this;

        setInterval(async function() {
            var prediction = await webgazer.getCurrentPrediction();

            console.log(prediction);

            if (prediction) {
                var x = prediction.x;

                if (x > window.screen.width/2) {

                    self.sayText(self.symbols[0].symbolText);
                    self.popCard(0);
                    // fala
                }
                else {
                    self.popCard(0);
                }
            }           
        }, 5000)

    },
    methods: {
        popCard(index) {
            let temp = JSON.stringify(this.symbols[index]);
            this.symbols.splice(index, 1);
            this.symbols.push(JSON.parse(temp));
        },
        sayText(text) {
            const speaks = [
                {
                    name: "Clarinha",
                    lang: "pt-BR"
                }
            ];
            const msg = new SpeechSynthesisUtterance();

            msg.volume = 1; //define o volume do áudio (de 0 a 1)
            msg.rate = 1; // define a velocidade do áudio (0.1 a 1)
            msg.pitch = 1; // define o tom em que o áudio é falado (de 0 a 2)
            msg.text = text; //Pega o valor do input e passa para o objeto sintetizar

            const voice = speaks[0]; //pegamos o objeto que queremos que seja a nossa fala. [0], pois nosso array speaks só possui uma posição, que é a que queremos (Clarinha pt-BR)
            voice.voiceURI = voice.name; //voiceURI busca o servidor da voz escolhida, no caso, pt-BR defnido em voice.name
            msg.lang = voice.lang;

            speechSynthesis.speak(msg);
        }
    }
}
</script>

<style>
.cards-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: -10vw;
}

.cards {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.cards__card {
    width: 10%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 32px;
    box-shadow: 0 6px 15px rgba(255, 255, 255, 0.08);
    position: absolute;
    z-index: 1;
}
 
.cards__card img {
    width: 100%;
    height: 15rem;
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
}
 
.cards__card h3 {
    width: 100%;
    height: 3.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2em;
    color:#000000
}

.icons {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.img-size {
    height: 200px;
    width: 200px;
}
</style>