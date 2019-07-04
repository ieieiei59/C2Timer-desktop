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
      if (this.timeObj.isDnf) {
        return 'DNF'
      }
      return this.timeObj.getTimeText()
    }
  },
  methods: {
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
