import AutoRadio from './AutoRadio'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Object.assign(AutoRadio, options)
  Vue.component(AutoRadio.name, AutoRadio)
}

AutoRadio.install = install

export default AutoRadio
