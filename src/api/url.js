// 用户 api url
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

// 角色 api url
export const roleUrl = {
  page: '/sys/role/list',
  list: '/sys/role/queryall',
  treeList: '/sys/role/queryTreeList',
  create: '/sys/role/add',
  edit: '/sys/role/edit',
  delete: '/sys/role/delete',
}

// 组织机构 api url
export const deptUrl = {
  deptTree: '/sys/sysDepart/queryIdTree',
}

// 系统 api url
export const systemUrl = {
  duplicationCheck: '/sys/duplicate/check',
}

// 权限 api url
export const permissionUrl = {
  list: '/sys/permission/list',
  treeList: '/sys/permission/queryTreeList',
  permissionList: '/sys/permission/queryRolePermission',
  create: '/sys/permission/add',
  saveRolePermission: '/sys/permission/saveRolePermission',
  edit: '/sys/permission/edit',
  delete: '/sys/permission/delete',
  deleteBatch: '/sys/permission/deleteBatch',
}

// 数据字典 api url
export const dictUrl = {
  listByCode: '/sys/dict/getDictItems',
  list: '/sys/dict/list',
  create: '/sys/dict/add',
  edit: '/sys/dict/edit',
  delete: '/sys/dict/delete',
  exportXls: '/sys/dict/exportXls',
}

// 数据字典 api url
export const dictItemUrl = {
  list: '/sys/dictItem/list',
  refreshCache: 'sys/dict/refleshCache',
  create: '/sys/dictItem/add',
  edit: '/sys/dictItem/edit',
  delete: '/sys/dictItem/delete',
  deleteBatch: '/sys/dictItem/deleteBatch',
}

// 组织机构 api url
export const departUrl = {
  treeList: '/sys/sysDepart/queryTreeList',
  simpleTreeList: '/sys/sysDepart/queryIdTree',
  create: '/sys/sysDepart/add',
  edit: '/sys/sysDepart/edit',
  delete: '/sys/sysDepart/delete',
  deleteBatch: '/sys/sysDepart/deleteBatch',
  exportXls: '/sys/sysDepart/exportXls',
}
