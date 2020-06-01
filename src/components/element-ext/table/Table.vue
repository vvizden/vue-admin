<script>
import { Table } from 'element-ui'
import { NAME_PREFIX } from '../../const/common'

function generateColVNodes(columns) {
  // eslint-disable-next-line
  let h = this.$createElement
  const colVNodes = []
  for (const col of columns) {
    const { children, ...colOtherProps } = col
    // 处理key
    if (!Object.prototype.hasOwnProperty.call(colOtherProps, 'key')) {
      colOtherProps.key = colOtherProps.prop
    }

    const colScopedSlots = {}
    let innerColVNodes
    if (children) {
      innerColVNodes = generateColVNodes.call(this, children)
    } else {
      if (col.scopedSlots) {
        let defaultName
        let headerName
        if (typeof col.scopedSlots == 'boolean') {
          defaultName = col.prop
          headerName = `${col.prop}-header`
        } else {
          defaultName = col.scopedSlots.default
          headerName = col.scopedSlots.header
        }

        if (defaultName) {
          colScopedSlots.default = this.$scopedSlots[defaultName]
        }
        if (headerName) {
          colScopedSlots.header = this.$scopedSlots[headerName]
        }
      }
    }

    const colData = {
      key: colOtherProps.key,
      props: colOtherProps,
      scopedSlots: colScopedSlots,
    }

    colVNodes.push(
      <el-table-column {...colData}>{innerColVNodes}</el-table-column>,
    )
  }
  return colVNodes
}

export default {
  name: `${NAME_PREFIX}Table`,
  inheritAttrs: false,
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    tableStyle: {
      type: Object,
      default: () => ({}),
    },
    ...Table.props,
  },
  data() {
    return {}
  },
  computed: {
    tableProps() {
      // eslint-disable-next-line
      const { columns, tableStyle, ...otherProps } = this.$props
      for (const [k, v] of Object.entries(otherProps)) {
        if (v == null) {
          delete otherProps[k]
        }
      }

      return {
        attrs: this.$attrs,
        props: otherProps,
        on: this.$listeners,
        style: { width: '100%', ...tableStyle },
      }
    },
  },
  // eslint-disable-next-line
  render(h) {
    let childVNodes = []

    const columnVNodes = generateColVNodes.call(this, this.columns)
    childVNodes.push(<template slot="default">{columnVNodes}</template>)

    const appendVNode = this.$scopedSlots.append && this.$scopedSlots.append()
    if (appendVNode) {
      childVNodes.push(<template slot="append">{appendVNode}</template>)
    }

    return (
      <div>
        <el-table {...this.tableProps}>{childVNodes}</el-table>
      </div>
    )
  },
}
</script>

<style></style>
