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
    <el-form-item label="角色权限" prop="permissionIds">
      <v-tree
        ref="permissionTree"
        :data="permissionData"
        searchable
        highlight-current
        show-checkbox
        check-strictly
        node-key="value"
        default-expand-all
        :props="permissionTreeProps"
        style="height: 400px;"
      >
      </v-tree>
    </el-form-item>

    <!-- 表单提交与重置 -->
    <el-form-item v-show="permissionData.length > 0" class="form-item-submit">
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { roleUrl, permissionUrl } from '@/api/url'
import { FormMixin } from '@/mixins'
import { cloneDeep } from 'lodash-es'

export default {
  name: 'RoleAuthForm',
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
        treeList: roleUrl.treeList,
        rolePermissionList: permissionUrl.permissionList,
        saveRolePermission: permissionUrl.saveRolePermission,
      },
      ruleForm: {
        permissionIds: [],
      },
      rules: {
        permissionIds: [
          {
            type: 'array',
            required: false,
            min: 1,
            message: '请选择角色权限',
            trigger: 'change',
          },
        ],
      },
      permissionData: [],
      permissionTreeProps: {
        label: 'slotTitle',
        children: 'children',
      },
      loading: false,
      lastpermissionIds: [],
    }
  },
  created() {
    // load permissionData
    this.$http.get(this.url.treeList).then((res) => {
      this.permissionData = res.result.treeList || []
    })

    this.modelToForm().then((data) => {
      // 重置用
      this.ruleFormReset = cloneDeep(data)
      this.ruleForm = data
      this.lastpermissionIds = cloneDeep(this.ruleForm.permissionIds)
      this.setCheckedKeys(this.ruleForm.permissionIds)
    })
  },
  methods: {
    localHttp() {
      return this.$http.post(this.url.saveRolePermission, this.formToFormData())
    },
    manualReset() {
      this.setCheckedKeys(this.ruleForm.permissionIds)
    },
    // 表单组件数据转化为待提交表单数据
    formToFormData() {
      const keys = this.getTreeInstance().getCheckedKeys()
      return {
        roleId: this.model.id,
        permissionIds: keys.join(','),
        lastpermissionIds: this.lastpermissionIds.join(','),
      }
    },

    // 原始数据转化为表单组件所需数据
    modelToForm() {
      let form = { ...this.ruleForm }

      if (this.model.id) {
        return this.$http
          .get(this.url.rolePermissionList, {
            roleId: this.model.id,
          })
          .then((res) => {
            if (res.result) {
              form.permissionIds = res.result
            }
            return form
          })
      }
      return Promise.reject()
    },
    setCheckedKeys(keys) {
      this.getTreeInstance().setCheckedKeys(keys)
    },
    getTreeInstance() {
      return this.$refs.permissionTree.getTreeInstance()
    },
  },
}
</script>

<style></style>
