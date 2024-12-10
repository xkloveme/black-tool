import { createRouter, createWebHashHistory } from 'vue-router'
import Qrcode from '../components/Qrcode.vue'
import Change from '../components/ChangeData.vue'
import Devtools from '../components/Devtools.vue'
import Jsfuck from '../components/Jsfuck.vue'
import Player from '../views/player/index.vue'
import Ipv6 from '../views/ipv6/index.vue'
import Github from '../views/github/index.vue'
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
    {
      path: '/player',
      name: 'player',
      component: Player,
    },
    {
      path: '/ipv6',
      name: 'ipv6',
      component: Ipv6,
    },
    {
      path: '/github',
      name: 'github',
      component: Github,
    },
  ],
})