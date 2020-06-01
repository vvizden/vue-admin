import Table from './Table'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Object.assign(Table, options)
  Vue.component(Table.name, Table)
}

Table.install = install

export default Table
