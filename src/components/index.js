import Copyright from './copyright'
import AutoRadio from './auto-radio'
import AutoSelect from './auto-select'
import ScrollContainer from './scroll-container'
import Tree from './tree'
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
  Vue.use(ScrollContainer)
  Vue.use(Tree)
  Vue.use(ElementUIExt)
}

export default {
  VERSION,
  install,
  Copyright,
  AutoRadio,
  AutoSelect,
  ScrollContainer,
  Tree,
  ElementUIExt,
}
