import $http from './index'
import { systemUrl } from './url'

export function duplicationCheck(params) {
  return $http
    .get(systemUrl.duplicationCheck, params)
    .then(() => {
      return true
    })
    .catch(() => {
      return false
    })
}
