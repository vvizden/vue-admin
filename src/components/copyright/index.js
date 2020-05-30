import Copyright from './Copyright'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Object.assign(Copyright, options)
  Vue.component(Copyright.name, Copyright)
}

Copyright.install = install

export default Copyright
