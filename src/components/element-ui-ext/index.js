import Table from './table'
import Pagination from './pagination'

const VERSION = '0.1.0'

// eslint-disable-next-line no-unused-vars
function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Vue.use(Table)
  Vue.use(Pagination)
}

export default { VERSION, install, Table, Pagination }
