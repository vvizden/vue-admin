import TableColsCache from './table-cols-cache'

function install(Vue) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Vue.directive('table-cols-cache', TableColsCache)
}

TableColsCache.install = install

export default TableColsCache
