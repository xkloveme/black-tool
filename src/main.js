import Vue from 'vue'
import  './assets/reset.css'
import App from './App.vue'
import Vxxx from 'vue-v-xxx'
import 'vue-v-xxx/lib/vue-v-xxx.css'
Vue.config.productionTip = false
Vue.use(Vxxx)
new Vue({
  render: h => h(App),
}).$mount('#app')
