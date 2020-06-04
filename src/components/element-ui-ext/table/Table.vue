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

function deepFlatCols(array) {
  let result = []
  for (const item of array) {
    if (item.children) {
      result = result.concat(deepFlatCols(item.children))
    } else {
      result.push({
        key: item.prop,
        value: item.label,
      })
    }
  }
  return result
}

function filterCols(array, filters) {
  let result = []
  for (const item of array) {
    if (item.children) {
      const childrenCols = filterCols(item.children, filters)
      if (childrenCols.length > 0) {
        result.push({ ...item, children: childrenCols })
      }
    } else {
      const has = filters.some((f) => f === item.prop)
      if (has) {
        result.push({ ...item })
      }
    }
  }
  return result
}

export default {
  name: `${NAME_PREFIX}Table`,
  // inheritAttrs: false,
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    tableStyle: {
      type: Object,
      default: () => ({}),
    },
    columnsCtrl: {
      type: [Object, Boolean],
      default: false,
    },
    ...Table.props,
  },
  data() {
    return {
      currentColumns: this.columns,
      checkboxVal: null,
      tableKey: String(Date.now()),
    }
  },
  computed: {
    columnsCheckGroup() {
      const result = deepFlatCols(this.columns)
      return result
    },
    defaultColumnsCheckVal() {
      return this.columnsCheckGroup.map((e) => e.key)
    },
    columnsCheckVal: {
      get() {
        return this.checkboxVal || this.defaultColumnsCheckVal
      },
      set(val) {
        this.checkboxVal = val
      },
    },
    tableProps() {
      /* eslint-disable no-unused-vars */
      const { columns, tableStyle, columnsCtrl, ...otherProps } = this.$props
      /* eslint-disable no-unused-vars */
      for (const [k, v] of Object.entries(otherProps)) {
        if (v == null) {
          delete otherProps[k]
        }
      }

      return {
        key: this.tableKey,
        // attrs: this.$attrs,
        props: otherProps,
        on: this.$listeners,
        style: { width: '100%', ...tableStyle },
      }
    },
    customPopoverProps() {
      const props = {
        placement: 'left',
        width: '160',
        trigger: 'click',
      }

      if (this.columnsCtrl) {
        return {
          ...this.columnsCtrl,
          props: {
            ...props,
            ...this.columnsCtrl.props,
          },
        }
      }

      return {}
    },
  },
  watch: {
    columnsCheckVal(val) {
      this.currentColumns = filterCols(this.columns, val)
      this.tableKey = String(Date.now())
    },
  },
  // eslint-disable-next-line
  render(h) {
    let childVNodes = []

    const columnVNodes = generateColVNodes.call(this, this.currentColumns)
    childVNodes.push(<template slot="default">{columnVNodes}</template>)

    const appendVNode = this.$scopedSlots.append && this.$scopedSlots.append()
    if (appendVNode) {
      childVNodes.push(<template slot="append">{appendVNode}</template>)
    }

    let operationVNodes = []

    if (this.$scopedSlots.operation) {
      operationVNodes.push(this.$scopedSlots.operation())
    }

    if (this.columnsCtrl) {
      const colCheckBoxes = this.columnsCheckGroup.map((checkbox) => {
        return (
          <el-checkbox key={checkbox.key} label={checkbox.key}>
            {checkbox.value}
          </el-checkbox>
        )
      })

      const popoverVNode = (
        <el-popover class="columns-ctrl" {...this.customPopoverProps}>
          <el-checkbox-group vModel={this.columnsCheckVal} min={1} size="mini">
            {colCheckBoxes}
          </el-checkbox-group>
          <el-button
            {...{
              slot: 'reference',
              props: {
                type: 'primary',
                plain: true,
                icon: 'el-icon-more',
              },
              attrs: {
                title: '隐藏列',
              },
            }}
          >
            {this.columnsCtrlText}
          </el-button>
        </el-popover>
      )

      operationVNodes.push(popoverVNode)
    }

    if (operationVNodes.length > 0) {
      operationVNodes = <div class="table-operation">{operationVNodes}</div>
    }

    return (
      <div class="table-plus">
        {operationVNodes}
        <el-table {...this.tableProps}>{childVNodes}</el-table>
      </div>
    )
  },
}
</script>

<style lang="scss" scoped>
.table-plus {
  .table-operation {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 8px;

    .columns-ctrl {
      margin-left: 8px;
    }
  }
}

.el-checkbox-group ::v-deep {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .el-checkbox:last-of-type {
    margin-right: 30px;
  }
}
</style>
