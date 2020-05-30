import Vue from 'vue'
import Storage from 'vue-ls'

import 'normalize.css'

import ElementUI from 'element-ui'
import './styles/element-variables.scss'
// global css
import '@/styles/index.scss'
// global components
import GlobalComponents from '@/components'

import App from './App.vue'
import router from './router'
import store from './store'

import './permission'

Vue.use(Storage, {
  // key prefix
  namespace: 'vuejs__',
  // name variable Vue.[ls] or this.[$ls],
  name: 'ls',
  // storage name session, local, memory
  storage: 'local',
})

Vue.use(ElementUI, {
  // set element-ui default size
  size: 'medium',
})

Vue.use(GlobalComponents)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
