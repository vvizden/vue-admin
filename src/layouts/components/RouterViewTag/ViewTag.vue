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
        @click="handleItemClick(item[dataPropsComputed.key], index)"
      >
        <span class="view-tag__title-prefix"></span>
        <span class="view-tag__title" :title="item[dataPropsComputed.title]">
          {{ item[dataPropsComputed.title] }}
        </span>
        <i
          v-if="!item[dataPropsComputed.affix]"
          class="el-icon-close"
          @click.stop="handleItemCloseClick(item[dataPropsComputed.key], index)"
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
    <div
      v-if="data.length > 1"
      class="view-tag-close"
      @click="handleViewTagCloseClick(item[dataPropsComputed.key], index)"
    >
      <i class="el-icon-close"></i>
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
        affix: 'affix',
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
    dataIndexMap() {
      return this.data.reduce((map, e, index) => {
        let key = e[this.dataPropsComputed.key]
        if (!Object.prototype.hasOwnProperty.call(map, key)) {
          map[key] = index
        }
        return map
      }, {})
    },
    dataPropsComputed() {
      return {
        key: 'key',
        title: 'title',
        affix: 'affix',
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
      return this.minSlideX === 0
        ? { paddingLeft: '20px', paddingRight: '20px' }
        : {}
    },
  },
  watch: {
    value(val) {
      this.selectItemKey = val
      this.moveToViewport()
    },
    data() {
      this.$nextTick(() => {
        this.setViewTagWidth()
      })
    },
    viewTagContainerStyle() {
      this.$nextTick(() => {
        this.setViewTagWidth()
        this.moveToViewport()
      })
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    handleItemClick(key, index) {
      if (this.selectItemKey !== key) {
        this.selectItemKey = key
        this.$emit('change', key, this.data[this.dataIndexMap[key]], index)
      }
    },
    handleItemCloseClick(key, index) {
      this.$emit('close', key, this.data[this.dataIndexMap[key]], index)
    },
    handleViewTagCloseClick(key, index) {
      this.$emit('closeAll', key, this.data[this.dataIndexMap[key]], index)
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
      this.slideX += 112
      this.slide()
    },
    handleSlideRightClick() {
      this.slideX -= 112
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
    moveToViewport() {
      const currentActiveLength =
        112 * (this.dataIndexMap[this.value] + 1) -
        8 +
        this.remainingSlideLengthToLeft

      const leftHiddenLength = Math.abs(this.minSlideX)

      const maxLeftLegth = leftHiddenLength + 112

      if (currentActiveLength < maxLeftLegth) {
        this.slideX += maxLeftLegth - currentActiveLength
        this.slide()
      }

      if (currentActiveLength > this.scrollWidth) {
        this.slideX -= currentActiveLength - this.scrollWidth
        this.slide()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$--width-slide: 20px;
$--color-feature-bg: $--color-white;
$--color-feature-hover: mix($--color-primary, #fff, 20);
$--color-feature-active: mix($--color-primary, #fff, 40);
$--color-border: #dfe6ec;

.view-tag-container {
  flex: none;
  width: 100%;
  height: 33px;
  display: flex;
  flex-flow: row nowrap;
  // align-items: center;
  overflow: hidden;

  position: relative;

  padding: 4px $--width-slide * 2 + 8px 4px $--width-slide + 8px;
  background-color: $--color-feature-bg;
  border-bottom: 1px solid $--color-border;
}

@mixin viewTagAction {
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

.view-tag-slide {
  @include viewTagAction;
}

.view-tag-slide--left {
  left: 0;
  // border-right: 1px solid $--color-border;
  box-shadow: 2px 0 4px 4px rgba(0, 0, 0, 0.15);
}

.view-tag-slide--right {
  right: $--width-slide;
  // border-left: 1px solid $--color-border;
  box-shadow: -2px 0 4px 4px rgba(0, 0, 0, 0.15);
}

.view-tag-close {
  @include viewTagAction;

  right: 0;

  &::before {
    content: '';
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    height: 100%;
    transform: scaleY(0.6);
    background-color: $--color-border;
  }
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
  min-width: 104px;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  padding: 0 28px 0 8px;
  // background-color: #dee1e6;

  white-space: nowrap;
  word-break: keep-all;
  user-select: none;
  cursor: pointer;

  color: #a0a0a0;
  border: 1px solid #dfe6ec;
  border-radius: $--border-radius-small;

  &:hover {
    // background-color: #f1f2f3;
    color: $--color-primary;
    border-color: $--color-primary;

    .el-icon-close {
      visibility: visible;
    }
  }
}

.view-tag__item + .view-tag__item {
  margin-left: 8px;
}

.view-tag__item--selected {
  color: $--color-primary;
  // background-color: #fff;
  border-color: $--color-primary;
}

// .view-tag__item::after {
//   content: '';
//   display: inline-block;
//   position: absolute;
//   right: 0;
//   top: 0;
//   width: 1px;
//   height: 100%;
//   transform: scaleY(0.8);
//   background-color: #8b8e92;
// }

.view-tag__title {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.view-tag__title-prefix {
  flex: none;
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;

  margin-right: 6px;

  background-color: currentColor;
}

.view-tag__item > .el-icon-close {
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
