import { constantRoutes, concatAsyncRoutes } from '@/router'
import { generateMenuRoutes, generateAddRoutes } from '@/utils/route'
import { SET_MENU_ROUTES } from '../mutation-types'

const state = {
  menuRoutes: [],
  addMenuRoutes: [],
}

const mutations = {
  [SET_MENU_ROUTES]: (state, routes) => {
    state.addMenuRoutes = routes
    state.menuRoutes = constantRoutes.concat(routes)
  },
}

const actions = {
  generateRoutes({ commit }, routes) {
    return new Promise((resolve) => {
      const addMenuRoutes = concatAsyncRoutes(generateMenuRoutes(routes))
      commit(SET_MENU_ROUTES, addMenuRoutes)
      resolve(generateAddRoutes(addMenuRoutes))
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
