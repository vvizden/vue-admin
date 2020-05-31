<template>
  <el-aside class="layout-aside" width="200px">
    <Sidebar class="sidebar-container" />
  </el-aside>
</template>

<script>
export default {
  name: 'Aside',
  components: {
    Sidebar: () => import(/* webpackChunkName: "layout" */ './Sidebar'),
  },
}
</script>

<style lang="scss" scoped>
.layout-aside {
  margin: 0;
  height: 100%;
  overflow: hidden;
}
</style>
