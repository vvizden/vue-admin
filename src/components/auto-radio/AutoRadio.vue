<script>
import { NAME_PREFIX } from '../const/common'
import { RadioGroup } from 'element-ui'
import { mapState } from 'vuex'
import { dictUrl } from '@/api/url'
import { cloneDeep } from 'lodash-es'

export default {
  name: `${NAME_PREFIX}AutoRadio`,
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    button: {
      type: Boolean,
      default: false,
    },
    dictCode: {
      type: String,
      required: false,
    },
    optionsFilter: {
      type: Function,
      default: (options) => options,
    },
    ...RadioGroup.props,
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
      delete props.button
      delete props.dictCode
      for (const [k, v] of Object.entries(props)) {
        if (v == null) {
          delete props[k]
        }
      }

      return {
        props: props,
        on: {
          input: (val) => {
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
          this.$http.get(`${dictUrl}/${this.dictCode}`).then((res) => {
            this.options = this.optionsFilter(res.result || [])
          })
        }
      }
    },
  },
  render() {
    let radioVNodes
    if (this.button) {
      radioVNodes = this.options.map((e) => {
        return (
          <el-radio-button key={e.value} label={e.value} disabled={e.disabled}>
            {e.text}
          </el-radio-button>
        )
      })
    } else {
      radioVNodes = this.options.map((e) => {
        return (
          <el-radio key={e.value} label={e.value}>
            {e.text}
          </el-radio>
        )
      })
    }

    if (!radioVNodes || radioVNodes.length === 0) {
      radioVNodes = this.$scopedSlots.default && this.$scopedSlots.default()
    }

    return <el-radio-group {...this.localProps}>{radioVNodes}</el-radio-group>
  },
}
</script>

<style></style>
