export default {
  data() {
    return {
      // 接口url
      url: {
        data: '',
      },
      // loading
      loading: false,
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
      }
    },

    // 处理表格数据
    /* eslint-disable-next-line */
    dataHandler(data) {},

    // 装载数据出错处理程序
    loadDataErrorHandler(error) {
      if (error) {
        this.$message.warning(error.message)
      }
    },
  },
}
