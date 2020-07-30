import { validURL } from '@/utils/validate'

export function generateMenuRoutes(data) {
  const routes = []
  for (let item of data) {
    const URL = (item.meta.url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) =>
      eval(s2),
    ) // URL支持{{ window.xxx }}占位符变量
    if (validURL(URL)) {
      item.meta.url = URL
    }

    let componentPath = item.component
    if (componentPath && componentPath.trim()) {
      if (componentPath.indexOf('layouts/') === -1) {
        if (componentPath.indexOf('views/') === -1) {
          componentPath = `views/${componentPath}`
        }
      } else {
        if (componentPath.indexOf('layouts/RouteView') !== -1) {
          componentPath = 'layouts/AsideLayout'
        }
      }
    } else {
      componentPath = ''
    }

    const routeName = ['layouts/', 'IframeView'].some(
      (e) => componentPath.indexOf(e) !== -1,
    )
      ? item.name
      : componentPath.match(/(?<=views\/.*)[^/]+(?=\/index|$)/i)[0]

    let menu = {
      path: item.path,
      name: routeName,
      redirect: item.redirect,
      component: componentPath && (() => import(`@/${componentPath}.vue`)),
      hidden: item.hidden,
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        url: item.meta.url,
        noCache: !item.meta.keepAlive,
        externalLink: item.meta.internalOrExternal,
      },
    }

    if (item.children && item.children.length > 0) {
      menu.children = generateMenuRoutes(item.children)
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

export function generateAddRoutes(data) {
  const routes = []
  for (let item of data) {
    let copyItem = { ...item }
    let url = copyItem.meta && copyItem.meta.url
    let externalLink = copyItem.meta && copyItem.meta.externalLink
    if (!url || !externalLink) {
      if (copyItem.children && copyItem.children.length > 0) {
        copyItem.children = generateAddRoutes(copyItem.children)
      }
      routes.push(copyItem)
    }
  }
  return routes
}

export function addLeadingSlashCharacter(data) {
  return data.map((e) => {
    if (e && e.path && e.path.trim() && !e.path.startsWith('/')) {
      e.path = `/${e.path}`
    }
    return e
  })
}
