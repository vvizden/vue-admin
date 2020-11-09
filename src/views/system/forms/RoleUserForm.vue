<template>
  <el-form
    v-loading="loading"
    element-loading-text="正在提交..."
    element-loading-custom-class="custom-loading"
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
  >
    <el-form-item label="角色编码" prop="roleCode">
      <el-input
        :disabled="!!model.id"
        v-model.trim="ruleForm.roleCode"
        placeholder="请填写角色编码"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="角色名称" prop="roleName">
      <el-input
        v-model.trim="ruleForm.roleName"
        placeholder="请填写角色名称"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="角色描述" prop="description">
      <el-input
        v-model.trim="ruleForm.description"
        placeholder="请填写角色描述"
        type="textarea"
        :rows="5"
        clearable
      ></el-input>
    </el-form-item>

    <!-- 表单提交与重置 -->
    <el-form-item class="form-item-submit">
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { roleUrl } from '@/api/url'
import { FormMixin } from '@/mixins'
import { duplicationCheck } from '@/api/util'
import { cloneDeep, pickBy } from 'lodash-es'

export default {
  name: 'RoleUserForm',
  mixins: [FormMixin],
  props: {
    model: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      url: {
        edit: roleUrl.edit,
        create: roleUrl.create,
      },
      ruleForm: {
        roleCode: '',
        roleName: '',
        description: '',
      },
      rules: {
        roleCode: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写角色编码',
            trigger: ['change', 'blur'],
          },
          {
            min: 0,
            max: 64,
            message: '长度不可超过 64 个字符',
            trigger: 'blur',
          },
          {
            pattern: /^[^\u4E00-\u9FA5]+$/,
            message: '角色编码不可输入汉字',
            trigger: ['change', 'blur'],
          },
          {
            validator: this.validateRoleCode,
            trigger: 'blur',
          },
        ],
        roleName: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写角色名称',
            trigger: ['change', 'blur'],
          },
          {
            min: 2,
            max: 30,
            message: '长度需 2 到 30 个字符',
            trigger: 'blur',
          },
        ],
        description: [
          {
            min: 0,
            max: 126,
            message: '长度不可超过 126 个字符',
            trigger: 'blur',
          },
        ],
      },

      // 表单提交loading
      loading: false,
    }
  },
  created() {
    const data = this.modelToForm()
    // 重置用
    this.ruleFormReset = cloneDeep(data)
    this.ruleForm = data
  },
  methods: {
    // 表单组件数据转化为待提交表单数据
    formToFormData() {
      // 深层拷贝数据
      let clonedData = cloneDeep(this.ruleForm)
      // 赋值 id
      clonedData.id = this.model.id

      return clonedData
    },

    // 原始数据转化为表单组件所需数据
    modelToForm() {
      // 筛选出form表单中需要的数据
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

    validateRoleCode(rule, value, callback) {
      if (!value) {
        return callback()
      }

      const params = {
        tableName: 'sys_role',
        fieldName: 'role_code',
        fieldVal: value,
        dataId: this.model.id,
      }

      duplicationCheck(params).then((pass) => {
        if (pass) {
          callback()
        } else {
          callback('该角色编码已被注册，请重新填写')
        }
      })
    },
  },
}
</script>
