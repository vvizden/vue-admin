<template>
  <div class="icon-pane">
    <el-tabs type="border-card" shad>
      <el-tab-pane label="系统图标">
        <ul :class="iconGridClass" @click="handleIconClick($event, 'svg')">
          <li
            class="icon-item"
            v-for="item of svgIcons"
            :key="item"
            :data-icon-class="item"
          >
            <div class="icon-wrapper">
              <svg-icon :icon-class="item" />
              <span class="icon-label">{{ item }}</span>
            </div>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="内置图标">
        <ul :class="iconGridClass" @click="handleIconClick($event, 'element')">
          <li
            class="icon-item"
            v-for="item of elementIcons"
            :key="item"
            :data-icon-class="item"
          >
            <div class="icon-wrapper">
              <i :class="item" />
              <span class="icon-label">{{ item }}</span>
            </div>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { NAME_PREFIX } from '../const/common'
import svgIcons from './svg-icons'
import elementIcons from './element-icons'

export default {
  name: `${NAME_PREFIX}IconPane`,
  props: {
    small: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      svgIcons,
      elementIcons: elementIcons.map((e) => `el-icon-${e}`),
    }
  },
  computed: {
    iconGridClass() {
      return {
        'icon-grid': true,
        'icon-grid--small': this.small,
      }
    },
  },
  methods: {
    handleIconClick(e, type) {
      if (e.target.dataset.iconClass) {
        this.$emit('click', type, e.target.dataset.iconClass, e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.icon-grid {
  color: #666;
  font-size: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-auto-rows: minmax(100px, auto);
}

.icon-grid--small {
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  grid-auto-rows: minmax(40px, 1fr);

  font-size: 20px;

  .icon-item {
    padding: 8px;
  }

  .icon-label {
    display: none;
  }
}

.icon-item {
  padding: 16px;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    border-color: $--color-primary;
    color: $--color-primary;
  }
}

.icon-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  pointer-events: none;
}

.icon-label {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 16px;
  font-size: 12px;
  text-align: center;
  word-break: break-all;
  white-space: nowrap;
}
</style>
