import AutoSelect from './AutoSelect'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Object.assign(AutoSelect, options)
  Vue.component(AutoSelect.name, AutoSelect)
}

AutoSelect.install = install

export default AutoSelect
