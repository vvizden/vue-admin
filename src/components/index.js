import Copyright from './copyright'

const VERSION = '1.0.0'

function install(Vue) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Vue.use(Copyright)
}

export default { VERSION, install, Copyright }
