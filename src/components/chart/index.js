import Chart from './Chart'
import loadModules from './modules'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Object.assign(Chart, options)
  Vue.component(Chart.name, Chart)

  loadModules()
}

Chart.install = install

export default Chart
