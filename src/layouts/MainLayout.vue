<template>
  <BaseContainer>
    <MainView />
  </BaseContainer>
</template>

<script>
export default {
  name: 'MainLayout',
  components: {
    BaseContainer: () =>
      import(/* webpackChunkName: "layout" */ './components/BaseContainer'),
    MainView: () => import(/* webpackChunkName: "layout" */ './views/MainView'),
  },
}
</script>
