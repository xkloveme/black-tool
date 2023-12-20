import { createRouter, createWebHashHistory } from 'vue-router'
import Qrcode from '../components/Qrcode.vue'
import Change from '../components/ChangeData.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/qrcode',
    },
    {
      path: '/qrcode',
      name: 'qrcode',
      component: Qrcode,
    },
    {
      path: '/table',
      name: 'table',
      component: Change,
    },
  ],
})