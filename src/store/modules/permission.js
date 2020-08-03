import { constantRoutes, concatAsyncRoutes } from '@/router'
import {
  generateMenuRoutes,
  generateAddRoutes,
  addLeadingSlashCharacter,
} from '@/utils/route'
import { SET_USER_ADD_MENU_ROUTES, SET_MENU_ROUTES } from '../mutation-types'

const state = {
  menuRoutes: [...constantRoutes],
  addMenuRoutes: [],
}

const mutations = {
  [SET_USER_ADD_MENU_ROUTES]: (state, routes) => {
    state.addMenuRoutes = routes
  },
  [SET_MENU_ROUTES]: (state, routes) => {
    state.menuRoutes = routes
  },
}

const actions = {
  generateRoutes({ commit }, routes) {
    return new Promise((resolve) => {
      const userAddMenuRoutes = addLeadingSlashCharacter(
        generateMenuRoutes(routes),
      )
      commit(SET_USER_ADD_MENU_ROUTES, userAddMenuRoutes)
      const addMenuRoutes = concatAsyncRoutes(userAddMenuRoutes)
      commit(SET_MENU_ROUTES, constantRoutes.concat(addMenuRoutes))
      resolve(addLeadingSlashCharacter(generateAddRoutes(addMenuRoutes)))
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
