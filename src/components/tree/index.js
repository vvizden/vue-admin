import Tree from './Tree'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Object.assign(Tree, options)
  Vue.component(Tree.name, Tree)
}

Tree.install = install

export default Tree
