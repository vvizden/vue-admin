import Drag from './drag'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Object.assign(Drag, options)
  Vue.directive('el-dialog-drag', Drag)
}

Drag.install = install

export default Drag
