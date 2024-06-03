<!--
 * @Date: 2023-12-20
 * @LastEditTime: 2024-06-03 10:20:38
 * @LastEditors: xkloveme
 * @FileDesc:new page
 * @FilePath: /black-tool/src/components/Header.vue
 * @Copyright © xkloveme
-->
<template>
<div class="navbar bg-black">
  <div class="navbar-start">
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </div>
      <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-black rounded-box w-52">
        <li v-for="item in menu" :key="item.url" :class="{'text-emerald active': route.path === item.url}">  <router-link :to="item.url">{{item.name}}</router-link></li>
      </ul>
    </div>
    <a class="btn btn-ghost text-xl">小康黑科技工具</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li v-for="item in menu" :key="item.url" :class="{'text-emerald active': route.path === item.url}">  <router-link :to="item.url">{{item.name}}</router-link></li>

    </ul>
  </div>
  <div class="navbar-end">
    <a class="btn">Github</a>
  </div>
</div>
</template>

<script setup >
import { onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
let menu = [{
  name: "二维码",
  url: "/qrcode"
}, {
  name: "表格",
  url: "/table"
}, {
  name: "devtools",
  url: "/devtools"
}]
onMounted(() => {});
</script>

<style scoped lang="scss"></style>
