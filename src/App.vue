<template>
  <div id="app" class="min-h-screen flex flex-col">
    <Header/>
    <main class="flex-grow p-4">
      <router-view></router-view>
    </main>
    <Footer/>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
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
