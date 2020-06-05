export default {
  data() {
    return {
      // 接口url
      url: {
        data: '',
      },
      // begin ----> table
      // 表格loading
      loading: false,
      // 表格数据
      tableData: [],
      // 行唯一标识
      rowKey: 'id',
      // 筛选条件
      filterParams: {},
      // 排序条件
      sortord: {
        // column: 'createTime',
        // order: 'desc',
      },
    }
  },
  methods: {
    // 装载数据
    loadData() {
      this.loading = true
      return this.$http
        .get(this.url.data, this.getQueryParams())
        .then((res) => {
          this.dataHandler(res.result)
        })
        .catch((error) => {
          this.loadDataErrorHandler(error)
        })
        .finally(() => {
          this.loading = false
        })
    },

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

    // 装载数据出错处理程序
    loadDataErrorHandler(error) {
      if (error) {
        this.$message.warning(error.message)
      }
    },
  },
}
