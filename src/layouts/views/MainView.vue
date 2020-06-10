<template>
  <el-main>
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="$route.path"></router-view>
      </keep-alive>
    </transition>
  </el-main>
</template>

<script>
export default {
  name: 'MainView',
  computed: {
    cachedViews() {
      return this.$store.state.view.cachedViews
    },
  },
}
</script>
