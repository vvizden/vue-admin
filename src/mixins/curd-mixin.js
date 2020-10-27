/**
 * 使用时，请提供rowKey属性值，可以是变量，也可是方法
 */
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
      formContainerInnerVisible: false,
      // begin <----  dialog
    }
  },
  computed: {
    selectedRowKeys() {
      return this.selectedRows.map((e) => {
        if (this.getRowKey) {
          return this.getRowKey(e)
        }
        return e[this.rowKey]
      })
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

    // 设置容器内容元素可见，可控制多个内容元素，参数是容器开启或关闭状态
    setFormContainerInnerVisible(visible) {
      this.formContainerInnerVisible = visible
    },

    // 点击创建按钮
    handleCreateClick(row = {}, title = '创建') {
      if (typeof row != 'string') {
        this.editRow = row instanceof Event ? {} : row
        this.formContainerTitle = title
      } else {
        this.editRow = {}
        this.formContainerTitle = row
      }

      this.currentFormContainerInner = 'default'
      this.setFormContainerInnerVisible(true)
      this.$nextTick(() => {
        this.formContainerVisible = true
      })
    },

    // 点击编辑按钮
    handleEditClick(row, title = '编辑') {
      if (typeof row != 'string') {
        if (row instanceof Event)
          throw new Error(
            'handleEditClick first param must be the edit row object!',
          )
        this.editRow = row
        this.formContainerTitle = title
      } else {
        throw new Error(
          'handleEditClick first param must be the edit row object!',
        )
      }

      this.currentFormContainerInner = 'default'
      this.setFormContainerInnerVisible(true)
      this.$nextTick(() => {
        this.formContainerVisible = true
      })
    },

    // 点击删除按钮
    handleDeleteClick(row) {
      if (row instanceof Event)
        throw new Error(
          'handleDeleteClick params must be the row object includes unique key like id!',
        )

      let id
      if (this.getRowKey) {
        id = this.getRowKey(row)
      } else {
        id = row[this.rowKey]
      }
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
          ids: this.selectedRowKeys.join(','),
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
      this.setFormContainerInnerVisible(false)
    },

    // 多选改变
    handleSelectionChange(selection) {
      this.selectedRows = selection || []
    },
  },
}
