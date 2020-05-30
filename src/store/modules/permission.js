import { constantRoutes, concatAsyncRoutes } from '@/router'
import { SET_ROUTES } from '../mutation-types'

const state = {
  routes: [],
  addRoutes: [],
}

const mutations = {
  [SET_ROUTES]: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
}

const actions = {
  generateRoutes({ commit }, routes) {
    return new Promise((resolve) => {
      const accessedRoutes = concatAsyncRoutes(routes)
      commit(SET_ROUTES, accessedRoutes)
      resolve(accessedRoutes)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
