<template>
  <div id="app">
    <h1 style="text-align: center;font-size: 30px;">黑科技工具</h1>
    
    <h2 style="color: aquamarine;">浙里办跳转</h2>
    <Qrcode/>
    <h2 style="color: aquamarine;">表格转化</h2>
    <Change></Change>
     <footer class="footer">
      Copyright © 冀小康 2020 by
      <a href="https://github.com/xkloveme/black-tool" target="_blank"
        >xkloveme</a
      >
      <iframe
        style="margin-left: 2px; margin-bottom:-5px;"
        frameborder="0"
        scrolling="0"
        width="91px"
        height="20px"
        src="https://ghbtns.com/github-btn.html?user=xkloveme&repo=black-tool&type=star&count=true"
      >
      </iframe>
    </footer>
  </div>
</template>

<script setup>
import Qrcode from './components/Qrcode.vue'
import Change from './components/ChangeData.vue'
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
