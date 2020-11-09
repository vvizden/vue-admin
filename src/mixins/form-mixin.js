import { cloneDeep } from 'lodash-es'

export default {
  computed: {
    isEditForm() {
      return (
        this.model && Object.prototype.hasOwnProperty.call(this.model, 'id')
      )
    },
  },
  methods: {
    // 重置表单
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields()
      }
      if (this[`${formName}Reset`] && this[formName]) {
        this[formName] = cloneDeep(this[`${formName}Reset`])
      }
      this.manualReset && this.manualReset()
    },
    // 提交表单
    submitForm(formName) {
      if (this.beforeSubmitForm) {
        if (!this.beforeSubmitForm()) return
      }
      this.$nextTick(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let httpPromise
            this.loading = true
            if (this.localHttp) {
              httpPromise = this.localHttp()
            } else {
              const formData = this.formToFormData()
              if (this.isEditForm) {
                httpPromise = this.$http.put(this.url.edit, formData)
              } else {
                httpPromise = this.$http.post(this.url.create, formData)
              }
            }
            httpPromise
              .then((res) => {
                this.submitFormOk(res)
                this.$message.success(res.message)
              })
              .catch((error) => {
                if (error) {
                  this.$message.warning(error.message || '操作失败')
                }
              })
              .finally(() => {
                this.loading = false
              })
          } else {
            return false
          }
        })
      })
    },

    submitFormOk() {
      this.$emit('ok')
    },
  },
}
