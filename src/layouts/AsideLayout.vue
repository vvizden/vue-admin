<template>
  <BaseContainer>
    <el-container class="aside-container" :class="asideContainerClass">
      <Aside @collapseTransitionEnd="handleCollapseTransitionEnd" />
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
  data() {
    return {
      menuCollapseTransitionEnd: false,
      menuOpenTransitionEnd: false,
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    asideContainerClass() {
      return {
        'menu--collapse': this.sidebar.isCollapse,
        // 'menu--collapse-transition-end': this.menuCollapseTransitionEnd,
        'menu--open-transition-end': this.menuOpenTransitionEnd,
      }
    },
  },
  watch: {
    'sidebar.isCollapse': function(val) {
      if (val) {
        this.menuOpenTransitionEnd = false
      } else {
        this.menuCollapseTransitionEnd = false
      }
    },
  },
  methods: {
    handleCollapseTransitionEnd(isCollapse) {
      if (isCollapse) {
        this.menuCollapseTransitionEnd = true
      } else {
        this.menuOpenTransitionEnd = true
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
