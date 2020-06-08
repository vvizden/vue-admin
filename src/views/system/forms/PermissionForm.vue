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
    <el-form-item label="菜单名称" prop="name">
      <el-input
        v-model="ruleForm.name"
        placeholder="请填写菜单名称"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="上级菜单" prop="parentId">
      <el-cascader
        v-model="ruleForm.parentId"
        placeholder="请选择上级菜单"
        :options="menus"
        :props="{ checkStrictly: true }"
        clearable
        style="width: 100%;"
      ></el-cascader>
    </el-form-item>

    <el-form-item label="路由路径" prop="url">
      <el-input
        v-model="ruleForm.url"
        placeholder="请填写路由路径"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="组件路径" prop="component">
      <el-input
        v-model="ruleForm.component"
        placeholder="组件路径，如 layouts/AsideLayout, views/system/UserList 或 system/UserList"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="跳转路径" prop="redirect">
      <el-input
        v-model="ruleForm.redirect"
        placeholder="请填写跳转路径"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="权限标识" prop="perms">
      <el-input
        v-model="ruleForm.perms"
        placeholder="多项需用逗号分隔，如：user:list,user:create"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="权限策略" prop="permsType">
      <el-radio-group v-model="ruleForm.sex">
        <el-radio :label="1">男</el-radio>
        <el-radio :label="2">女</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 表单提交与重置 -->
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { permissionUrl } from '@/api/url'
import { FormMixin } from '@/mixins'

export default {
  name: 'PermissionForm',
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
        create: permissionUrl.create,
        edit: permissionUrl.edit,
      },
      ruleForm: {
        name: '',
        parentId: '',
      },
      rules: {
        name: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写菜单名称',
            trigger: 'change',
          },
          //   {
          //     validator: this.validateUsername,
          //     trigger: 'change',
          //   },
        ],
      },
      menus: [],

      // 表单提交loading
      loading: false,
    }
  },
  created() {
    // this.ruleForm = this.modelToForm()
  },
  methods: {
    // 表单组件数据转化为待提交表单数据
    formToFormData() {
      // 自由发挥
    },

    // 原始数据转化为表单组件所需数据
    modelToForm() {
      // 自由发挥
    },

    // 表单项自定义校验
    /* eslint-disable-next-line */
    validateUsername(rule, value, callback) {
      // 按照官方自定义校验自由发挥
    },
  },
}
</script>
