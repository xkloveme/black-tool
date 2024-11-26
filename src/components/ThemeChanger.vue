<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
      <svg v-if="currentTheme === 'dark'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
      </svg>
      <svg v-else-if="currentTheme === 'light'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
      </svg>
      <svg v-else-if="currentTheme === 'corporate'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"></path>
      </svg>
      <svg v-else-if="currentTheme === 'bumblebee'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 3.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM3.5 10a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zm5.5 0a1 1 0 100 2h2a1 1 0 100-2H9zm-.75-3.5a1 1 0 100 2h3.5a1 1 0 100-2h-3.5z"></path>
      </svg>
      <svg v-else-if="currentTheme === 'cupcake'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
      </svg>
      <svg v-else-if="currentTheme === 'emerald'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clip-rule="evenodd"></path>
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
  { id: 'corporate', name: '商务模式', color: '#f8fafc' },
  { id: 'bumblebee', name: '蜜蜂模式', color: '#fef9c3' },
  { id: 'cupcake', name: '清新模式', color: '#faf7f5' },
  { id: 'emerald', name: '翠绿模式', color: '#059669' }
]

const currentTheme = ref('light')

const changeTheme = (theme) => {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

// 检测系统主题
const detectSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

// 监听系统主题变化
const watchSystemTheme = () => {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const newTheme = e.matches ? 'dark' : 'light'
    // 只有当前是明亮或暗黑模式时才自动切换
    if (currentTheme.value === 'light' || currentTheme.value === 'dark') {
      changeTheme(newTheme)
    }
  })
}

onMounted(() => {
  // 优先使用保存的主题，如果没有则使用系统主题
  const savedTheme = localStorage.getItem('theme')
  const initialTheme = savedTheme || detectSystemTheme()
  changeTheme(initialTheme)
  watchSystemTheme()
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