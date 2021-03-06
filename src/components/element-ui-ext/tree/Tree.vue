<script>
import { NAME_PREFIX } from '../../const/common'
import { Tree, Input } from 'element-ui'
import ScrollContainer from '../scroll-container'

export default {
  name: `${NAME_PREFIX}Tree`,
  components: {
    ScrollContainer,
  },
  props: {
    searchable: {
      type: Boolean,
      default: false,
    },
    popover: {
      type: Boolean,
      default: false,
    },
    searcherSize: Input.props.size,
    ...Tree.props,
  },
  data() {
    return {
      filterText: '',
      localDefaultExpandAll: true,
      localCheckStrictly: this.checkStrictly,
      checkAll: false,
    }
  },
  computed: {
    localProps() {
      const props = { ...this.$props }
      delete props.searchable
      delete props.popover
      delete props.searcherSize
      for (const [k, v] of Object.entries(props)) {
        if (v == null) {
          delete props[k]
        }
      }

      delete props.checkStrictly
      props.checkStrictly = this.localCheckStrictly
      props.filterNodeMethod = this.filterNode

      return {
        props: props,
        attrs: this.attrs,
        on: this.$listeners,
        scopedSlots: this.$scopedSlots,
      }
    },
  },
  watch: {
    filterText(val) {
      this.$refs.vTree.filter(val)
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data[this.props.label].indexOf(value) !== -1
    },
    getTreeInstance() {
      return this.$refs.vTree
    },
    expandOrFold() {
      this.localDefaultExpandAll = !this.localDefaultExpandAll
      Object.values(this.$refs.vTree.store.nodesMap).forEach((node) => {
        if (this.localDefaultExpandAll) {
          node.expand(null, this.autoExpandParent)
        } else {
          node.collapse()
        }
      })
    },
    selectConnection() {
      this.localCheckStrictly = !this.localCheckStrictly
      if (this.localCheckStrictly) {
        this.$message.warning('上下级选择已取消关联，快勾选试试效果吧')
      } else {
        this.$message.success('上下级选择已关联，快勾选试试效果吧')
      }
      this.$nextTick(() => {
        this.$refs.vTree.setCheckedKeys(this.$refs.vTree.getCheckedKeys())
      })
    },
    checkAllToggle() {
      this.checkAll = !this.checkAll
      let checkKeys
      if (this.checkAll) {
        checkKeys = Object.keys(this.$refs.vTree.store.nodesMap)
      } else {
        checkKeys = []
      }
      this.$refs.vTree.setCheckedKeys(checkKeys)
      this.$emit('check-all-toggle', checkKeys)
    },
  },
  render() {
    let searchVNode
    if (this.searchable) {
      searchVNode = (
        <el-input
          vModel={this.filterText}
          clearable
          size={this.searcherSize}
          placeholder="输入关键字过滤"
          prefixIcon="el-icon-search"
        />
      )
    }

    let operationVNodes = this.popover ? (
      <el-dropdown hideOnClick={false}>
        <el-button type="text" icon="el-icon-menu">
          功能
        </el-button>

        <el-dropdown-menu slot="dropdown">
          {this.showCheckbox
            ? [
                <el-dropdown-item
                  icon="el-icon-circle-check"
                  {...{
                    nativeOn: {
                      click: this.checkAllToggle,
                    },
                  }}
                >
                  全选/反选
                </el-dropdown-item>,
                <el-dropdown-item
                  icon="el-icon-connection"
                  {...{
                    nativeOn: {
                      click: this.selectConnection,
                    },
                  }}
                >
                  关联选择
                </el-dropdown-item>,
              ]
            : void 0}
          <el-dropdown-item
            icon="el-icon-files"
            {...{
              nativeOn: {
                click: this.expandOrFold,
              },
            }}
          >
            折叠/展开
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    ) : (
      [
        this.showCheckbox
          ? [
              <el-button
                type="text"
                icon="el-icon-circle-check"
                {...{
                  on: {
                    click: this.checkAllToggle,
                  },
                }}
              >
                全选/反选
              </el-button>,
              <el-button
                type="text"
                icon="el-icon-connection"
                {...{
                  on: {
                    click: this.selectConnection,
                  },
                }}
              >
                关联选择
              </el-button>,
            ]
          : void 0,
        <el-button
          type="text"
          icon="el-icon-files"
          {...{
            on: {
              click: this.expandOrFold,
            },
          }}
        >
          折叠/展开
        </el-button>,
      ]
    )

    let headerVNode = (
      <div class="v-tree__header">
        {searchVNode}
        {operationVNodes}
      </div>
    )

    return (
      <div class="v-tree">
        {headerVNode}
        <div class="v-tree__body">
          <ScrollContainer>
            <el-tree ref="vTree" {...this.localProps}></el-tree>
          </ScrollContainer>
        </div>
      </div>
    )
  },
}
</script>

<style lang="scss" scoped>
.v-tree {
  display: flex;
  flex-flow: column nowrap;

  border: 1px solid #dcdfe6;
}

.v-tree__header {
  flex: none;
  display: flex;
  overflow: hidden;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
  padding-right: 18px;

  ::v-deep .el-input {
    flex: 1;
    .el-input__inner {
      border: none;
    }
  }
}

.v-tree__body {
  height: 100%;
  flex: 1;
  overflow: hidden;
}
</style>
