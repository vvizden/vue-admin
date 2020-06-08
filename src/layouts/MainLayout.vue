<template>
  <BaseContainer>
    <TabContainer>
      <MainView />
    </TabContainer>
  </BaseContainer>
</template>

<script>
export default {
  name: 'MainLayout',
  components: {
    BaseContainer: () =>
      import(/* webpackChunkName: "layout" */ './components/BaseContainer'),
    TabContainer: () =>
      import(/* webpackChunkName: "layout" */ './components/TabContainer'),
    MainView: () => import(/* webpackChunkName: "layout" */ './views/MainView'),
  },
}
</script>
