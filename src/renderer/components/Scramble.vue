<template>
    <div class="scramble-container">
        <div class="scramble-text-container">
            <p class="scramble-text">{{ scramble }}</p>
        </div>
        <div class="scramble-form">
        <button class="scramble-button form-part" @click="genScramble()">スクランブル</button>
        <select class="type-option form-part" name="" v-model="type" v-on:change="genScramble()">
            <option value="222">2x2x2</option>
            <option value="333">3x3x3</option>
        </select>
        </div>
    </div>
</template>

<script>
import { scrambler as s222 } from './Scramble/lib/jsss/scramble_222'
import { scrambler as s333 } from './Scramble/lib/jsss/scramble_333'

const scramblers = {
  222: s222,
  333: s333
}

export default {
  name: 'scramble',
  data () {
    return {
      scramble: '',
      scrambles: [],
      scramblers: scramblers,
      type: '333'
    }
  },
  components: {},
  created () {
    this.genScramble()
  },
  methods: {
    genScramble () {
      this.scrambles.push(this.scramble)
      const newScramble = this.scramblers[this.type].getRandomScramble().scramble_string
      this.scramble = newScramble
    },
    getScramble () {
      return this.scramble
    },
    typeChanged () {
      this.scrambles = []
      this.getScramble()
    },
    getScrambles () {
      return this.scrambles
    }
  }
}
</script>

<style lang="sass" scoped>
.scramble-form
    display: flex
    justify-content: center
    margin-top: 10px

.scramble-text-container
    display: flex
    justify-content: center

.scramble-container
    display: flex
    justify-content: center
    flex-direction: column

.scramble-text
    font-size: 2rem
    font-family: Kosugi
    margin-left: 5rem
    margin-right: 5rem

.form-part
    margin: 5px
    padding: 10px 20px
    border-radius: 5px
    border: 2px solid #27426d

.scramble-button
    background-color: rgb(93, 170, 206)
    color: #FFF
    
</style>


