<template>
  <div id="app">
    <div class="left-menu" @click="updateHash()">
      <router-link to="/" class="left-menu-item"><font-awesome-icon icon="home" style="font-size: 3rem"></font-awesome-icon><span>HOME</span></router-link>
      <router-link to="/timer" class="left-menu-item"><font-awesome-icon icon="stopwatch" style="font-size: 3.5rem"></font-awesome-icon><span>TIMER</span></router-link>
    </div>
    <div class="main-panel">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'c2timer_vue',
    data () {
      return {
        hash: window.location.hash
      }
    },
    methods: {
      updateHash: function () {
        this.hash = window.location.hash
      }
    },
    watch: {
      hash: function (newHash, oldHash) {
        console.log(newHash)
      }
    }
  }
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Mali:200,200italic,300,300italic,regular,italic,500,500italic,600,600italic,700,700italic);
@import url(https://fonts.googleapis.com/css?family=Kosugi:regular);

:root {
  --main-border-color: rgb(167, 167, 167);
  --warning-color: #e46060;
  --correct-color: #79d079;
  --muted-color: var(--main-border-color);
  --sub-text-color: rgb(85, 85, 85);
}

body {
    margin: 0;
    padding: 0;
}
#app{
  display: flex;
}
.left-menu{
  /* float: left; */
  /* position: fixed; */
  background-color: rgb(238, 248, 253);
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 150px;
  padding-top: 30px;
  position: fixed;
}

.left-menu-item{
  padding: 10px 20px;
  color: rgb(93, 170, 206);
  text-decoration: none;
  display: flex;
  align-items: flex-end;
}
.left-menu-item:hover{
  background-color: rgb(208, 222, 230);
}

.main-panel{
  min-height: 100vh;
  width: 100vw;
  margin-left: 150px;
}

</style>

