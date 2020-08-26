import { checkPermission } from '@/utils/permission'

function check(el, binding) {
  const { value } = binding
  const hasPermission = checkPermission(value)
  if (!hasPermission) {
    el.parentNode && el.parentNode.removeChild(el)
  }
}

export default {
  inserted(el, binding) {
    check(el, binding)
  },
  update(el, binding) {
    check(el, binding)
  },
}
