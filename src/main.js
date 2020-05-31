import Vue from 'vue'
// storage
import Storage from '@/utils/storage'

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
  size: Storage.get('element_ui_size', 'medium'),
})

Vue.use(GlobalComponents)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
