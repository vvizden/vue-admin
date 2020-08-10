import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'

export function createMenuChild(item, basePath) {
  if (item.meta.hidden) return null

  const showSunMenu = showSubMenuOrItem(item, basePath)

  if (typeof showSunMenu == 'object') {
    if (showSunMenu.meta && !showSunMenu.meta.icon) {
      showSunMenu.meta.icon = item.meta ? item.meta.icon : void 0
    }
    return createElMenuItem.call(
      this,
      showSunMenu,
      resolvePath(item.path, basePath),
    )
  } else {
    if (showSunMenu) {
      return createElSubMenu.call(this, item, basePath)
    } else {
      return createElMenuItem.call(this, item, basePath)
    }
  }
}

function createElSubMenu(item, basePath) {
  // eslint-disable-next-line
  const h = this.$createElement

  const path = resolvePath(item.path, basePath)

  return (
    <el-submenu key={path} index={path}>
      <template slot="title">
        <Item
          icon={item.meta && item.meta.icon}
          title={item.meta && item.meta.title}
        />
      </template>
      {item.children &&
        item.children.map((e) => createMenuChild.call(this, e, path))}
    </el-submenu>
  )
}

function createElMenuItem(item, basePath) {
  // eslint-disable-next-line
  const h = this.$createElement

  const path = resolvePath(item.path, basePath)
  const externalLink = item.meta.externalLink

  const scopedSlots = {
    // eslint-disable-next-line
    default: ({ href, route, navigate, isActive, isExactActive }) => {
      return (
        <a
          {...{
            class: ['menu-link'],
            attrs: {
              href: externalLink ? item.meta.url : href,
              target: externalLink ? '_blank' : '_self',
            },
            on: {
              click: navigate,
            },
          }}
        >
          <Item
            icon={item.meta && item.meta.icon}
            title={item.meta && item.meta.title}
          />
        </a>
      )
    },
  }

  return (
    <el-menu-item key={path} index={path}>
      <router-link to={path} scopedSlots={scopedSlots}></router-link>
    </el-menu-item>
  )
}

// 返回 true，说明item是subMenu, 返回 false 或 object 说明是替换父级展示的菜单
function showSubMenuOrItem(item) {
  if (item.meta.alwaysShow) {
    return true
  }

  if (item.children) {
    if (item.children.length === 0) {
      return true
    } else {
      const childrenShown = item.children.filter((e) => !e.meta.hidden)
      if (childrenShown.length === 0) {
        return true
      } else if (childrenShown.length === 1) {
        if (childrenShown[0].children) {
          return true
        } else {
          return childrenShown[0]
        }
      } else {
        return true
      }
    }
  } else {
    return false
  }
}

function resolvePath(routePath = '', basePath = '') {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(basePath)) {
    return basePath
  }
  return path.resolve(basePath || '', routePath || '')
}
