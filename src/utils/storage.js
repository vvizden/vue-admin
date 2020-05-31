import Vue from 'vue'
import Storage from 'vue-ls'

// key namespace
const NAMESPACE = 'vuejs__'

// token key
const TOKEN_KEY = 'Access-Token'

Vue.use(Storage, {
  // key prefix
  namespace: NAMESPACE,
  // name variable Vue.[ls] or this.[$ls],
  name: 'ls',
  // storage name session, local, memory
  storage: 'local',
})

function get(...params) {
  const [key, ...others] = params
  if (Vue.ls) {
    return Vue.ls.get(key, ...others)
  }
  const value = localStorage.getItem(`${NAMESPACE}${key}`)
  const defaultValue = others[0]
  return value == null ? (defaultValue == null ? null : defaultValue) : value
}

function set(...params) {
  const [key, ...others] = params
  if (Vue.ls) {
    return Vue.ls.set(key, ...others)
  }
  return localStorage.setItem(`${NAMESPACE}${key}`, ...others)
}

function remove(key) {
  if (Vue.ls) {
    return Vue.ls.remove(key)
  }
  return localStorage.removeItem(`${NAMESPACE}${key}`)
}

function clear() {
  if (Vue.ls) {
    return Vue.ls.clear()
  }
  return localStorage.clear()
}

export function getToken() {
  return get(TOKEN_KEY)
}

export function setToken(value) {
  return set(TOKEN_KEY, value)
}

export function removeToken() {
  return remove(TOKEN_KEY)
}

export default {
  get,
  set,
  remove,
  clear,
}
