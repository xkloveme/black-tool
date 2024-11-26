<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
      <svg v-if="currentTheme === 'dark'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
      </svg>
      <svg v-else-if="currentTheme === 'light'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
      </svg>
      <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v12H4V4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clip-rule="evenodd"></path>
      </svg>
    </div>
    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-200 rounded-box w-52">
      <li class="menu-title pt-2 pb-2 text-base-content/60 text-sm font-medium">选择主题</li>
      <div class="divider my-0"></div>
      <li v-for="theme in themes" :key="theme.id">
        <button 
          class="flex items-center gap-2 w-full px-4 py-2 hover:bg-base-300 rounded-lg transition-colors"
          :class="{ 'bg-primary text-primary-content': currentTheme === theme.id }"
          @click="changeTheme(theme.id)"
        >
          <span class="theme-color" :style="{ backgroundColor: theme.color }"></span>
          {{ theme.name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const themes = [
  { id: 'light', name: '明亮模式', color: '#ffffff' },
  { id: 'dark', name: '暗黑模式', color: '#1a1b1e' },
  { id: 'cupcake', name: '清新主题', color: '#faf7f5' },
  { id: 'emerald', name: '翠绿主题', color: '#059669' }
]

const currentTheme = ref('light')

const changeTheme = (theme) => {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  changeTheme(savedTheme)
})
</script>

<style scoped>
.theme-color {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid var(--base-content);
}

.dropdown-content {
  min-width: 200px;
}

.menu-title {
  opacity: 0.7;
}

button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateX(2px);
}

button.active {
  background-color: var(--primary);
  color: var(--primary-content);
}
</style> 