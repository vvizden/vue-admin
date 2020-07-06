<script>
import { NAME_PREFIX } from '../const/common'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入元素尺寸变化监测
import elementResizeDetectorMaker from 'element-resize-detector'
// 引入防抖
import { debounce } from 'lodash-es'

export default {
  name: `${NAME_PREFIX}Chart`,
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.chart = echarts.init(this.$refs.echartContainer)

      const erdUltraFast = elementResizeDetectorMaker({
        strategy: 'scroll', //<- For ultra performance.
      })

      erdUltraFast.listenTo(
        this.$refs.echartContainer,
        debounce(() => {
          this.chart.resize()
        }, 100),
      )

      this.$once('hook:beforeDestroy', () => {
        erdUltraFast.uninstall(this.$refs.echartContainer)
        this.chart.dispose()
        this.chart = null
      })

      this.$emit('mounted', this.chart)
    },
    getChartInstance() {
      return this.chart
    },
  },
  // eslint-disable-next-line
  render(h) {
    return (
      <div
        {...{
          style: {
            width: '100%',
          },
          ref: 'echartContainer',
        }}
      ></div>
    )
  },
}
</script>

<style lang="scss" scoped></style>
