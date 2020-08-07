import IconPane from './IconPane'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Object.assign(IconPane, options)
  Vue.component(IconPane.name, IconPane)
}

IconPane.install = install

export default IconPane
