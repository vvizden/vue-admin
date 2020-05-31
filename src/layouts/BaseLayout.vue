<template>
  <el-container class="base-layout is-vertical">
    <Header />
    <router-view></router-view>
  </el-container>
</template>

<script>
export default {
  name: 'BaseLayout',
  components: {
    Header: () =>
      import(/* webpackChunkName: "layout" */ './components/Header'),
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.base-layout {
  height: 100%;
  overflow: hidden;
}
</style>
