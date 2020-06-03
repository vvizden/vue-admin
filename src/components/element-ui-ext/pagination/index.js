import Pagination from './Pagination'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Object.assign(Pagination, options)
  Vue.component(Pagination.name, Pagination)
}

Pagination.install = install

export default Pagination
