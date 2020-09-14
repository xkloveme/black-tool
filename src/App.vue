<template>
  <div id="app">
    <h1 style="text-align: center;">黑科技表格转化</h1>
    <Change></Change>
  </div>
</template>

<script>
import Change from './components/ChangeData.vue'

export default {
  name: 'App',
  components: {
    Change,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  background-color: #2c3e50;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
</style>
