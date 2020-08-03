function getFirstRoute(data) {
  for (const route of data) {
    if (route.meta && !route.meta.notRouteMenu && !route.meta.hidden) {
      if (route.children && route.children.length > 0) {
        return getFirstRoute(route.children)
      }

      return route
    }
  }

  return null
}

const getters = {
  sidebar: (state) => state.app.sidebar,
  token: (state) => state.user.token,
  avatar: (state) => state.user.info.avatar,
  realname: (state) => state.user.info.realname,
  menuPermissions: (state) => state.user.permissions.menu,
  userPermissions: (state) => {
    const permissions = state.user.permissions.auth
    return permissions ? permissions.map((e) => e.action) : []
  },
  menuRoutePermissions: (state) => state.permission.menuRoutes,
  firstRoute: (state, getters) => {
    if (
      getters.menuRoutePermissions &&
      getters.menuRoutePermissions.length > 0
    ) {
      return getFirstRoute(getters.menuRoutePermissions)
    }

    return null
  },
}
export default getters
