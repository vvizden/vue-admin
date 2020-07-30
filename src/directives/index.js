import ElDialogDrag from './el-dialog-drag'
import Permission from './permission'
import TableColsCache from './table-cols-cache'

const VERSION = '0.1.0'

// eslint-disable-next-line no-unused-vars
function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Vue.use(ElDialogDrag)
  Vue.use(Permission)
  Vue.use(TableColsCache)
}

export default {
  VERSION,
  install,
  ElDialogDrag,
  Permission,
  TableColsCache,
}
