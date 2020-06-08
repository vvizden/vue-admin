<template>
  <BaseContainer>
    <el-container class="aside-container">
      <Aside />
      <TabContainer>
        <MainView />
      </TabContainer>
    </el-container>
  </BaseContainer>
</template>

<script>
export default {
  name: 'AsideLayout',
  components: {
    BaseContainer: () =>
      import(/* webpackChunkName: "layout" */ './components/BaseContainer'),
    Aside: () => import(/* webpackChunkName: "layout" */ './components/Aside'),
    TabContainer: () =>
      import(/* webpackChunkName: "layout" */ './components/TabContainer'),
    MainView: () => import(/* webpackChunkName: "layout" */ './views/MainView'),
  },
}
</script>

<style lang="scss" scoped>
.aside-container {
  overflow: hidden;
}
</style>
