<template>
  <BaseContainer>
    <el-container class="aside-container" :class="asideContainerClass">
      <Aside />
      <TabContainer>
        <MainView />
      </TabContainer>
    </el-container>
  </BaseContainer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AsideLayout',
  components: {
    BaseContainer: () =>
      import(/* webpackChunkName: "layout" */ './components/BaseContainer'),
    Aside: () => import(/* webpackChunkName: "layout" */ './components/Aside'),
    TabContainer: () =>
      import(/* webpackChunkName: "layout" */ './components/TabContainer'),
    MainView: () => import(/* webpackChunkName: "layout" */ './views/MainView'),
  },
  computed: {
    ...mapGetters(['sidebar']),
    asideContainerClass() {
      return {
        hideSidebar: this.sidebar.isCollapse,
        openSidebar: !this.sidebar.isCollapse,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.aside-container {
  overflow: hidden;
}
</style>
