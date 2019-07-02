<template>
    <div class="card-body">
        <div class="time" :class="[timeObj.isDnf ? 'red' : '']">{{ timeText }}</div>
        <div v-if="timeObj.isPlus2" class="penalty">+2</div>
        <div class="scramble">{{ timeObj.scramble }}</div>
    </div>
</template>

<script>
export default {
  props: [
    'timeObj'
  ],
  computed: {
    timeText: function () {
      let time = this.timeObj.time
      let timeText = this.getTimeText(time, 3)
      if (this.timeObj.isPlus2) {
        time += 2
        timeText = this.getTimeText(time, 3)
      } else if (this.timeObj.isDnf) {
        timeText = 'DNF'
      }
      return timeText
    }
  },
  methods: {
    getTimeText: function (time, num = 3) {
      let minText = '0'
      let secText = '00'
      let decText = '000'
      let minFlag = false
      if (time > 60) {
        minText = Math.floor(time / 60).toString()
        minFlag = true
      }
      if (time > 1) {
        secText = Math.floor(time % 60).toString()
        secText = ('00' + secText).slice(-2)
      }
      if (time > 0) {
        decText = Math.floor((time % 1) * 1000).toString()
        decText = ('000' + decText).slice(-3)
        decText = decText.slice(0, num)
      }
      let returnText = ''
      if (minFlag) {
        returnText = minText + ':' + secText + '.' + decText
      } else {
        returnText = secText + '.' + decText
      }
      return returnText
    }
  }
}
</script>

<style scoped>
.card-body {
    display: flex;
    flex-direction: column;
    border: solid 2px var(--main-border-color);
    border-radius: 5px;
    padding: 5px;
}
.time{
    font-size: 3rem;
    font-family: Mali;
    color: var(--sub-text-color);
}
.scramble{
    font-family: Kosugi;
    font-size: 1rem;
    color: var(--muted-text-color);
}
.penalty{
    font-family: Kosugi;
    font-size: 2rem;
    color: var(--warning-color);
}
.red{
    color: var(--warning-color);
}
</style>
