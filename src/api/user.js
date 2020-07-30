import $http from './index'
import { userUrl, permissionUrl } from './url'

export function login(data) {
  return $http.post(userUrl.login, data)
}

export function logout() {
  return $http.post(userUrl.logout)
}

export function getPermissions(params) {
  return $http.get(permissionUrl.permissions, params)
}
