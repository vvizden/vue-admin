<template>
  <el-popover
    v-model="visible"
    :width="popoverWidth"
    placement="bottom-start"
    trigger="click"
    popper-class="icon-select-popover"
  >
    <el-input
      slot="reference"
      ref="referenceInput"
      :value="localValue"
      placeholder="图标"
      clearable
      @change="handleInputChange"
      @clear="handleInputClear"
    >
      <template slot="prepend" v-if="selectIcon.type != null">
        <svg-icon
          v-if="selectIcon.type === 'svg'"
          :icon-class="selectIcon.iconClass"
        ></svg-icon>
        <i
          v-else-if="selectIcon.type === 'element'"
          :class="selectIcon.iconClass"
        ></i>
      </template>
    </el-input>

    <v-scroll-container :style="popoverContainerStyle">
      <v-icon-pane small @click="handleIconPaneClick" />
    </v-scroll-container>
  </el-popover>
</template>

<script>
import { NAME_PREFIX } from '../const/common'

function getIcon(value) {
  if (!value) return {}

  let type = 'svg'
  if (value && value.startsWith('el')) {
    type = 'element'
  }

  return {
    type,
    iconClass: value,
  }
}

export default {
  name: `${NAME_PREFIX}IconSelect`,
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
    },
    paneHeight: {
      type: String,
      default: '430px',
    },
  },
  data() {
    const selectIcon = getIcon.call(this, this.value)
    return {
      popoverWidth: 150,
      visible: false,
      selectIcon: selectIcon,
    }
  },
  computed: {
    popoverContainerStyle() {
      return {
        height: this.paneHeight,
      }
    },
    localValue: {
      get() {
        return this.value != null ? this.value : this.selectIcon.iconClass
      },
      set(val) {
        this.selectIcon = getIcon.call(this, val)
        this.$emit('change', val)
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$nextTick(() => {
        const input = this.$refs.referenceInput.$el
        this.popoverWidth = input.getBoundingClientRect().width
      })
    })
  },
  methods: {
    handleIconPaneClick(type, iconClass) {
      this.localValue = iconClass
      this.visible = false
    },
    handleInputChange() {
      this.visible = !this.visible
    },
    handleInputClear() {
      this.selectIcon = {}
    },
  },
}
</script>

<style lang="scss">
.icon-select-popover {
  padding: 0;
  .el-tabs {
    border: none;
    box-shadow: none;
  }
}
</style>

<style lang="scss" scoped>
::v-deep {
  .el-input-group__prepend {
    background-color: #fff;
    padding: 0 8px;
  }
}

.svg-icon,
[class^='el-icon'] {
  font-size: 16px;
}
</style>
