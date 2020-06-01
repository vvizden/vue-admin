import { validURL } from '@/utils/validate'

export function generateChildRoutes(data) {
  const routes = []
  for (let item of data) {
    const URL = (item.meta.url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) =>
      eval(s2),
    ) // URL支持{{ window.xxx }}占位符变量
    if (validURL(URL)) {
      item.meta.url = URL
    }

    let componentPath = item.component
    if (componentPath.indexOf('layouts/') === -1) {
      if (componentPath.indexOf('view/') === -1) {
        componentPath = `views/${componentPath}`
      }
    } else {
      if (componentPath.indexOf('layouts/RouteView') !== -1) {
        componentPath = 'layouts/AsideLayout'
      }
    }

    let menu = {
      path: item.path,
      name: item.name,
      redirect: item.redirect,
      component: () =>
        import(/* webpackChunkName: "menu" */ `@/${componentPath}.vue`),
      hidden: item.hidden,
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        url: item.meta.url,
        noCache: !item.meta.keepAlive,
      },
    }

    if (item.children && item.children.length > 0) {
      menu.children = generateChildRoutes(item.children)
    }
    //--update-begin----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
    //判断是否生成路由
    if (!item.route || item.route !== '0') {
      routes.push(menu)
    }
    //--update-end----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
  }
  return routes
}
