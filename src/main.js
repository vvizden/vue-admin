import Vue from 'vue'
// storage
import Storage, { ELEMENT_UI_SIZE_KEY } from '@/utils/storage'

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

Vue.use(ElementUI, {
  // set element-ui default size
  size: Storage.get(ELEMENT_UI_SIZE_KEY, 'medium'),
})

Vue.use(GlobalComponents)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
