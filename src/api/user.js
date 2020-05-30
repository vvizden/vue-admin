import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data,
  })
}

export function getPermissions(params) {
  return request({
    url: '/sys/permission/getUserPermissionByToken',
    method: 'get',
    params,
  })
}

export function logout() {
  return request({
    url: '/sys/logout',
    method: 'post',
  })
}
