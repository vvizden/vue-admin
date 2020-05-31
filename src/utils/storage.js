import Vue from 'vue'
import Storage from 'vue-ls'

// key namespace
const NAMESPACE = 'vuejs__'

// token key
export const TOKEN_KEY = 'Access-Token'
// user info key
export const USER_INFO_KEY = 'user_info'
// sidebar collapse key
export const SIDEBAR_COLLAPSE_KEY = 'sidebar_is_collapse'
// element_ui_size key
export const ELEMENT_UI_SIZE_KEY = 'element_ui_size'

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
  let value = localStorage.getItem(`${NAMESPACE}${key}`)
  value = JSON.parse(value)
  const defaultValue = others[0]
  return value == null ? (defaultValue == null ? null : defaultValue) : value
}

function set(...params) {
  const [key, ...others] = params
  if (Vue.ls) {
    return Vue.ls.set(key, ...others)
  }
  if (others.length > 0) {
    others.splice(0, 1, JSON.stringify(others[1]))
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
