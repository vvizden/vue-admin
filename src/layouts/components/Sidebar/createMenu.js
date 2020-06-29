import Item from './Item'
import { isExternal } from '@/utils/validate'

export function createMenu(h, item, basePath) {
  if (item.hidden) return null

  const showSunMenu = this.showSubMenuOrItem(item, basePath)

  if (typeof showSunMenu == 'object') {
    return createElMenuItem.call(this, h, showSunMenu, basePath)
  } else {
    if (showSunMenu) {
      return createSubMenu.call(this, h, item, basePath)
    } else {
      return createElMenuItem.call(this, h, item, basePath)
    }
  }
}

// eslint-disable-next-line
export default function createSubMenu(h, item, basePath) {
  // const path = this.resolvePath(item.path, basePath)
  const { route } = this.$router.resolve(item.path)

  return (
    <el-submenu key={route.path} index={route.path}>
      <template slot="title">
        <Item
          icon={item.meta && item.meta.icon}
          title={item.meta && item.meta.title}
        />
      </template>
      {item.children && item.children.map((e) => createMenu.call(this, h, e))}
    </el-submenu>
  )
}

// eslint-disable-next-line
export function createElMenuItem(h, item, basePath) {
  // const path = this.resolvePath(item.path, basePath)
  const path = item.path
  const { route } = this.$router.resolve(path)

  const external = isExternal(path)

  const scopedSlots = {
    // eslint-disable-next-line
    default: ({ href, route, navigate, isActive, isExactActive }) => (
      <a
        {...{
          class: ['menu-link'],
          attrs: {
            href: external ? path : href,
            target: external ? '_blank' : '_self',
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
    ),
  }

  return (
    <el-menu-item
      key={route.redirectedFrom || route.path}
      index={route.redirectedFrom || route.path}
    >
      <router-link to={path} scopedSlots={scopedSlots}></router-link>
    </el-menu-item>
  )
}
