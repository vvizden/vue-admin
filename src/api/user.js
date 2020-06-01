import $http from './index'

export function login(data) {
  return $http.post('/sys/login', data)
}

export function logout() {
  return $http.post('/sys/logout')
}

export function getPermissions(params) {
  return $http.get('/sys/permission/getUserPermissionByToken', params)
}
