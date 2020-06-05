import TableMixin from './table-mixin'

export default {
  mixins: [TableMixin],
  data() {
    return {
      // 分页参数
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
      },
    }
  },
  methods: {
    // 获取查询参数
    getQueryParams() {
      return {
        pageNo: this.pagination.page,
        pageSize: this.pagination.limit,
        ...this.filterParams,
        ...this.sortord,
      }
    },

    // 处理表格数据
    dataHandler(data) {
      this.tableData = data.records
      this.pagination.total = data.total
    },
  },
}
