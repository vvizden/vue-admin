// 用户 api url
export const userUrl = {
  page: '/sys/user/list',
  create: '/sys/user/add',
  edit: '/sys/user/edit',
  updatePassword: '/sys/user/updatePassword',
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
  deptTree: '/sysdepart/sysDepart/queryIdTree',
  treeList: '/sysdepart/sysDepart/queryTreeList',
  simpleTreeList: '/sysdepart/sysDepart/queryIdTree',
  create: '/sysdepart/sysDepart/add',
  edit: '/sysdepart/sysDepart/edit',
  delete: '/sysdepart/sysDepart/delete',
  deleteBatch: '/sysdepart/sysDepart/deleteBatch',
  exportXls: '/sysdepart/sysDepart/exportXls',
}

// 系统 api url
export const systemUrl = {
  duplicationCheck: '/sys/duplicate/check',
  encryptedString: '/sys/getEncryptedString',
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
  page: '/sys/dict/list',
  listAll: 'sys/dict/queryAllDictItems',
  refreshCache: 'sys/dict/refleshCache',
  create: '/sys/dict/add',
  edit: '/sys/dict/edit',
  delete: '/sys/dict/delete',
  exportXls: '/sys/dict/exportXls',
}

// 数据字典 api url
export const dictItemUrl = {
  page: '/sys/dictItem/list',
  create: '/sys/dictItem/add',
  edit: '/sys/dictItem/edit',
  delete: '/sys/dictItem/delete',
  deleteBatch: '/sys/dictItem/deleteBatch',
}
