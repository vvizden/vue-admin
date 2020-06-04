import { login, logout, getPermissions } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Storage, { USER_INFO_KEY } from '@/utils/storage'
import { resetRouter } from '@/router'
import { SET_TOKEN, SET_INFO, SET_PERSSIONS } from '../mutation-types'

const state = {
  token: getToken(),
  info: Storage.get(USER_INFO_KEY, {}),
  permissions: {},
}

const mutations = {
  [SET_TOKEN]: (state, token) => {
    state.token = token
  },
  [SET_INFO]: (state, info) => {
    state.info = info
  },
  [SET_PERSSIONS]: (state, permissions) => {
    state.permissions = permissions
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return login({ username: username.trim(), password: password }).then(
      (res) => {
        const { result } = res

        if (!result) {
          return Promise.reject(
            'vuex action user/login error: response result is null',
          )
        }
        const userInfo = result.userInfo
        commit(SET_TOKEN, result.token)
        commit(SET_INFO, userInfo)
        setToken(result.token)
        Storage.set(USER_INFO_KEY, userInfo)

        return result
      },
    )
  },

  // user logout
  logout({ commit, state }) {
    return logout(state.token).then(() => {
      commit(SET_TOKEN, '')
      commit(SET_INFO, {})
      commit(SET_PERSSIONS, {})
      removeToken()
      Storage.remove(USER_INFO_KEY)
      resetRouter()
    })
  },

  // get permissions
  getPermissions({ commit, state }) {
    return getPermissions({ token: state.token }).then((res) => {
      const { result } = res

      if (!result) {
        return Promise.reject(
          'vuex action user/getPermissions error: response result is null',
        )
      }

      const { menu } = result

      if (!menu || menu.length <= 0) {
        return Promise.reject(
          'vuex action user/getPermissions: menu must be a non-null array!',
        )
      }

      commit(SET_PERSSIONS, result || {})
      return result
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit(SET_TOKEN, '')
      commit(SET_INFO, {})
      commit(SET_PERSSIONS, {})
      removeToken()
      Storage.remove(USER_INFO_KEY)
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
