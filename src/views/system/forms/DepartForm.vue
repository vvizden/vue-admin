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
    <el-form-item label="名称" prop="departName">
      <el-input
        v-model.trim="ruleForm.departName"
        placeholder="请填写组织机构名称"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item
      v-if="ruleForm.orgCategory !== '1'"
      label="上级"
      prop="parentId"
      :required="ruleForm.orgCategory !== '1'"
    >
      <el-cascader
        v-model="ruleForm.parentId"
        placeholder="请选择上级组织结构"
        :options="deptTreeList"
        :props="{
          checkStrictly: true,
          expandTrigger: 'hover',
          emitPath: false,
          label: 'title',
        }"
        clearable
        style="width: 100%;"
      ></el-cascader>
    </el-form-item>

    <el-form-item label="类型" prop="orgCategory">
      <v-auto-radio
        v-model="ruleForm.orgCategory"
        dictCode="org_category"
        :optionsFilter="optionsFilter"
      ></v-auto-radio>
    </el-form-item>

    <el-form-item label="电话" prop="mobile">
      <el-input
        v-model.trim="ruleForm.mobile"
        placeholder="请填写电话"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="传真" prop="fax">
      <el-input
        v-model.trim="ruleForm.fax"
        placeholder="请填写传真"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="地址" prop="address">
      <el-input
        v-model.trim="ruleForm.address"
        placeholder="请填写地址"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="排序" prop="departOrder">
      <el-input-number
        v-model="ruleForm.departOrder"
        :min="0"
        :precision="2"
        controls-position="right"
      ></el-input-number>
    </el-form-item>

    <el-form-item label="备注" prop="memo">
      <el-input
        v-model.trim="ruleForm.memo"
        placeholder="请填写备注"
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
import { departUrl } from '@/api/url'
import { FormMixin } from '@/mixins'
import { cloneDeep, pickBy } from 'lodash-es'

export default {
  name: 'DepartForm',
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
        edit: departUrl.edit,
        create: departUrl.create,
        simpleTreeList: departUrl.simpleTreeList,
      },
      ruleForm: {
        departName: '',
        parentId: '',
        orgCategory: '1',
        mobile: '',
        fax: '',
        address: '',
        departOrder: 1,
        memo: '',
      },
      rules: {
        departName: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写组织机构名称',
            trigger: ['change', 'blur'],
          },
        ],
        parentId: [
          {
            validator: this.validateParentId,
            trigger: 'change',
          },
        ],
        orgCategory: [
          {
            type: 'enum',
            required: true,
            enum: ['1', '2', '3'],
            message: '请选择组织机构类型',
            trigger: 'change',
          },
          {
            validator: this.validateOrgCategory,
            trigger: 'change',
          },
        ],
        mobile: [
          {
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            whitespace: true,
            message: '电话格式错误',
            trigger: 'blur',
          },
        ],
        departOrder: [
          {
            type: 'number',
            required: true,
            min: 0,
            message: '请填写排序',
            trigger: ['change', 'blur'],
          },
        ],
      },

      // 表单提交loading
      loading: false,

      deptTreeList: [],
    }
  },
  created() {
    this.$http.get(this.url.simpleTreeList).then((res) => {
      this.deptTreeList = res.result || []
    })

    const data = this.modelToForm()
    // 重置用
    this.ruleFormReset = cloneDeep(data)
    this.ruleForm = data
  },
  methods: {
    optionsFilter(options) {
      if (this.model.parentId) {
        return options.filter((e) => e.value !== '1')
      } else {
        if (this.model.id) {
          return options
        } else {
          return options.filter((e) => e.value === '1')
        }
      }
    },
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
        return Object.prototype.hasOwnProperty.call(this.ruleForm, k)
      })

      resultData = cloneDeep(resultData)
      if (this.model.parentId) {
        resultData.orgCategory = '2'
      }
      // 填充表单
      resultData = Object.assign({}, this.ruleForm, resultData)
      return resultData
    },
    validateParentId(rule, value, cb) {
      if (typeof value != 'string') {
        cb('数据类型错误')
      } else {
        const isCompany = this.ruleForm.orgCategory === '1'
        const valueTrim = value.trim()
        if (isCompany) {
          if (value) {
            cb('上级组织机构不合法')
          } else {
            cb()
          }
        } else {
          if (!value || !valueTrim) {
            cb('请选择上级组织机构')
          } else {
            cb()
          }
        }
      }
    },
    validateOrgCategory(rule, value, cb) {
      if (value !== '1') {
        this.$refs.ruleForm.validateField('parentId')
      }
      cb()
    },
  },
}
</script>
