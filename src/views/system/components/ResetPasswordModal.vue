<template>
  <!-- 表单弹窗 -->
  <el-dialog
    v-el-dialog-drag
    title="重置密码"
    top="6vh"
    width="500px"
    :visible="visible"
    @update:visible="handleUpdateVisible"
    @closed="handleDialogClosed"
  >
    <el-form
      :key="formKey"
      v-loading="loading"
      element-loading-text="正在提交..."
      element-loading-custom-class="custom-loading"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model.trim="ruleForm.username"
          placeholder="请填写用户名"
          disabled
        ></el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="password">
        <el-input
          v-model.trim="ruleForm.password"
          placeholder="请填写新密码"
          clearable
          show-password
        ></el-input>
      </el-form-item>

      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input
          v-model.trim="ruleForm.confirmPassword"
          placeholder="请填写新密码"
          clearable
          show-password
        ></el-input>
      </el-form-item>

      <!-- 表单提交与重置 -->
      <el-form-item class="form-item-submit">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { userUrl } from '@/api/url'
import { FormMixin } from '@/mixins'
import { cloneDeep, pickBy } from 'lodash-es'

export default {
  name: 'ResetPasswordModal',
  mixins: [FormMixin],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    model: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      url: {
        edit: userUrl.resetPassword,
      },
      ruleForm: {
        username: '',
        password: '',
        confirmPassword: '',
      },
      rules: {
        password: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写新密码',
            trigger: ['change', 'blur'],
          },
          //   {
          //     required: true,
          //     pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/,
          //     message: '密码至少8位，必须同时存在数字、字母和符号',
          //     trigger: ['change', 'blur'],
          //   },
          {
            validator: this.validatePassword,
            trigger: 'blur',
          },
        ],
        confirmPassword: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写新密码',
            trigger: ['change', 'blur'],
          },
          {
            validator: this.validateConfirmPassword,
            trigger: 'blur',
          },
        ],
      },
      formContainerVisible: false,
      formKey: String(Date.now()),
      loading: false,
    }
  },
  computed: {
    isEditForm() {
      return true
    },
  },
  watch: {
    model() {
      const data = this.modelToForm()
      this.ruleFormReset = cloneDeep(data)
      this.ruleForm = data
    },
  },
  created() {
    const data = this.modelToForm()
    this.ruleFormReset = cloneDeep(data)
    this.ruleForm = data
  },
  methods: {
    modelToForm() {
      let resultData = pickBy(this.model, (v, k) => {
        return (
          Object.prototype.hasOwnProperty.call(this.ruleForm, k) && v != null
        )
      })

      resultData = cloneDeep(resultData)
      // 填充表单
      resultData = Object.assign({}, this.ruleForm, resultData)
      return resultData
    },
    formToFormData() {
      // 深层拷贝数据
      let clonedData = cloneDeep(this.ruleForm)
      clonedData.confirmpassword = clonedData.confirmPassword
      return clonedData
    },
    handleUpdateVisible(val) {
      this.$emit('update:visible', val)
    },
    handleDialogClosed() {
      this.formKey = String(Date.now())
      this.resetForm('ruleForm')
    },
    validatePassword(rule, value, callback) {
      this.$refs.ruleForm.validateField('confirmPassword')
      callback()
    },
    validateConfirmPassword(rule, value, callback) {
      if (value !== this.ruleForm.password) {
        callback('两次输入的密码不一致')
      } else {
        callback()
      }
    },
  },
}
</script>
