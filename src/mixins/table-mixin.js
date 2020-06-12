import LoadDataMixin from './load-data-mixin'

export default {
  mixins: [LoadDataMixin],
  data() {
    return {
      // begin ----> table
      // 表格数据
      tableData: [],
      // 行唯一标识
      rowKey: 'id',
      // 排序条件
      sortord: {
        // column: 'createTime',
        // order: 'desc',
      },
    }
  },
  methods: {
    // 获取查询参数
    getQueryParams() {
      return {
        ...this.filterParams,
        ...this.sortord,
      }
    },

    // 处理表格数据
    dataHandler(data) {
      this.tableData = data
    },
  },
}
