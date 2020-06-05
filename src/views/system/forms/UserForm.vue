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
    <el-form-item label="用户账号" prop="username">
      <el-input
        v-model="ruleForm.username"
        placeholder="请填写用户账号"
        clearable
      ></el-input>
    </el-form-item>

    <template v-if="!model.id">
      <el-form-item label="登陆密码" prop="password">
        <el-input
          v-model="ruleForm.password"
          placeholder="请填写登陆密码"
          clearable
          show-password
          autocomplete="new-password"
        ></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="ruleForm.confirmPassword"
          placeholder="请再次填写登陆密码"
          clearable
          show-password
        ></el-input>
      </el-form-item>
    </template>

    <el-form-item label="用户姓名" prop="realname">
      <el-input
        v-model.trim="ruleForm.realname"
        placeholder="请填写用户姓名"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="角色" prop="roleIds">
      <el-select
        v-model="ruleForm.roleIds"
        multiple
        filterable
        clearable
        placeholder="请选择角色"
        style="width: 100%;"
      >
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        >
          <span>{{ item.roleName }}</span>
          <span style="margin-left:16px; color: #8492a6; font-size: 13px">{{
            item.roleCode
          }}</span>
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="组织机构">
      <el-tree
        ref="deptTree"
        :data="deptTreeData"
        show-checkbox
        check-strictly
        node-key="value"
        default-expand-all
        :props="deptTreeProps"
      >
      </el-tree>
    </el-form-item>

    <el-form-item label="性别" prop="sex">
      <el-radio-group v-model="ruleForm.sex">
        <el-radio :label="1">男</el-radio>
        <el-radio :label="2">女</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="邮箱" prop="email">
      <el-input
        v-model.trim="ruleForm.email"
        placeholder="请填写邮箱"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="手机号" prop="phone">
      <el-input
        v-model.trim="ruleForm.phone"
        placeholder="请填写手机号"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="座机" prop="telephone">
      <el-input
        v-model.trim="ruleForm.telephone"
        placeholder="请填写座机"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { userUrl, roleUrl, deptUrl } from '@/api/url'
import { duplicationCheck } from '@/api/util'
import { cloneDeep, isEmpty } from 'lodash-es'
import { FormMixin } from '@/mixins'

