<template>
  <div class="sidebar-scroll-container">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        :router="false"
        mode="vertical"
        @transitionend.native="handleTransitionEnd"
      >
        <el-menu-item class="menu-collapse" @click.native="toggleCollapse">
          <Item :icon="collapseIcon" />
        </el-menu-item>
        <ElMenuChild
          v-for="route in menuRoutePermissions"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ElMenuChild from './ElMenuChild'
import Item from './Item'
import path from 'path'
import { isExternal } from '@/utils/validate'
import variables from '@/styles/variables.scss'

export default {
  name: 'Sidebar',
  components: {
    ElMenuChild,
    Item,
  },
  data() {
    return {
      arrowShow: false,
    }
  },
  computed: {
    ...mapGetters(['menuRoutePermissions', 'sidebar']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    // showLogo() {
    //   return this.$store.state.settings.sidebarLogo
    // },
    variables() {
      return variables
    },
    isCollapse() {
      return this.sidebar.isCollapse
    },
    collapseIcon() {
      return this.sidebar.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'
    },
  },
  methods: {
    toggleCollapse() {
      this.$store.dispatch('app/toggleSideBarCollpase')
    },
    handleTransitionEnd() {
      this.$emit('collapseTransitionEnd', this.isCollapse)
    },
    showSubMenuOrItem(item) {
      if (item.alwaysShow) {
        return true
      }

      if (item.children) {
        if (item.children.length === 0) {
          return true
        } else {
          const childrenShow = item.children.filter((e) => !e.hidden)
          if (childrenShow.length === 0) {
            return true
          } else if (childrenShow.length === 1) {
            if (childrenShow[0].children) {
              return true
            } else {
              return childrenShow[0]
            }
          } else {
            return true
          }
        }
      } else {
        return false
      }
    },
    resolvePath(routePath, basePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(basePath)) {
        return basePath
      }
      return path.resolve(basePath || '', routePath || '')
    },
  },
}
</script>
