<template>
  <el-container class="tab-container is-vertical">
    <!-- <viewTag /> -->
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
    // ViewTag: () => import(/* webpackChunkName: "layout" */ './ViewTag'),
  },
}
</script>
