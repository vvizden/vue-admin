<template>
  <el-container class="tab-container is-vertical">
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
  },
}
</script>
