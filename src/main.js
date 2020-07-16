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

import GlobalDirectives from './directives' // global filters
import * as filters from './filters' // global filters

import './icons' // icon
import './permission' // permission

import App from './App.vue'
import router from './router'
import store from './store'

import $http from '@/api'

Vue.use(ElementUI, {
  // set element-ui default size
  size: Storage.get(ELEMENT_UI_SIZE_KEY, 'mini'),
})

Vue.use(GlobalComponents)
Vue.use(GlobalDirectives)

// http请求
Vue.prototype.$http = $http

// register global filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
