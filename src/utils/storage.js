import Vue from 'vue'

const TokenKey = 'Access-Token'

export function getToken() {
  return Vue.ls.get(TokenKey)
}

export function setToken(...params) {
  return Vue.ls.set(TokenKey, ...params)
}

export function removeToken() {
  return Vue.ls.remove(TokenKey)
}

export default {
  get(...params) {
    Vue.ls.get(...params)
  },
  set(...params) {
    Vue.ls.set(...params)
  },
  remove(...params) {
    Vue.ls.remove(...params)
  },
}
