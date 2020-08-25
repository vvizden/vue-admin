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

      if (navigator.clipboard) {
        navigator.clipboard.writeText(iconClass).then(() => {
          this.$message.success(`${iconClass} 已复制到剪贴板`)
        })
      } else {
        const input = document.createElement('input')
        document.body.appendChild(input)
        input.value = iconClass
        input.focus()
        input.select()

        const result = document.execCommand('copy')
        if (result === 'unsuccessful') {
          console.error('Failed to copy text.')
        } else {
          this.$message.success(`${iconClass} 已复制到剪贴板`)
        }

        document.body.removeChild(input)
      }
    },
  },
}
</script>
