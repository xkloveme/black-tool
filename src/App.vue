<template>
  <div id="app">
    <Header/>
    <!-- <h2 style="color: aquamarine;margin: 10px 0;">浙里办跳转</h2>
    <Qrcode/>
    <h2 style="color: aquamarine;margin: 10px 0;">表格转化</h2>
    <Change></Change> -->
    <router-view></router-view>
    <Footer/>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
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
.footer {
  text-align: center;
  display:flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 5px;
  left: 5px;
  right: 5px;
}
</style>
