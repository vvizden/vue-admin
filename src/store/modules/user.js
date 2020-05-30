import { login, logout, getPermissions } from '@/api/user'
import { setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import {
  SET_TOKEN,
  SET_INFO,
  SET_NAME,
  SET_AVATAR,
  SET_MUNU_PERSSIONS,
  SET_BUTTON_PERSSIONS,
} from '../mutation-types'

const state = {
  token: '',
  info: {},
  username: '',
  realname: '',
  avatar: '',
  menuPermissions: [],
  buttonPermissions: [],
}

const mutations = {
  [SET_TOKEN]: (state, token) => {
    state.token = token
  },
  [SET_INFO]: (state, info) => {
    state.info = info
  },
  [SET_NAME]: (state, { username, realname }) => {
    state.username = username
    state.realname = realname
  },
  [SET_AVATAR]: (state, avatar) => {
    state.avatar = avatar
  },
  [SET_MUNU_PERSSIONS]: (state, menuPermissions) => {
    state.menuPermissions = menuPermissions
  },
  [SET_BUTTON_PERSSIONS]: (state, buttonPermissions) => {
    state.buttonPermissions = buttonPermissions
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return login({ username: username.trim(), password: password }).then(
      (data) => {
        const { result } = data
        if (!result) {
          return Promise.reject('vuex action user/login: request error')
        }
        const userInfo = result.userInfo
        commit(SET_TOKEN, result.token)
        commit(SET_INFO, userInfo)
        commit(SET_NAME, userInfo)
        commit(SET_AVATAR, userInfo.avatar)
        setToken(result.token)

        return result
      },
    )
  },

  // user logout
  logout({ commit, state }) {
    return logout(state.token).then(() => {
      commit(SET_TOKEN, '')
      commit(SET_MUNU_PERSSIONS, [])
      commit(SET_BUTTON_PERSSIONS, [])
      removeToken()
      resetRouter()
    })
  },

  // get permissions
  getPermissions({ commit, state }) {
    return getPermissions({ token: state.token }).then((data) => {
      const { result } = data

      if (!result) {
        return Promise.reject('vuex action user/getPermissions: request error')
      }

      const { menu, auth } = result

      if (!menu || menu.length <= 0) {
        return Promise.reject(
          'vuex action user/getPermissions: menu must be a non-null array!',
        )
      }

      commit(SET_MUNU_PERSSIONS, menu)
      commit(SET_BUTTON_PERSSIONS, auth)
      return result
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit(SET_TOKEN, '')
      removeToken()
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
