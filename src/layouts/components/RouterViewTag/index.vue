<template>
  <ViewTag
    v-model="selectViewTag"
    :data="visitedViews"
    :dataProps="dataProps"
    @change="handleViewTagChange"
    @close="handleViewTagClose"
    @closeAll="handleViewTagCloseAll"
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
        key: 'name',
      },
      selectViewTag: '',
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
      this.selectViewTag = val.name
    },
  },
  mounted() {
    this.addViewTag(this.$route)
    this.selectViewTag = this.$route.name
  },
  methods: {
    handleViewTagChange(key, item) {
      this.$router.push(item)
    },
    handleViewTagClose(key, item) {
      this.$store.dispatch('view/delView', item).then(({ visitedViews }) => {
        if (item.name === this.selectViewTag) {
          this.toLastedView(visitedViews)
        }
      })
    },
    handleViewTagCloseAll(key, item) {
      this.$store.dispatch('view/delOthersViews', item)
    },
    addViewTag(view) {
      if (view.name) {
        this.$store.dispatch('view/addView', view)
      }
    },
    toLastedView(visitedViews) {
      let lastView = visitedViews[visitedViews.length - 1]
      if (lastView) {
        this.$router.push(lastView.fullPath)
      } else {
        const firstRoute = this.$store.getters.firstRoute
        const toPath = firstRoute ? firstRoute.path : '/403'
        this.$router.push(toPath)
      }
    },
  },
}
</script>
