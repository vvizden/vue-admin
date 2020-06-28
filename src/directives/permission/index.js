import Permission from './permission'

function install(Vue) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Vue.directive('permission', Permission)
}

Permission.install = install

export default Permission
