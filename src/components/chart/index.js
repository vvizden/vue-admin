import Chart from './Chart'
import loadCharts from './chart-list'

function install(Vue, options = {}) {
  if (install.installed) {
    return
  }

  install.installed = true // install components

  Object.assign(Chart, options)
  Vue.component(Chart.name, Chart)

  loadCharts()
}

Chart.install = install

export default Chart
