import IconTitle from './IconTitle'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Object.assign(IconTitle, options)
  Vue.component(IconTitle.name, IconTitle)
}

IconTitle.install = install

export default IconTitle
