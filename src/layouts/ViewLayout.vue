<template>
  <BaseContainer>
    <MainView />
  </BaseContainer>
</template>

<script>
export default {
  name: 'ViewLayout',
  components: {
    BaseContainer: () =>
      import(/* webpackChunkName: "layout" */ './components/BaseContainer'),
    MainView: () => import(/* webpackChunkName: "layout" */ './views/MainView'),
  },
}
</script>
