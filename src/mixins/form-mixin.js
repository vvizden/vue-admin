import { cloneDeep } from 'lodash-es'

/* !!!!!! 使用时需要提供 model, ruleFormReset, ruleForm 数据和 manualReset, formToFormData 方法 */
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = this.formToFormData()
          let httpPromise
          this.loading = true
          if (this.localHttp) {
            httpPromise = this.localHttp()
          } else {
            if (this.isEditForm) {
              httpPromise = this.$http.put(this.url.edit, formData)
            } else {
              httpPromise = this.$http.post(this.url.create, formData)
            }
          }
          httpPromise
            .then((res) => {
              this.$emit('ok')
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
    },
  },
}
