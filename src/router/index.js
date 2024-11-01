import { createRouter, createWebHashHistory } from 'vue-router'
import Qrcode from '../components/Qrcode.vue'
import Change from '../components/ChangeData.vue'
import Devtools from '../components/Devtools.vue'
import Jsfuck from '../components/Jsfuck.vue'

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
      path: '/jsfuck',
      name: 'jsfuck',
      component: Jsfuck,
    },
    {
      path: '/table',
      name: 'table',
      component: Change,
    },
    {
      path: '/devtools',
      name: 'devtools',
      component: Devtools,
    },
  ],
})