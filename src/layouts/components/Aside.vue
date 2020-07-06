<template>
  <el-aside class="sidebar-container" :width="variables.sideBarWidth">
    <div
      class="menu-collapse"
      :style="{ color: variables.primaryColor }"
      @click="toggleCollapse"
    >
      <Item :icon="collapseIcon" />
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <RouterMenu />
    </el-scrollbar>
  </el-aside>
</template>

<script>
import { mapGetters } from 'vuex'
import variables from '@/styles/variables.scss'

export default {
  name: 'Aside',
  components: {
    RouterMenu: () => import(/* webpackChunkName: "layout" */ './RouterMenu'),
    Item: () => import(/* webpackChunkName: "layout" */ './RouterMenu/Item'),
  },
  data() {
    return {
      variables,
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    isCollapse() {
      return this.sidebar.isCollapse
    },
    collapseIcon() {
      return this.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'
    },
  },
  methods: {
    toggleCollapse() {
      this.$store.dispatch('app/toggleSideBarCollpase')
    },
  },
}
</script>
