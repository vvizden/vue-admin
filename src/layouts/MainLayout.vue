<template>
  <el-container class="main-layout is-vertical">
    <ViewLayout />
    <Footer />
  </el-container>
</template>

<script>
export default {
  name: 'MainLayout',
  components: {
    Footer: () =>
      import(/* webpackChunkName: "layout" */ './components/Footer'),
    ViewLayout: () => import(/* webpackChunkName: "layout" */ './ViewLayout'),
  },
}
</script>
