import PageTableMixin from './page-table-mixin'
import FormMixin from './form-mixin'

export default {
  mixins: [PageTableMixin, FormMixin],
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
      // begin <----  dialog
    }
  },
  computed: {
    selectedRowKeys() {
      return this.selectedRows.map((e) => e[this.rowKey])
    },
  },
  methods: {
    // 点击重置按钮
    handleResetClick(formName) {
      this.resetForm(formName)
      this.loadData()
    },

    // 点击创建按钮
    handleCreateClick() {
      this.editRow = {}
      this.formContainerTitle = '创建'
      this.formContainerVisible = true
    },

    // 点击编辑按钮
    handleEditClick(row) {
      this.editRow = row
      this.formContainerTitle = '编辑'
      this.formContainerVisible = true
    },

    // 点击删除按钮
    handleDeleteClick(id) {
      this.editRow = {}
      this.loading = true
      this.$http
        .delete(this.url.delete, { id: id })
        .then((res) => {
          this.pagination.page = 1
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
          this.pagination.page = 1
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
      this.pagination.page = 1
      this.loadData()
    },

    // 多选改变
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
  },
}
