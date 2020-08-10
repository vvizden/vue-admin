import { login, logout, getPermissions } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Storage, { USER_INFO_KEY, DICT_KEY } from '@/utils/storage'
import { resetRouter } from '@/router'
import { SET_TOKEN, SET_INFO, SET_PERSSIONS, SET_DICT } from '../mutation-types'

const state = {
  token: getToken(),
  info: Storage.get(USER_INFO_KEY, {}),
  permissions: {},
}

const mutations = {
  [SET_TOKEN]: (state, token) => {
    state.token = token
    setToken(state.token)
  },
  [SET_INFO]: (state, info) => {
    state.info = info
    Storage.set(USER_INFO_KEY, state.info)
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
          console.log('vuex action user/login error: response result is null')
          return Promise.reject({
            message: '缺失数据：result',
          })
        }
        commit(SET_TOKEN, result.token)
        commit(SET_INFO, result.userInfo)
        commit(`app/${SET_DICT}`, result.sysAllDictItems, { root: true })

        return result
      },
    )
  },

  // user logout
  logout({ commit, dispatch, state }) {
    return logout(state.token).then(() => {
      commit(SET_TOKEN, '')
      commit(SET_INFO, {})
      commit(`app/${SET_DICT}`, {}, { root: true })
      dispatch(`view/delAllViews`, {}, { root: true })
      commit(SET_PERSSIONS, {})
      removeToken()
      Storage.remove(USER_INFO_KEY)
      Storage.remove(DICT_KEY)
      resetRouter()
    })
  },

  // get permissions
  getPermissions({ commit, state }) {
    return getPermissions({ token: state.token }).then((res) => {
      const { result } = res

      if (!result) {
        console.log(
          'vuex action user/getPermissions error: response result is null',
        )
        return Promise.reject({
          message: '缺失数据：result',
        })
      }

      const { menu } = result

      if (!menu || menu.length <= 0) {
        console.warn('vuex action user/getPermissions: menu is a null array!')
      }

      commit(SET_PERSSIONS, result || {})
      return result
    })
  },

  // remove token
  resetToken({ commit, dispatch }) {
    return new Promise((resolve) => {
      commit(SET_TOKEN, '')
      commit(SET_INFO, {})
      commit(`app/${SET_DICT}`, {}, { root: true })
      dispatch(`view/delAllViews`, {}, { root: true })
      commit(SET_PERSSIONS, {})
      removeToken()
      Storage.remove(USER_INFO_KEY)
      Storage.remove(DICT_KEY)
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
