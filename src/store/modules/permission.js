import { constantRoutes } from '@/router'
import {
  generateMenuRoutes,
  generateAddRoutes,
  addLeadingSlashCharacter,
} from '@/utils/route'
import { SET_MENU_ROUTES } from '../mutation-types'

const state = {
  menuRoutes: [...constantRoutes],
}

const mutations = {
  [SET_MENU_ROUTES]: (state, routes) => {
    state.menuRoutes = routes
  },
}

const actions = {
  generateRoutes({ commit }, routes) {
    return new Promise((resolve) => {
      const userAddMenuRoutes = generateMenuRoutes(routes)
      commit(SET_MENU_ROUTES, constantRoutes.concat(userAddMenuRoutes))
      resolve(addLeadingSlashCharacter(generateAddRoutes(userAddMenuRoutes)))
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
