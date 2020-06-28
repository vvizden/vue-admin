import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const userPermissions = store.getters.userPermissions

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const hasPermission = userPermissions.some((permission) => {
        return value.includes(permission)
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
