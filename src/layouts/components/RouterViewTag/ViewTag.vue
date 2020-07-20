<template>
  <div
    class="view-tag-container"
    ref="viewTagContainer"
    :style="viewTagContainerStyle"
  >
    <div
      v-if="minSlideX !== 0"
      class="view-tag-slide view-tag-slide--left"
      @click="handleSlideLeftClick"
    >
      <i class="el-icon-arrow-left"></i>
    </div>
    <ul class="view-tag" ref="viewTag" :style="viewTagStyle">
      <li
        v-for="(item, index) of data"
        :key="item[dataPropsComputed.key]"
        :class="[
          'view-tag__item',
          {
            'view-tag__item--selected':
              selectItemKey === item[dataPropsComputed.key],
          },
        ]"
        @click="handleItemClick(item, index)"
      >
        <span class="view-tag__title" :title="item[dataPropsComputed.title]">
          {{ item[dataPropsComputed.title] }}
        </span>
        <i
          v-if="item[dataPropsComputed.closeable]"
          class="el-icon-close"
          @click="handleItemCloseClick(item, index)"
        ></i>
      </li>
    </ul>
    <div
      v-if="minSlideX !== 0"
      class="view-tag-slide view-tag-slide--right"
      @click="handleSlideRightClick"
    >
      <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>

<script>
import elementResizeDetectorMaker from 'element-resize-detector'
import { debounce } from 'lodash-es'

export default {
  name: 'ViewTag',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    defaultValue: {
      type: [String, Number],
    },
    data: {
      type: Array,
      default: () => [],
    },
    dataProps: {
      type: Object,
      default: () => ({
        key: 'key',
        title: 'title',
        closeable: 'closeable',
      }),
    },
  },
  data() {
    return {
      scrollWidth: 0,
      clientWidth: 0,
      slideX: 0,
      actualSlideX: 0,
      selectItemKey: this.value || this.defaultValue || null,
    }
  },
  computed: {
    dataPropsComputed() {
      return {
        key: 'key',
        title: 'title',
        closeable: 'closeable',
        ...this.dataProps,
      }
    },
    minSlideX() {
      return -(this.scrollWidth - this.clientWidth)
    },
    remainingSlideLengthToLeft() {
      return this.actualSlideX - this.minSlideX
    },
    viewTagStyle() {
      return {
        transform: `translateX(${this.actualSlideX}px)`,
      }
    },
    viewTagContainerStyle() {
      return this.minSlideX === 0 ? { paddingLeft: '0', paddingRight: '0' } : {}
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    handleItemClick(item, index) {
      if (this.selectItemKey !== item[this.dataPropsComputed.key]) {
        this.selectItemKey = item[this.dataPropsComputed.key]
        this.$emit('change', item[this.dataPropsComputed.key], item, index)
      }
    },
    handleItemCloseClick(item, index) {
      this.$emit('close', item[this.dataPropsComputed.key], item, index)
    },
    init() {
      this.setViewTagWidth()

      const erdUltraFast = elementResizeDetectorMaker({
        strategy: 'scroll', //<- For ultra performance.
      })

      erdUltraFast.listenTo(
        this.$refs.viewTagContainer,
        debounce(() => {
          this.setViewTagWidth()
          this.slide()
        }, 200),
      )

      this.$once('hook:beforeDestroy', () => {
        erdUltraFast.uninstall(this.$refs.viewTagContainer)
      })
    },
    setViewTagWidth() {
      let viewTag = this.$refs.viewTag
      this.scrollWidth = viewTag.scrollWidth
      this.clientWidth = viewTag.getBoundingClientRect().width
    },
    handleSlideLeftClick() {
      this.slideX += 120
      this.slide()
    },
    handleSlideRightClick() {
      this.slideX -= 120
      this.slide()
    },
    slide() {
      let moveToLeft = this.slideX <= 0
      let slideLength = Math.abs(this.slideX)
      if (moveToLeft) {
        if (this.remainingSlideLengthToLeft <= slideLength) {
          this.actualSlideX -= this.remainingSlideLengthToLeft
        } else {
          this.actualSlideX -= slideLength
        }
      } else {
        let remainingSlideLengthToRight = Math.abs(this.actualSlideX)
        if (remainingSlideLengthToRight <= slideLength) {
          this.actualSlideX += remainingSlideLengthToRight
        } else {
          this.actualSlideX += slideLength
        }
      }
      this.slideX = 0
    },
  },
}
</script>

<style lang="scss" scoped>
$--width-slide: 40px;
$--color-feature-bg: #dee1e6;
$--color-feature-hover: #d1d2d3;
$--color-feature-active: #a1a2a3;

.view-tag-container {
  flex: none;
  width: 100%;
  height: 32px;
  display: flex;
  flex-flow: row nowrap;
  // align-items: center;
  overflow: hidden;

  position: relative;

  padding: 0 $--width-slide;
  background-color: $--color-feature-bg;
}

.view-tag-slide {
  width: $--width-slide;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 0;
  z-index: 1;

  cursor: pointer;

  background-color: $--color-feature-bg;

  &:hover {
    background-color: $--color-feature-hover;
  }

  &:active {
    background-color: $--color-feature-active;
  }
}

.view-tag-slide--left {
  left: 0;
}

.view-tag-slide--right {
  right: 0;
}

.view-tag {
  width: 100%;
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  // overflow: hidden;

  font-size: 14px;

  transition: transform 0.2s;
}

.view-tag__item {
  // width: 120px;
  min-width: 120px;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  padding: 8px 28px 8px 16px;
  // background-color: #dee1e6;

  white-space: nowrap;
  word-break: keep-all;
  user-select: none;
  cursor: pointer;

  &:hover {
    background-color: #f1f2f3;

    .el-icon-close {
      visibility: visible;
    }
  }
}

.view-tag__item--selected {
  color: $--color-primary;
  background-color: #fff;
}

.view-tag__item::after {
  content: '';
  display: inline-block;
  position: absolute;
  right: 0;
  top: 0;
  width: 1px;
  height: 100%;
  transform: scaleY(0.8);
  background-color: #8b8e92;
}

.view-tag__title {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-icon-close {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  visibility: hidden;
  border-radius: 50%;

  &:hover {
    background-color: $--color-feature-hover;
  }
}
</style>
