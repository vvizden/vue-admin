import ElDialogDrag from './el-dialog-drag'

const VERSION = '0.1.0'

// eslint-disable-next-line no-unused-vars
function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Vue.use(ElDialogDrag)
}

export default {
  VERSION,
  install,
  ElDialogDrag,
}
