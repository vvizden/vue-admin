const getters = {
  token: (state) => state.user.token,
  avatar: (state) => state.user.info.avatar,
  realname: (state) => state.user.info.realname,
  menuPermissions: (state) => state.user.permissions.menu,
  permission_routes: (state) => state.permission.routes,
}
export default getters
