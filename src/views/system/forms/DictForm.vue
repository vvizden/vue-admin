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
    <el-form-item label="字典编码" prop="dictCode">
      <el-input
        v-model.trim="ruleForm.dictCode"
        placeholder="请填写字典编码"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="字典名称" prop="dictName">
      <el-input
        v-model.trim="ruleForm.dictName"
        placeholder="请填写字典名称"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="描述" prop="description">
      <el-input
        v-model.trim="ruleForm.description"
        placeholder="请填写描述"
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
import { dictUrl } from '@/api/url'
import { FormMixin } from '@/mixins'
import { duplicationCheck } from '@/api/util'
import { cloneDeep, pickBy } from 'lodash-es'

export default {
  name: 'DictForm',
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
        edit: dictUrl.edit,
        create: dictUrl.create,
      },
      ruleForm: {
        dictCode: '',
        dictName: '',
        description: '',
      },
      rules: {
        dictCode: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写字典编码',
            trigger: ['change', 'blur'],
          },
          {
            pattern: /[^\u4E00-\u9FA5]/g,
            message: '字典编码不可输入汉字',
            trigger: ['change', 'blur'],
          },
          {
            validator: this.validateDictCode,
            trigger: 'blur',
          },
        ],
        dictName: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写字典名称',
            trigger: ['change', 'blur'],
          },
        ],
        description: [
          {
            min: 0,
            max: 126,
            message: '不可超过 126 个字符',
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

    validateDictCode(rule, value, callback) {
      if (!value) {
        return callback()
      }

      const params = {
        tableName: 'sys_dict',
        fieldName: 'dict_code',
        fieldVal: value,
        dataId: this.model.id,
      }

      duplicationCheck(params).then((pass) => {
        if (pass) {
          callback()
        } else {
          callback('该字典编码已存在，请重新填写')
        }
      })
    },
  },
}
</script>
