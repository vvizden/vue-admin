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
    <el-form-item label="菜单类型" prop="menuType">
      <v-auto-radio
        v-model="ruleForm.menuType"
        dictCode="menu_type"
      ></v-auto-radio>
    </el-form-item>

    <el-form-item :label="nameLabel" prop="name">
      <el-input
        v-model.trim="ruleForm.name"
        :placeholder="`请填写${nameLabel}`"
        clearable
      ></el-input>
    </el-form-item>

    <template v-if="ruleForm.menuType !== '0'">
      <el-form-item label="上级菜单" prop="parentId">
        <el-cascader
          v-model="ruleForm.parentId"
          placeholder="请选择上级菜单"
          :options="menus"
          :props="{ checkStrictly: true, leaf: 'isLeaf' }"
          clearable
          style="width: 100%;"
        ></el-cascader>
      </el-form-item>
    </template>

    <template v-if="ruleForm.menuType === '2'">
      <el-form-item label="权限标识" prop="perms">
        <el-input
          v-model.trim="ruleForm.perms"
          placeholder="多项需用逗号分隔，如：user:list,user:create"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="权限策略" prop="permsType">
        <v-auto-radio
          v-model="ruleForm.permsType"
          dictCode="global_perms_type"
        ></v-auto-radio>
      </el-form-item>

      <el-form-item label="权限状态" prop="status">
        <v-auto-radio
          v-model="ruleForm.status"
          dictCode="valid_status"
        ></v-auto-radio>
      </el-form-item>

      <el-form-item label="菜单排序" prop="sortNo">
        <el-input-number
          v-model="ruleForm.sortNo"
          :min="1"
          :precision="2"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
    </template>

    <template v-else>
      <el-form-item label="路由路径" prop="url">
        <el-input
          v-model.trim="ruleForm.url"
          placeholder="请填写路由路径"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="组件路径" prop="component">
        <el-input
          v-model.trim="ruleForm.component"
          placeholder="组件路径，如 layouts/AsideLayout, views/system/UserList 或 system/UserList"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="跳转路径" prop="redirect">
        <el-input
          v-model.trim="ruleForm.redirect"
          placeholder="请填写跳转路径"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="菜单图标" prop="icon">
        <el-input
          v-model.trim="ruleForm.icon"
          placeholder="请填写菜单图标"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="菜单排序" prop="sortNo">
        <el-input-number
          v-model="ruleForm.sortNo"
          :min="1"
          :precision="2"
          controls-position="right"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="路由菜单" prop="route">
        <el-switch v-model="ruleForm.route" active-text="是" inactive-text="否">
        </el-switch>
      </el-form-item>

      <el-form-item label="隐藏路由" prop="hidden">
        <el-switch
          v-model="ruleForm.hidden"
          active-text="是"
          inactive-text="否"
        >
        </el-switch>
      </el-form-item>

      <el-form-item label="缓存路由" prop="keepAlive">
        <el-switch
          v-model="ruleForm.keepAlive"
          active-text="是"
          inactive-text="否"
        >
        </el-switch>
      </el-form-item>

      <el-form-item label="聚合路由" prop="alwaysShow">
        <el-switch
          v-model="ruleForm.alwaysShow"
          active-text="是"
          inactive-text="否"
        >
        </el-switch>
      </el-form-item>

      <el-form-item label="打开方式" prop="internalOrExternal">
        <el-switch
          v-model="ruleForm.internalOrExternal"
          :width="54"
          active-text="外部"
          inactive-text="内部"
        >
        </el-switch>
      </el-form-item>
    </template>

    <!-- 表单提交与重置 -->
    <el-form-item class="form-item-submit">
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { permissionUrl } from '@/api/url'
import { FormMixin } from '@/mixins'
import { cloneDeep, pickBy, pick } from 'lodash-es'

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
        treeList: permissionUrl.treeList,
      },
      ruleForm: {
        menuType: '0',
        name: '',
        parentId: [],
        url: '',
        component: '',
        redirect: '',
        perms: '',
        permsType: '1',
        status: '1',
        icon: '',
        sortNo: 1,
        route: true,
        hidden: false,
        keepAlive: false,
        alwaysShow: false,
        internalOrExternal: false,
      },
      rules: {
        menuType: [
          {
            type: 'enum',
            required: true,
            enum: ['0', '1', '2'],
            message: '请选择菜单类型',
            trigger: 'change',
          },
        ],
        name: [
          {
            validator: (rule, value, cb) => {
              if (!value || !value.trim() || typeof value != 'string') {
                cb(`请填写${this.nameLabel}`)
              } else {
                cb()
              }
            },
            trigger: ['change', 'blur'],
          },
        ],
        parentId: [
          {
            type: 'array',
            required: false,
            whitespace: true,
            message: '请选择上级菜单',
            trigger: ['change'],
          },
        ],
        url: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写路由路径',
            trigger: ['change', 'blur'],
          },
        ],
        component: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写组件路径',
            trigger: ['change', 'blur'],
          },
        ],
        redirect: [
          {
            type: 'string',
            required: false,
            whitespace: true,
            message: '请填写跳转路径',
            trigger: ['change', 'blur'],
          },
        ],
        perms: [
          {
            type: 'string',
            required: false,
            whitespace: true,
            message: '请填写权限标识',
            trigger: ['change', 'blur'],
          },
        ],
        permsType: [
          {
            type: 'enum',
            required: true,
            enum: ['1', '2'],
            message: '请选择权限策略',
            trigger: 'change',
          },
        ],
        status: [
          {
            type: 'enum',
            required: true,
            enum: ['0', '1'],
            message: '请选择权限状态',
            trigger: 'change',
          },
        ],
        icon: [
          {
            type: 'string',
            required: false,
            whitespace: true,
            message: '请填写菜单图标',
            trigger: ['change', 'blur'],
          },
        ],
        sortNo: [
          {
            type: 'number',
            required: true,
            min: 0,
            message: '请填写菜单排序',
            trigger: ['change', 'blur'],
          },
        ],
        route: [
          {
            type: 'enum',
            required: true,
            enum: [true, false],
            message: '请选择是否路由菜单',
            trigger: 'change',
          },
        ],
        hidden: [
          {
            type: 'enum',
            required: true,
            enum: [true, false],
            message: '请选择是否隐藏路由',
            trigger: 'change',
          },
        ],
        keepAlive: [
          {
            type: 'enum',
            required: true,
            enum: [true, false],
            message: '请选择是否缓存路由',
            trigger: 'change',
          },
        ],
        alwaysShow: [
          {
            type: 'enum',
            required: true,
            enum: [true, false],
            message: '请选择是否聚合路由',
            trigger: 'change',
          },
        ],
        internalOrExternal: [
          {
            type: 'enum',
            required: true,
            enum: [true, false],
            message: '请选择打开方式',
            trigger: 'change',
          },
        ],
      },
      menus: [],

      // 表单提交loading
      loading: false,
    }
  },
  computed: {
    nameLabel() {
      return this.ruleForm.menuType === '2' ? '权限名称' : '菜单名称'
    },
  },
  watch: {
    nameLabel() {
      this.$refs.ruleForm.clearValidate('name')
    },
  },
  created() {
    this.$http.get(this.url.treeList).then((res) => {
      this.menus = res.result.treeList || []
    })

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

      // 上级菜单
      if (clonedData.parentId != null && Array.isArray(clonedData.parentId)) {
        clonedData.parentId = String(clonedData.parentId)
        if (!clonedData.parentId) {
          delete clonedData.parentId
        }
      }

      if (clonedData.menuType === '2') {
        clonedData = pick(clonedData, [
          'id',
          'menuType',
          'name',
          'parentId',
          'perms',
          'permsType',
          'status',
          'sortNo',
        ])
      } else {
        clonedData = pick(clonedData, [
          'id',
          'menuType',
          'name',
          'parentId',
          'url',
          'component',
          'redirect',
          'icon',
          'sortNo',
          'route',
          'hidden',
          'keepAlive',
          'alwaysShow',
          'internalOrExternal',
        ])
      }

      return clonedData
    },

    // 原始数据转化为表单组件所需数据
    modelToForm() {
      // 筛选出form表单中需要的数据
      let resultData = pickBy(this.model, (v, k) => {
        return Object.prototype.hasOwnProperty.call(this.ruleForm, k)
      })

      resultData = cloneDeep(resultData)
      if (resultData.parentId) {
        resultData.parentId = [resultData.parentId]
      }

      if (resultData.menuType != null) {
        resultData.menuType = String(resultData.menuType)
      }
      // 填充表单
      resultData = Object.assign({}, this.ruleForm, resultData)
      return resultData
    },
  },
}
</script>
