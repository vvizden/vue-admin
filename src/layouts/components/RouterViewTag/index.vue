<template>
  <ViewTag
    v-model="selectViewTag"
    :data="visitedViews"
    :dataProps="dataProps"
    @close="handleViewTagClose"
  />
</template>

<script>
export default {
  name: 'RouterViewTag',
  components: {
    ViewTag: () => import(/* webpackChunkName: "layout" */ './ViewTag'),
  },
  data() {
    return {
      dataProps: {
        key: 'path',
      },
      selectViewTag: this.$route.path,
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.view.visitedViews
    },
  },
  watch: {
    $route(val) {
      this.addViewTag(val)
    },
  },
  mounted() {},
  methods: {
    handleViewTagClose(key) {
      this.tagData = this.tagData.filter((e) => {
        return e.key != key
      })
      this.$store.dispatch('view/delView', this.$route)
    },
    addViewTag(view) {
      if (view.name) {
        this.$store.dispatch('view/addView', view)
      }
    },
  },
}
</script>
