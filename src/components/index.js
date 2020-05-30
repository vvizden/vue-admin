import Copyright from './copyright'

const VERSION = '1.0.0'

// eslint-disable-next-line no-unused-vars
function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Vue.use(Copyright)
}

export default { VERSION, install, Copyright }
