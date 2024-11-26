<template>
  <div id="app" :class="['min-h-screen flex flex-col', `theme-${currentTheme}`]">
    <Header/>
    <main class="flex-grow p-4">
      <router-view></router-view>
    </main>
    <Footer/>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const currentTheme = ref('')

onMounted(() => {
  currentTheme.value = localStorage.getItem('theme') || 'light'
  
  // 监听主题变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-theme') {
        currentTheme.value = document.documentElement.getAttribute('data-theme')
      }
    })
  })
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })
})
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
  background-color: var(--background-gray);
  width: 100%;
  min-height: 100vh;
}

.footer {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  padding: 1rem;
  margin-top: auto;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .footer {
    position: relative;
    padding: 0.5rem;
    font-size: 0.875rem;
  }
}
</style>
