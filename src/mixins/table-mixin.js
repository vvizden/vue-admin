export default {
  data() {
    return {
      loading: false,
      url: {
        data: '',
      },
    }
  },
  methods: {
    // 装载数据
    loadData() {
      this.loading = true
      return this.$http
        .get(this.url.data, this.getQueryParams())
        .then((result) => {
          if (result) {
            this.dataHandler(result)
          }
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
      return {}
    },

    // 处理表格数据
    dataHandler(data) {
      this.data = data
    },

    // 装载数据出错处理程序
    loadDataErrorHandler(error) {
      if (error) {
        this.$message.warning(error.message)
      }
    },
  },
}
