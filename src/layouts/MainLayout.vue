<template>
  <el-container class="main-layout is-vertical">
    <el-main>
      <router-view></router-view>
    </el-main>
    <Footer />
  </el-container>
</template>

<script>
export default {
  name: 'MainLayout',
  components: {
    Footer: () =>
      import(/* webpackChunkName: "layout" */ './components/Footer'),
  },
}
</script>
