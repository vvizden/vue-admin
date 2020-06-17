import ScrollContainer from './ScrollContainer'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Object.assign(ScrollContainer, options)
  Vue.component(ScrollContainer.name, ScrollContainer)
}

ScrollContainer.install = install

export default ScrollContainer
