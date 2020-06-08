export const userUrl = {
  page: '/sys/user/list',
  create: '/sys/user/add',
  edit: '/sys/user/edit',
  delete: '/sys/user/delete',
  deleteBatch: '/sys/user/deleteBatch',
  exportXls: '/sys/user/exportXls',
  userRoleIds: '/sys/user/queryUserRole',
  userDepts: '/sys/user/userDepartList',
  login: '/sys/login',
  logout: '/sys/logout',
  permissions: '/sys/permission/getUserPermissionByToken',
}

export const roleUrl = {
  page: '/sys/role/list',
  list: '/sys/role/queryall',
  create: '/sys/role/add',
  edit: '/sys/role/edit',
  delete: '/sys/role/delete',
}

export const deptUrl = {
  deptTree: '/sys/sysDepart/queryIdTree',
}

export const systemUrl = {
  duplicationCheck: '/sys/duplicate/check',
}
