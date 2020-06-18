import SvgIcon from './SvgIcon'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Object.assign(SvgIcon, options)
  Vue.component(SvgIcon.name, SvgIcon)
}

SvgIcon.install = install

export default SvgIcon
