<template>
  <div class="app-container">
    <v-icon-pane @click="handleIconPaneClick" />
  </div>
</template>

<script>
export default {
  name: 'IconList',
  data() {
    return {
      selectIcon: {},
    }
  },
  methods: {
    handleIconPaneClick(type, iconClass) {
      this.selectIcon = {
        type,
        iconClass,
      }

      navigator.clipboard.writeText(iconClass).then(() => {
        this.$message.success(`${iconClass} 已复制到剪贴板`)
      })
    },
  },
}
</script>
