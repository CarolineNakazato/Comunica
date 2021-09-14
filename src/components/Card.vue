<template>
    <section class="cards">
        <div v-if="symbols && symbols.length > 0">
            <template v-for="(symbol, i) in symbols" :key="symbol.imageUrl" >
                <vue-swing :config="config"
                    @throwout="poop(i)" 
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
</template>

<script>
import VueSwing from 'vue-swing';

export default {
  name: 'Cards',
  props: {
    symbols: Array,
  },
  components: {
      VueSwing
  },
  data() {
    return {
      config: {
        allowedDirections: [VueSwing.Direction.LEFT, VueSwing.Direction.RIGHT],
        isThrowOut: function(xOffset, yOffset, element, throwOutConfidence) {
          return throwOutConfidence > 0.5;
        },
        minThrowOutDistance: 100,
        maxThrowOutDistance: 120,
        maxRotation: 50,
      },
    };
  },
  methods: {
    poop(card){
      this.$emit('poop',card);
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
  },
};
</script>

<style>
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
    box-shadow: 0 6px 15px rgba(36, 37, 38, 0.08);
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
}
 
</style>
