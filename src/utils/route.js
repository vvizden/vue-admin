import { validURL } from '@/utils/validate'

export function generateMenuRoutes(data) {
  const routes = []
  for (let item of data) {
    let path = item.path
    if (path == null) {
      continue
    }
    path = path.trim()

    const URL = (item.meta.url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) =>
      eval(s2),
    ) // URL支持{{ window.xxx }}占位符变量
    if (validURL(URL)) {
      item.meta.url = URL
    }

    let componentPath = item.component ? item.component.trim() : ''
    if (componentPath && componentPath.trim()) {
      if (componentPath.startsWith('layouts/')) {
        if (componentPath.indexOf('layouts/RouteView') !== -1) {
          componentPath = 'layouts/AsideLayout'
        }
      } else {
        if (!componentPath.startsWith('views/')) {
          componentPath = `views/${componentPath}`
        }
      }
    } else {
      componentPath = ''
    }

    let componentName = ''
    if (componentPath.startsWith('views/')) {
      componentName = componentPath.match(
        /(?<=views\/.*)[^/]+(?=\/index|$)/i,
      )[0]
    }

    let menu = {
      path: path,
      name: item.name,
      component: componentPath ? () => import(`@/${componentPath}.vue`) : null,
      redirect: item.redirect,
      meta: {
        hidden: item.hidden,
        alwaysShow: !!item.alwaysShow,
        componentName: componentName,
        title: item.meta.title,
        icon: item.meta.icon,
        url: item.meta.url,
        keepAlive: item.meta.keepAlive,
        externalLink: item.meta.internalOrExternal,
        notRouteMenu: !!item.route && item.route === '0',
      },
    }

    if (item.children && item.children.length > 0) {
      menu.children = generateMenuRoutes(item.children)
    }

    routes.push(menu)
  }
  return routes
}

export function generateAddRoutes(data) {
  let routes = []
  for (let item of data) {
    let copyItem = { ...item }
    let { meta, children } = copyItem
    let notRouteMenu = meta && meta.notRouteMenu
    if (notRouteMenu) {
      if (children && children.length > 0) {
        routes = routes.concat(generateAddRoutes(children))
      }

      continue
    }

    let url = meta && meta.url
    let externalLink = meta && meta.externalLink
    if (!url || !externalLink) {
      if (children && children.length > 0) {
        copyItem.children = generateAddRoutes(children)
      }
      routes.push(copyItem)
    }
  }
  return routes
}

export function addLeadingSlashCharacter(data) {
  return data.map((e) => {
    if (!e.path.startsWith('/') && e.path !== '*') {
      e.path = `/${e.path}`
    }
    return e
  })
}
