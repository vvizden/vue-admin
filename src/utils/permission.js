import store from '@/store'

export function checkPermission(permissions = []) {
  const value = permissions
  const userPermissions = store.getters.userPermissions

  if (value && value instanceof Array) {
    if (value.length > 0) {
      return userPermissions.some((permission) => {
        return value.includes(permission)
      })
    }
    return false
  } else {
    throw new Error(`need permissions! Like ['user:add','user:edit']`)
  }
}
