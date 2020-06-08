<template>
  <el-container class="base-container is-vertical">
    <Header />
    <slot></slot>
  </el-container>
</template>

<script>
export default {
  name: 'BaseView',
  components: {
    Header: () => import(/* webpackChunkName: "layout" */ './Header'),
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.base-container {
  height: 100%;
  overflow: hidden;
}
</style>
