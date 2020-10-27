<template>
  <div class="scroll-wrapper">
    <el-scrollbar class="scroll-container">
      <div class="scroll-inner" :style="contentStyle">
        <slot></slot>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { NAME_PREFIX } from '../../const/common'

export default {
  name: `${NAME_PREFIX}ScrollContainer`,
  props: {
    contentStyle: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style lang="scss">
.scroll-wrapper {
  height: 100%;
  overflow: hidden;

  .scroll-container {
    height: 100%;

    .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    .scroll-inner {
      padding-right: 0px;
    }
  }
}
</style>
