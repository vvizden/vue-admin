export const userUrl = {
  page: '/sys/user/list',
  create: '/sys/user/add',
  edit: '/sys/user/edit',
  userRoleIds: '/sys/user/queryUserRole',
  userDepts: '/sys/user/userDepartList',
  login: '/sys/login',
  logout: '/sys/logout',
  permissions: '/sys/permission/getUserPermissionByToken',
}

export const roleUrl = {
  page: '/sys/role/list',
  list: '/sys/role/queryall',
}

export const deptUrl = {
  deptTree: '/sys/sysDepart/queryIdTree',
}

export const systemUrl = {
  duplicationCheck: '/sys/duplicate/check',
}
