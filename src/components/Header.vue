<!--
 * @Date: 2023-12-20
 * @LastEditTime:2024-11-26 15:10:23
 * @LastEditors:xkloveme
 * @FileDesc:new page
 * @FilePath:/black-tool/src/components/Header.vue
 * @Copyright © xkloveme
-->
<template>
  <header class="header-container">
    <nav class="nav-wrapper">
      <div class="logo">
        <img src="../assets/logo.png" alt="Logo" />
        <span class="site-title">小康黑科技</span>
      </div>
      
      <div class="flex items-center">
        <div :class="['nav-links', {'nav-links-mobile': isMenuOpen}]">
          <router-link 
            v-for="item in menu" 
            :key="item.url" 
            :to="item.url"
            :class="{ active: route.path === item.url }"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
        </div>
        <ThemeChanger class="ml-4" />
        <button class="menu-btn md:hidden" @click="isMenuOpen = !isMenuOpen">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header-container {
  background-color: var(--header-bg);
  box-shadow: var(--header-shadow);
  padding: 0.5rem 1rem;
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--border-color);
}

.nav-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo img {
  height: 32px;
  width: auto;
}

.site-title {
  font-size: 1.25rem;
  color: var(--text-primary);
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  position: relative;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-links a:hover {
  color: var(--primary);
}

.nav-links a.active {
  color: var(--primary);
  background: var(--primary-light);
  font-weight: 500;
}

.nav-links a.active::after {
  width: 80%;
}

.menu-btn {
  display: none;
  color: var(--text-primary);
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  margin-left: 0.5rem;
}

@media (max-width: 768px) {
  .menu-btn {
    display: block;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--header-bg);
    padding: 0.5rem;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    box-shadow: var(--header-shadow);
  }

  .nav-links-mobile {
    display: flex;
  }

  .nav-links a {
    width: 100%;
    text-align: center;
    padding: 0.75rem 1rem;
  }
}
</style>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import ThemeChanger from './ThemeChanger.vue'
const route = useRoute();
const isMenuOpen = ref(false);

let menu = [{
  name: "二维码",
  url: "/qrcode"
}, {
  name: "表格",
  url: "/table"
}, {
  name: "jsfuck",
  url: "/jsfuck"
  },{
    name: "devtools",
    url: "/devtools"
  },
  {
    name: "ipv6",
    url: "/ipv6"
  },
  {
    name: "player",
    url: "/player"
  }
  ];
</script>
