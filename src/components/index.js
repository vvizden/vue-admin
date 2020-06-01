import Copyright from './copyright'
import Table from './element-ext/table'

const VERSION = '0.1.0'

// eslint-disable-next-line no-unused-vars
function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Vue.use(Copyright)
  Vue.use(Table)
}

export default { VERSION, install, Copyright, Table }
