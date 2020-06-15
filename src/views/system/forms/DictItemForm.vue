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
    <el-form-item label="名称" prop="itemText">
      <el-input
        v-model.trim="ruleForm.itemText"
        placeholder="请填写名称"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="数据值" prop="itemValue">
      <el-input
        v-model.trim="ruleForm.itemValue"
        placeholder="请填写数据值"
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

    <el-form-item label="排序" prop="sortOrder">
      <el-input-number
        v-model="ruleForm.sortOrder"
        :min="0"
        :precision="2"
        controls-position="right"
      ></el-input-number>
    </el-form-item>

    <el-form-item label="是否启用" prop="status">
      <el-switch
        v-model="ruleForm.status"
        :width="54"
        active-value="1"
        inactive-value="0"
        active-text="启用"
        inactive-text="禁用"
      >
      </el-switch>
    </el-form-item>

    <!-- 表单提交与重置 -->
    <el-form-item class="form-item-submit">
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { dictItemUrl } from '@/api/url'
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
        edit: dictItemUrl.edit,
        create: dictItemUrl.create,
      },
      ruleForm: {
        itemText: '',
        itemValue: '',
        description: '',
        sortOrder: 1,
        status: '1',
      },
      rules: {
        itemText: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写名称',
            trigger: ['change', 'blur'],
          },
        ],
        itemValue: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写数据值',
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
        sortOrder: [
          {
            type: 'number',
            required: true,
            min: 0,
            message: '请填写排序',
            trigger: ['change', 'blur'],
          },
        ],
        status: [
          {
            type: 'enum',
            required: true,
            enum: ['0', '1'],
            message: '请选择状态',
            trigger: 'change',
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
        return Object.prototype.hasOwnProperty.call(this.ruleForm, k)
      })
      resultData = cloneDeep(resultData)
      if (resultData.status != null) {
        resultData.status = String(resultData.status)
      }
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
