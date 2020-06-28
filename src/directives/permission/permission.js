import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const userPermissions = store.state.user.permissions.auth
    ? store.state.user.permissions.auth
    : []

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const hasPermission = userPermissions.some((item) => {
        return value.includes(item.action)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(
      `need permissions! Like v-permission="['user:add','user:edit']"`,
    )
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  },
}
