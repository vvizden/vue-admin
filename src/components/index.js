import Copyright from './copyright'
import AutoRadio from './auto-radio'
import AutoSelect from './auto-select'
import SvgIcon from './svg-icon'
import Chart from './chart'
import ElementUIExt from './element-ui-ext'

const VERSION = '0.1.0'

// eslint-disable-next-line no-unused-vars
function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Vue.use(Copyright)
  Vue.use(AutoRadio)
  Vue.use(AutoSelect)
  Vue.use(SvgIcon)
  Vue.use(Chart)
  Vue.use(ElementUIExt)
}

export default {
  VERSION,
  install,
  Copyright,
  AutoRadio,
  AutoSelect,
  SvgIcon,
  Chart,
  ElementUIExt,
}
