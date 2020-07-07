<template>
  <el-aside
    class="sidebar-container"
    :width="variables.sideBarWidth"
    :class="sidebarClass"
    :style="sidebarStyle"
    @transitionend.native.self="handleTransitionend"
  >
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

const calcWidthScale = (min, max) => {
  const minNum = parseInt(min, 10)
  const maxNum = parseInt(max, 10)
  return [minNum / maxNum, maxNum / minNum]
}

export default {
  name: 'Aside',
  components: {
    RouterMenu: () => import(/* webpackChunkName: "layout" */ './RouterMenu'),
    Item: () => import(/* webpackChunkName: "layout" */ './RouterMenu/Item'),
  },
  data() {
    this.computedWidthScale = calcWidthScale(
      variables.sideBarCollapseWidth,
      variables.sideBarWidth,
    )
    return {
      variables,
      menuCollapse: null,
      sidebarStyle: {},
      sidebarClass: {},
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
  watch: {
    isCollapse(val) {
      this.sidebarClass = {
        'sidebar-flip-animation': true,
      }

      this.sidebarStyle = {
        transform: val
          ? `scale(${this.computedWidthScale[1]}, 1)`
          : `scale(${this.computedWidthScale[0]}, 1)`,
      }

      this.sidebarInnerStyle = {
        transform: `scale(1, 1)`,
      }

      requestAnimationFrame(() => {
        this.sidebarStyle = {
          ...this.sidebarStyle,
          transition: 'transform 0.2s',
        }

        this.sidebarStyle = {
          ...this.sidebarStyle,
          transform: '',
        }
      })
    },
  },
  methods: {
    toggleCollapse() {
      this.$store.dispatch('app/toggleSideBarCollpase')
    },
    handleTransitionend() {
      this.sidebarClass = {}
      this.sidebarStyle = {}
    },
  },
}
</script>
