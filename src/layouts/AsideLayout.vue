<template>
  <el-container class="aside-layout">
    <Aside />
    <el-container class="is-vertical">
      <el-main>
        <!-- <router-view></router-view> -->
      </el-main>
      <Footer />
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'AsideLayout',
  components: {
    Aside: () => import(/* webpackChunkName: "layout" */ './components/Aside'),
    Footer: () =>
      import(/* webpackChunkName: "layout" */ './components/Footer'),
  },
}
</script>

<style lang="scss" scoped>
.aside-layout {
  overflow: hidden;
}
</style>
