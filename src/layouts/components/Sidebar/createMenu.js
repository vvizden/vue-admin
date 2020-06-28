import Item from './Item'

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

export default function createSubMenu(h, item, basePath) {
  const path = this.resolvePath(item.path, basePath)
  return (
    <el-submenu key={path} index={path}>
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

export function createElMenuItem(h, item, basePath) {
  const path = this.resolvePath(item.path, basePath)
  return (
    <el-menu-item key={path} index={path} route={item}>
      <Item
        icon={item.meta && item.meta.icon}
        title={item.meta && item.meta.title}
      />
    </el-menu-item>
  )
}
