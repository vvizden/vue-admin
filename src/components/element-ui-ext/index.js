import Table from './table'
import Pagination from './pagination'
import Tree from './tree'
import ScrollContainer from './scroll-container'

const VERSION = '0.1.0'

// eslint-disable-next-line no-unused-vars
function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Vue.use(Table)
  Vue.use(Pagination)
  Vue.use(Tree)
  Vue.use(ScrollContainer)
}

export default { VERSION, install, Table, Pagination, Tree, ScrollContainer }
