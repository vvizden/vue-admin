<template>
  <el-container class="aside-layout">
    <Aside />
    <MainLayout />
  </el-container>
</template>

<script>
export default {
  name: 'AsideLayout',
  components: {
    Aside: () => import(/* webpackChunkName: "layout" */ './components/Aside'),
    MainLayout: () => import(/* webpackChunkName: "layout" */ './MainLayout'),
  },
}
</script>

<style lang="scss" scoped>
.aside-layout {
  overflow: hidden;
}
</style>
