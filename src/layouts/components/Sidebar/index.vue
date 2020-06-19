<template>
  <div class="sidebar-container">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <el-menu-item class="menu-collapse" @click.native="toggleCollapse">
          <item :icon="collapseIcon" />
        </el-menu-item>
        <sidebar-item
          v-for="route in permission_routes"
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
// import Logo from './Logo'
import Item from './Item'
import variables from '@/styles/variables.scss'

export default {
  components: {
    SidebarItem: () => import(/* webpackChunkName: "layout" */ './SidebarItem'),
    Item,
    // Logo
  },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
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
  },
}
</script>

<style lang="scss" scoped>
.menu-collapse {
  height: 32px;
  line-height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent !important;
  border-bottom: 1px solid #dfe6ec;
  color: #606266 !important;

  ::v-deep {
    .sub-el-icon {
      width: auto;
      margin-right: 0 !important;
    }
  }
}
</style>
