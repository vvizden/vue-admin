const getters = {
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  realname: (state) => state.user.realname,
  menuPermissions: (state) => state.user.menuPermissions,
  permission_routes: (state) => state.permission.routes,
}
export default getters
