<template>
  <el-aside class="sidebar-container" :width="variables.sideBarWidth">
    <Sidebar @collapseTransitionEnd="$emit('collapseTransitionEnd', $event)" />
  </el-aside>
</template>

<script>
import variables from '@/styles/variables.scss'

export default {
  name: 'Aside',
  data() {
    return {
      variables,
    }
  },
  components: {
    Sidebar: () => import(/* webpackChunkName: "layout" */ './Sidebar'),
  },
}
</script>
