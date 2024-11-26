import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import { presetUno } from 'unocss'
import { presetDaisy } from 'unocss-preset-daisy'
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), unocss({
    presets: [presetUno(), presetDaisy()],
  }),],
  server: {
    port: 5173,
    host: true,
  },
  // build:{
  //   rollupOptions:{
  //     external: ['pinia']
  //   }
  // }
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
})