export default {
  name: 'UserForm',
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
        userRoleIds: userUrl.userRoleIds,
        userDepts: userUrl.userDepts,
        edit: userUrl.edit,
        create: userUrl.create,
      },
      ruleForm: {
        username: '',
        password: '',
        confirmPassword: '',
        realname: '',
        roleIds: [],
        sex: 1,
        email: '',
        phone: '',
        telephone: '',
      },
      rules: {
        username: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写用户账号',
            trigger: 'change',
          },
          {
            validator: this.validateUsername,
            trigger: 'change',
          },
        ],
        password: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写登陆密码',
            trigger: 'change',
          },
          {
            required: true,
            pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/,
            message: '密码至少8位，必须同时存在数字、字母和符号',
            trigger: 'change',
          },
          {
            validator: this.validatePassword,
            trigger: 'change',
          },
        ],
        confirmPassword: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写登陆密码',
            trigger: 'change',
          },
          {
            validator: this.validateConfirmPassword,
            trigger: 'change',
          },
        ],
        realname: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写用户姓名',
            trigger: 'change',
          },
        ],
        roleIds: [
          {
            type: 'array',
            required: true,
            min: 1,
            message: '请选择角色',
            trigger: 'change',
          },
        ],
        // departIds: [],
        sex: [
          {
            type: 'enum',
            required: true,
            enum: [1, 2],
            message: '请选择性别',
            trigger: 'change',
          },
        ],
        email: [
          {
            type: 'email',
            required: false,
            whitespace: true,
            message: '邮箱格式错误',
            trigger: 'change',
          },
          { validator: this.validateEmail, trigger: 'blur' },
        ],
        phone: [
          {
            pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/,
            required: false,
            whitespace: true,
            message: '手机号格式错误',
            trigger: 'change',
          },
          { validator: this.validatePhone, trigger: 'blur' },
        ],
        telephone: [
          {
            pattern: /^0\d{2,3}-[1-9]\d{6,7}$/,
            whitespace: true,
            message: '座机号码格式错误',
            trigger: 'change',
          },
        ],
      },
      loading: false,
      roleList: [],
      deptTreeData: [],
      deptTreeProps: {
        label: 'title',
        children: 'children',
      },
    }
  },
  watch: {
    model(val) {
      if (isEmpty(val)) {
        this.$refs.ruleForm.resetFields()
      } else {
        this.ruleForm = { ...this.ruleForm, ...cloneDeep(val) }
      }
      this.formDataMapping(this.ruleForm, false)
    },
  },
  created() {
    // load role list
    this.$http.get(roleUrl.list).then((res) => {
      this.roleList = res.result
    })

    // load dept tree
    this.$http.get(deptUrl.deptTree).then((res) => {
      this.deptTreeData = res.result
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.ruleForm = { ...this.ruleForm, ...cloneDeep(this.model) }
      this.formDataMapping(this.ruleForm, false)
    })
  },
  methods: {
    // forward = ture, form to model
    formDataMapping(formData, forward = true) {
      if (forward) {
        // 所选角色
        if (formData.roleIds) {
          formData.selectedroles = formData.roleIds.join(',')
          delete formData.roleIds
        } else {
          formData.selectedroles = ''
        }
        // 所选部门
        const deptIds = this.$refs.deptTree.getCheckedKeys()
        if (deptIds) {
          formData.selecteddeparts = deptIds.join(',')
        } else {
          formData.selecteddeparts = ''
        }
      } else {
        // 所选角色
        if (this.model.id) {
          // 用户所属角色
          this.$http
            .get(this.url.userRoleIds, { userid: this.model.id })
            .then((res) => {
              formData.roleIds = res.result || []
            })
            .catch(() => {
              formData.roleIds = []
            })
          // 用户所属部门
          this.$http
            .get(this.url.userDepts, { userId: this.model.id })
            .then((res) => {
              if (res.result) {
                const deptIds = res.result.map((e) => e.value)
                this.$refs.deptTree.setCheckedKeys(deptIds)
              }
            })
            .catch(() => {
              this.$refs.deptTree.setCheckedKeys([])
            })
        } else {
          formData.roleIds = []
          this.$refs.deptTree.setCheckedKeys([])
        }
      }
    },
    getFormData() {
      // 待提交表单数据
      let formData = { ...this.ruleForm }
      for (const key of Object.keys(formData)) {
        if (formData[key] == '') {
          delete formData[key]
        }
      }
      // 处理 form => model 的映射
      this.formDataMapping(formData, true)
      // 删除多余字段
      delete formData.confirmPassword

      return formData
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = this.getFormData()
          let httpPromise
          this.loading = true
          if (this.model.id) {
            httpPromise = this.$http.put(this.url.edit, formData)
          } else {
            httpPromise = this.$http.post(this.url.create, formData)
          }
          httpPromise
            .then((res) => {
              this.$emit('ok')
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
        } else {
          return false
        }
      })
    },
    validateUsername(rule, value, callback) {
      if (!value) {
        return callback()
      }

      const params = {
        tableName: 'sys_user',
        fieldName: 'username',
        fieldVal: value,
        dataId: this.model.id,
      }

      duplicationCheck(params).then((pass) => {
        if (pass) {
          callback()
        } else {
          callback('该用户名已被注册，请重新填写用户名')
        }
      })
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
    validatePhone(rule, value, callback) {
      if (!value) {
        return callback()
      }

      const params = {
        tableName: 'sys_user',
        fieldName: 'phone',
        fieldVal: value,
        dataId: this.model.id,
      }
      duplicationCheck(params).then((pass) => {
        if (pass) {
          callback()
        } else {
          callback('该手机号已被注册，请重新填写手机号')
        }
      })
    },
    validateEmail(rule, value, callback) {
      if (!value) {
        return callback()
      }

      const params = {
        tableName: 'sys_user',
        fieldName: 'email',
        fieldVal: value,
        dataId: this.model.id,
      }
      duplicationCheck(params).then((pass) => {
        if (pass) {
          callback()
        } else {
          callback('该邮箱已被注册，请重新填写邮箱')
        }
      })
    },
  },
}
</script>

<style></style>
