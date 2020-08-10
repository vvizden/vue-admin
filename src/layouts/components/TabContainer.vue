<template>
  <el-container class="tab-container is-vertical">
    <RouterViewTag />
    <slot></slot>
    <!-- <Footer /> -->
  </el-container>
</template>

<script>
export default {
  name: 'TabContainer',
  components: {
    // Footer: () =>
    //   import(/* webpackChunkName: "layout" */ './components/Footer'),
    RouterViewTag: () =>
      import(/* webpackChunkName: "layout" */ './RouterViewTag'),
  },
}
</script>
