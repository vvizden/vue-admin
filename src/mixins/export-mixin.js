export default {
  data() {
    return {
      url: {
        // 导出excel url（Excel下载路径）
        exportXls: '',
      },
    }
  },
  methods: {
    // 导出Excel
    exportXls(fileName) {
      if (!fileName || typeof fileName != 'string') {
        fileName = '导出文件'
      }

      if (!this.url.exportXls) {
        this.$message.warning('Excel下载路径不能为空')
        return
      }

      let params = { ...this.getQueryParams() }
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        params['selections'] = this.selectedRowKeys.join(',')
      }

      this.$http
        .get(this.url.exportXls, params, {
          responseType: 'blob',
        })
        .then((data) => {
          if (!data) {
            this.$message.warning('文件下载失败')
            return
          }

          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(
              new Blob([data], { type: 'application/vnd.ms-excel' }),
              fileName + '.xls',
            )
          } else {
            let url = window.URL.createObjectURL(
              new Blob([data], { type: 'application/vnd.ms-excel' }),
            )
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName + '.xls')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
          }
        })
        .catch((error) => {
          if (error) {
            this.$message.warning(error.message)
          }
        })
    },
  },
}
