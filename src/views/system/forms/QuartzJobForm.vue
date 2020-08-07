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
    <el-form-item label="任务类名" prop="jobClassName">
      <el-input
        v-model.trim="ruleForm.jobClassName"
        placeholder="请填写任务类名"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="cron表达式" prop="cronExpression">
      <el-input
        v-model.trim="ruleForm.cronExpression"
        placeholder="请填写cron表达式"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="参数" prop="parameter">
      <el-input
        v-model.trim="ruleForm.parameter"
        placeholder="请填写cron表达式"
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

    <el-form-item label="状态" prop="status">
      <!-- <v-auto-radio
        v-model="ruleForm.status"
        dictCode="quartz_status"
      ></v-auto-radio> -->

      <el-switch
        v-model="ruleForm.status"
        :width="54"
        :active-value="0"
        :inactive-value="-1"
        active-text="启动"
        inactive-text="停止"
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
import { quartzJobUrl } from '@/api/url'
import { FormMixin } from '@/mixins'
import { cloneDeep, pickBy } from 'lodash-es'

export default {
  name: 'QuartzJobForm',
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
        create: quartzJobUrl.create,
        edit: quartzJobUrl.edit,
      },
      ruleForm: {
        jobClassName: '',
        cronExpression: '',
        parameter: '',
        description: '',
        status: 0,
      },
      rules: {
        jobClassName: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写任务类名',
            trigger: ['change', 'blur'],
          },
          {
            pattern: /[^\u4E00-\u9FA5]/g,
            message: '任务类名不可输入汉字',
            trigger: ['change', 'blur'],
          },
        ],
        cronExpression: [
          {
            type: 'string',
            required: true,
            whitespace: true,
            message: '请填写cron表达式',
            trigger: ['change', 'blur'],
          },
          {
            pattern: /[^\u4E00-\u9FA5]/g,
            message: 'cron表达式不可输入汉字',
            trigger: ['change', 'blur'],
          },
        ],
        parameter: [
          {
            type: 'string',
            required: false,
            whitespace: true,
            message: '请填写参数',
            trigger: ['change', 'blur'],
          },
        ],
        description: [
          {
            type: 'string',
            required: false,
            whitespace: true,
            message: '请填写描述',
            trigger: ['change', 'blur'],
          },
        ],
        status: [
          {
            type: 'enum',
            required: true,
            enum: [0, -1],
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
        return (
          Object.prototype.hasOwnProperty.call(this.ruleForm, k) && v != null
        )
      })

      resultData = cloneDeep(resultData)
      // 填充表单
      resultData = Object.assign({}, this.ruleForm, resultData)
      return resultData
    },
  },
}
</script>
