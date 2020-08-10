import {
  ADD_VISITED_VIEW,
  ADD_CACHED_VIEW,
  DEL_VISITED_VIEW,
  DEL_CACHED_VIEW,
  DEL_OTHERS_VISITED_VIEWS,
  DEL_OTHERS_CACHED_VIEWS,
  DEL_ALL_VISITED_VIEWS,
  DEL_ALL_CACHED_VIEWS,
  UPDATE_VISITED_VIEW,
} from '../mutation-types'

const state = {
  visitedViews: [],
  cachedViewNames: [],
}

const getters = {
  visitedViewsIndexMap: (state) => {
    return state.visitedViews.reduce((map, e, index) => {
      if (e.name && !Object.prototype.hasOwnProperty.call(map, e.name)) {
        map[e.name] = index
      }
      return map
    }, {})
  },
}

const mutations = {
  [ADD_VISITED_VIEW]: (state, view) => {
    state.visitedViews.push(view)
  },

  [UPDATE_VISITED_VIEW]: (state, { index, view }) => {
    let oldView = state.visitedViews[index]
    state.visitedViews.splice(index, 1, {
      ...oldView,
      ...view,
    })
  },

  [ADD_CACHED_VIEW]: (state, name) => {
    state.cachedViewNames.push(name)
  },

  [DEL_VISITED_VIEW]: (state, index) => {
    state.visitedViews.splice(index, 1)
  },

  [DEL_CACHED_VIEW]: (state, index) => {
    state.cachedViewNames.splice(index, 1)
  },

  [DEL_OTHERS_VISITED_VIEWS]: (state, name) => {
    state.visitedViews = state.visitedViews.filter((e) => {
      return e.name === name
    })
  },

  [DEL_OTHERS_CACHED_VIEWS]: (state, name) => {
    const index = state.cachedViewNames.indexOf(name)

    if (index > -1) {
      state.cachedViewNames = state.cachedViewNames.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedViewNames = []
    }
  },

  [DEL_ALL_VISITED_VIEWS]: (state) => {
    state.visitedViews = []
  },

  [DEL_ALL_CACHED_VIEWS]: (state) => {
    state.cachedViewNames = []
  },
}

const actions = {
  addView({ dispatch }, route) {
    dispatch('addVisitedView', route)
    dispatch('addCachedView', route)
  },

  addVisitedView({ state, getters, commit, dispatch }, route) {
    if (getters.visitedViewsIndexMap[route.name] == null) {
      let affix

      if (state.visitedViews.length === 0) {
        affix = true
      } else {
        let lastedView = state.visitedViews[state.visitedViews.length - 1]
        if (lastedView.affix) {
          dispatch('updateVisitedView', { name: lastedView.name, affix: false })
        }
        affix = false
      }

      commit(ADD_VISITED_VIEW, {
        title: route.meta.title,
        affix: affix,
        ...route,
      })
    }
  },

  updateVisitedView({ getters, commit }, route) {
    let index = getters.visitedViewsIndexMap[route.name]
    if (index != null) {
      commit(UPDATE_VISITED_VIEW, {
        index,
        view: route,
      })
    }
  },

  addCachedView({ state, commit }, route) {
    if (!route.meta.componentName) return
    if (state.cachedViewNames.includes(route.meta.componentName)) return
    if (route.meta.keepAlive) {
      commit(ADD_CACHED_VIEW, route.meta.componentName)
    }
  },

  delView({ dispatch, state }, route) {
    return new Promise((resolve) => {
      dispatch('delVisitedView', route.name)
      dispatch('delCachedView', route.meta.componentName)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViewNames: [...state.cachedViewNames],
      })
    })
  },

  delVisitedView({ dispatch, commit, state, getters }, name) {
    return new Promise((resolve) => {
      let index = getters.visitedViewsIndexMap[name]
      if (index != null) {
        commit(DEL_VISITED_VIEW, index)
      }
      if (state.visitedViews.length === 1) {
        dispatch('updateVisitedView', {
          name: state.visitedViews[0].name,
          affix: true,
        })
      }
      resolve([...state.visitedViews])
    })
  },

  delCachedView({ commit, state }, componentName) {
    return new Promise((resolve) => {
      let index = state.cachedViewNames.indexOf(componentName)
      if (index !== -1) {
        commit(DEL_CACHED_VIEW, index)
      }
      resolve([...state.cachedViewNames])
    })
  },

  delOthersViews({ dispatch, state }, route) {
    return new Promise((resolve) => {
      dispatch('delOthersVisitedViews', route.name)
      dispatch('delOthersCachedViewNames', route.meta.componentName)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViewNames: [...state.cachedViewNames],
      })
    })
  },

  delOthersVisitedViews({ dispatch, commit, state, getters }, name) {
    return new Promise((resolve) => {
      if (getters.visitedViewsIndexMap[name] != null) {
        commit(DEL_OTHERS_VISITED_VIEWS, name)
        dispatch('updateVisitedView', {
          name: name,
          affix: true,
        })
      }
      resolve([...state.visitedViews])
    })
  },

  delOthersCachedViewNames({ commit, state }, componentName) {
    return new Promise((resolve) => {
      commit(DEL_OTHERS_CACHED_VIEWS, componentName)
      resolve([...state.cachedViewNames])
    })
  },

  delAllViews({ dispatch }) {
    return new Promise((resolve) => {
      dispatch('delAllVisitedViews')
      dispatch('delAllCachedViewNames')
      resolve()
    })
  },

  delAllVisitedViews({ commit }) {
    commit(DEL_ALL_VISITED_VIEWS)
  },

  delAllCachedViewNames({ commit }) {
    commit(DEL_ALL_CACHED_VIEWS)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
