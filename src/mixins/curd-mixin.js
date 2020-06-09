export default {
  data() {
    return {
      // 接口url
      url: {
        data: '',
        delete: '',
        deleteBatch: '',
      },
      // 当前编辑行
      editRow: {},
      // 选择的行
      selectedRows: [],
      // begin ---->  dialog
      formContainerTitle: '创建',
      formContainerVisible: false,
      formContainerInnerVisible: true,
      // begin <----  dialog
    }
  },
  computed: {
    selectedRowKeys() {
      return this.selectedRows.map((e) => e[this.rowKey])
    },
  },
  methods: {
    // 重置表单
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
    },

    // 点击重置按钮
    handleResetClick(formName) {
      this.resetForm(formName)
      this.loadData()
    },

    // 点击创建按钮
    handleCreateClick() {
      this.editRow = {}
      this.formContainerInnerVisible = true
      this.formContainerTitle = '创建'
      this.$nextTick(() => {
        this.formContainerVisible = true
      })
    },

    // 点击编辑按钮
    handleEditClick(row) {
      this.editRow = row
      this.formContainerInnerVisible = true
      this.formContainerTitle = '编辑'
      this.$nextTick(() => {
        this.formContainerVisible = true
      })
    },

    // 点击删除按钮
    handleDeleteClick(id) {
      this.editRow = {}
      this.loading = true
      this.$http
        .delete(this.url.delete, { id: id })
        .then((res) => {
          if (this.pagination) {
            this.pagination.page = 1
          }
          this.loadData()
          this.$message.success(res.message)
        })
        .catch((error) => {
          if (error) {
            this.$message.warning(error.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 点击批量删除按钮
    handleDeleteBatchClick() {
      this.loading = true
      this.$http
        .delete(this.url.deleteBatch, {
          ids: this.selectedRows.map((e) => e.id).join(','),
        })
        .then((res) => {
          this.selectedRows = []
          if (this.pagination) {
            this.pagination.page = 1
          }
          this.loadData()
          this.$message.success(res.message)
        })
        .catch((error) => {
          if (error) {
            this.$message.warning(error.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 表单提交成功
    handleFormOk() {
      this.formContainerVisible = false
      if (this.pagination) {
        this.pagination.page = 1
      }
      this.loadData()
    },

    // 表单容器关闭动画结束时的回调
    handleFormContainerClosed() {
      this.formContainerInnerVisible = false
    },

    // 多选改变
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
  },
}
