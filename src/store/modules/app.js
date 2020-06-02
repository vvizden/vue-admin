import Storage, {
  SIDEBAR_COLLAPSE_KEY,
  ELEMENT_UI_SIZE_KEY,
} from '@/utils/storage'
import { TOGGLE_SIDEBAR_COLLAPSE, SET_ELEMENT_UI_SIZE } from '../mutation-types'

const state = {
  sidebar: {
    isCollapse: Storage.get(SIDEBAR_COLLAPSE_KEY, false),
  },
  elementUISize: Storage.get(ELEMENT_UI_SIZE_KEY, 'small'),
}

const mutations = {
  [TOGGLE_SIDEBAR_COLLAPSE]: (state) => {
    state.sidebar.isCollapse = !state.sidebar.isCollapse
    Storage.set(SIDEBAR_COLLAPSE_KEY, state.sidebar.isCollapse)
  },
  [SET_ELEMENT_UI_SIZE]: (state, size) => {
    state.elementUISize = size
    Storage.set(ELEMENT_UI_SIZE_KEY, state.elementUISize)
  },
}

const actions = {
  toggleSideBarCollpase({ commit }) {
    commit(TOGGLE_SIDEBAR_COLLAPSE)
  },
  setElementUISize({ commit }, size) {
    commit(SET_ELEMENT_UI_SIZE, size)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
