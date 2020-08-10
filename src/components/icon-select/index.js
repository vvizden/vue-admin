import IconSelect from './IconSelect'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Object.assign(IconSelect, options)
  Vue.component(IconSelect.name, IconSelect)
}

IconSelect.install = install

export default IconSelect
