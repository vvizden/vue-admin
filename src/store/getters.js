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
  permission_menu_routes: (state) => state.permission.menuRoutes,
}
export default getters
