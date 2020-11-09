<script>
import { NAME_PREFIX } from '../const/common'
import { Select } from 'element-ui'
import { mapState } from 'vuex'
import { dictUrl } from '@/api/url'
import { cloneDeep } from 'lodash-es'

function getOptionProps() {
  return {
    key: 'key',
    value: 'value',
    label: 'label',
    disabled: 'disabled',
  }
}

export default {
  name: `${NAME_PREFIX}AutoSelect`,
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    dictCode: {
      type: String,
      required: false,
    },
    api: {
      type: String,
      required: false,
    },
    apiParams: {
      type: Object,
      required: false,
    },
    optionProps: {
      type: Object,
      default: () => getOptionProps(),
    },
    optionsFilter: {
      type: Function,
      default: (options) => options,
    },
    ...Select.props,
  },
  data() {
    return {
      options: [],
    }
  },
  computed: {
    ...mapState('app', {
      dict: (state) => {
        return cloneDeep(state.dict)
      },
    }),
    localProps() {
      const props = { ...this.$props }
      delete props.dictCode
      delete props.api
      delete props.apiParams
      delete props.optionProps
      delete props.optionsFilter
      for (const [k, v] of Object.entries(props)) {
        if (v == null && k !== 'value') {
          delete props[k]
        }
      }

      return {
        props: props,
        on: {
          change: (val) => {
            this.$emit('change', val)
          },
        },
      }
    },
    localOptionProps() {
      return Object.assign(getOptionProps(), this.optionProps)
    },
  },
  created() {
    this.loadOptions()
  },
  methods: {
    loadOptions() {
      if (this.dictCode) {
        if (this.dict && !this.dictCode.includes(',')) {
          this.options = this.optionsFilter(this.dict[this.dictCode] || []).map(
            (e) => {
              e.label = e.text
              return e
            },
          )
        } else {
          this.$http
            .get(`${dictUrl.listByCode}/${this.dictCode}`)
            .then((res) => {
              this.options = this.optionsFilter(res.result || []).map((e) => {
                e.label = e.text
                return e
              })
            })
        }
      } else if (this.api) {
        this.$http.get(this.api, this.apiParams || {}).then((res) => {
          this.options = this.optionsFilter(res.result || [])
        })
      }
    },
  },
  render() {
    let optionVNodes = this.options.map((e) => {
      return (
        <el-option
          key={e[this.localOptionProps.key] || e[this.localOptionProps.value]}
          value={e[this.localOptionProps.value]}
          label={e[this.localOptionProps.label]}
          disabled={e[this.localOptionProps.disabled]}
        >
          {this.$scopedSlots.option && this.$scopedSlots.option(e)}
        </el-option>
      )
    })

    if (!optionVNodes || optionVNodes.length === 0) {
      optionVNodes = this.$scopedSlots.default && this.$scopedSlots.default()
    }

    return <el-select {...this.localProps}>{optionVNodes}</el-select>
  },
}
</script>
