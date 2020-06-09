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
        v-model.trim="ruleForm.username"
        placeholder="请填写用户账号"
        clearable
      ></el-input>
    </el-form-item>

    <template v-if="!model.id">
      <el-form-item label="登陆密码" prop="password">
        <el-input
          v-model.trim="ruleForm.password"
          placeholder="请填写登陆密码"
          clearable
          show-password
          autocomplete="new-password"
        ></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model.trim="ruleForm.confirmPassword"
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
      <v-auto-radio v-model="ruleForm.sex" dictCode="sex"></v-auto-radio>
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

    <el-form-item class="form-item-submit">
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { userUrl, roleUrl, deptUrl } from '@/api/url'
import { duplicationCheck } from '@/api/util'
import { cloneDeep, pickBy } from 'lodash-es'
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
        deptIds: [],
        sex: '1',
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
            trigger: ['change', 'blur'],
          },
          {
            validator: this.validateUsername,
            trigger: 'blur',
          },
        ],
        password: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写登陆密码',
            trigger: ['change', 'blur'],
          },
          {
            required: true,
            pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/,
            message: '密码至少8位，必须同时存在数字、字母和符号',
            trigger: ['change', 'blur'],
          },
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
            message: '请填写登陆密码',
            trigger: ['change', 'blur'],
          },
          {
            validator: this.validateConfirmPassword,
            trigger: 'blur',
          },
        ],
        realname: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写用户姓名',
            trigger: ['change', 'blur'],
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
        departIds: [
          {
            type: 'array',
            required: false,
            message: '请选择组织机构',
            trigger: 'change',
          },
        ],
        sex: [
          {
            type: 'enum',
            required: true,
            enum: ['1', '2'],
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
            trigger: 'blur',
          },
          { validator: this.validateEmail, trigger: 'blur' },
        ],
        phone: [
          {
            pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/,
            required: false,
            whitespace: true,
            message: '手机号格式错误',
            trigger: 'blur',
          },
          { validator: this.validatePhone, trigger: 'blur' },
        ],
        telephone: [
          {
            pattern: /^0\d{2,3}-[1-9]\d{6,7}$/,
            whitespace: true,
            message: '座机号码格式错误',
            trigger: 'blur',
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
  created() {
    // load role list
    this.$http.get(roleUrl.list).then((res) => {
      this.roleList = res.result
    })

    // load dept tree
    this.$http.get(deptUrl.deptTree).then((res) => {
      this.deptTreeData = res.result
    })

    // model to form
    this.modelToForm().then((data) => {
      this.ruleForm = data
      this.$refs.deptTree.setCheckedKeys(this.ruleForm.deptIds)
    })
  },
  methods: {
    // 表单组件数据转化为待提交表单数据
    formToFormData() {
      // 深层拷贝数据
      let clonedData = cloneDeep(this.ruleForm)
      // 赋值 id
      clonedData.id = this.model.id

      // 转换所选角色
      if (clonedData.roleIds) {
        clonedData.selectedroles = clonedData.roleIds.join(',')
      } else {
        clonedData.selectedroles = ''
      }
      // 转换所选部门
      const deptIds = this.$refs.deptTree.getCheckedKeys()
      if (deptIds) {
        clonedData.selecteddeparts = deptIds.join(',')
      } else {
        clonedData.selecteddeparts = ''
      }

      // 删除多余字段
      delete clonedData.confirmPassword
      delete clonedData.roleIds
      delete clonedData.deptIds

      // 去除空串的手机号和邮箱，避免数据库空串的唯一索引错误
      if (clonedData.phone && clonedData.phone === '') {
        delete clonedData.phone
      }
      if (clonedData.email && clonedData.email === '') {
        delete clonedData.email
      }

      return clonedData
    },
    // 原始数据转化为表单组件所需数据
    async modelToForm() {
      // 筛选出form表单中需要的数据
      let resultData = pickBy(this.model, (v, k) => {
        return Object.prototype.hasOwnProperty.call(this.ruleForm, k)
      })

      resultData = cloneDeep(resultData)
      // 填充表单
      resultData = Object.assign({}, this.ruleForm, resultData)
      // 所选角色
      if (this.model.id) {
        // 设置用户所属角色
        // 设置用户所属部门
        try {
          const roleRes = await this.$http.get(this.url.userRoleIds, {
            userid: this.model.id,
          })
          resultData.roleIds = roleRes.result || []
        } catch (error) {
          resultData.roleIds = []
        }

        try {
          const deptRes = await this.$http.get(this.url.userDepts, {
            userId: this.model.id,
          })

          resultData.deptIds = deptRes.result
            ? deptRes.result.map((e) => e.value)
            : []
        } catch (error) {
          resultData.deptIds = []
        }
      } else {
        resultData.roleIds = []
        resultData.deptIds = []
      }

      return resultData
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = this.formToFormData()
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
          callback('该用户名已被注册，请重新填写')
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
          callback('该手机号已被注册，请重新填写')
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
          callback('该邮箱已被注册，请重新填写')
        }
      })
    },
  },
}
</script>

<style></style>
