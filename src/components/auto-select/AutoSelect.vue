<script>
import { NAME_PREFIX } from '../const/common'
import { Select } from 'element-ui'
import { mapState } from 'vuex'
import { dictUrl } from '@/api/url'
import { cloneDeep } from 'lodash-es'

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
  },
  created() {
    this.loadOptions()
  },
  methods: {
    loadOptions() {
      if (this.dictCode) {
        if (this.dict && !this.dictCode.includes(',')) {
          this.options = this.optionsFilter(this.dict[this.dictCode])
        } else {
          this.$http
            .get(`${dictUrl.listByCode}/${this.dictCode}`)
            .then((res) => {
              this.options = this.optionsFilter(res.result || [])
            })
        }
      }
    },
  },
  render() {
    let optionVNodes = this.options.map((e) => {
      return (
        <el-option
          key={e.value}
          value={e.value}
          label={e.text}
          disabled={e.disabled}
        ></el-option>
      )
    })

    if (!optionVNodes || optionVNodes.length === 0) {
      optionVNodes = this.$scopedSlots.default && this.$scopedSlots.default()
    }

    return <el-select {...this.localProps}>{optionVNodes}</el-select>
  },
}
</script>
