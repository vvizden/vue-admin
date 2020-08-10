<template>
  <el-main>
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViewNames">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </el-main>
</template>

<script>
export default {
  name: 'MainView',
  computed: {
    cachedViewNames() {
      return this.$store.state.view.cachedViewNames
    },
  },
}
</script>
