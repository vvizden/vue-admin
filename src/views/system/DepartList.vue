<template>
  <div class="app-container">
    <div class="table-operation">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="handleCreateClickBefore"
      >
        创建
      </el-button>

      <el-button
        type="primary"
        plain
        icon="el-icon-download"
        @click="exportXls('组织机构列表')"
      >
        导出
      </el-button>

      <el-popconfirm
        v-if="selectedRows.length > 0"
        cancelButtonType="default"
        title="确定删除吗？"
        style="margin-left: 10px;"
        @onConfirm="handleDeleteBatchClick"
      >
        <el-button slot="reference" type="primary" plain icon="el-icon-delete">
          批量删除
        </el-button>
      </el-popconfirm>
    </div>
    <!-- 组织机构树 -->
    <div class="split-container">
      <v-tree
        ref="deptTree"
        :data="deptTreeData"
        searchable
        highlight-current
        show-checkbox
        check-strictly
        :expand-on-click-node="false"
        node-key="value"
        default-expand-all
        :props="deptTreeProps"
        class="split-left"
        @current-change="handleCurrentChange"
        @check="handleCheck"
        @check-all-toggle="handleCheckAllToggle"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span class="custom-tree-node__operation">
            <el-button
              type="text"
              size="mini"
              @click.stop="handleCreateChildClick(data)"
            >
              创建下级
            </el-button>
            <el-divider direction="vertical" />
            <el-popconfirm
              cancelButtonType="default"
              title="确定删除吗？"
              @onConfirm="handleDeleteClick(data.id)"
            >
              <el-button slot="reference" type="text" size="mini">
                删除
              </el-button>
            </el-popconfirm>
          </span>
        </span>
      </v-tree>
      <div class="split-right">
        <h2 class="header">
          <i class="el-icon-tickets el-icon--left"></i>
          {{ infoTitle }}
        </h2>
        <v-scroll-container>
          <DepartForm :model="editRow" :key="formKey" @ok="handleFormOk" />
        </v-scroll-container>
      </div>
    </div>
  </div>
</template>

<script>
import { LoadDataMixin, CurdMixin, ExportMixin } from '@/mixins'
import { deptUrl } from '@/api/url'

export default {
  name: 'DepartList',
  // 注册上面的混入
  mixins: [LoadDataMixin, CurdMixin, ExportMixin],
  components: {
    DepartForm: () =>
      import(/* webpackChunkName: "system" */ './forms/DepartForm'),
  },
  data() {
    return {
      url: {
        data: deptUrl.treeList,
        delete: deptUrl.delete,
        deleteBatch: deptUrl.deleteBatch,
        exportXls: deptUrl.exportXls,
      },
      // 组织机构数据
      deptTreeData: [],
      deptTreeProps: {
        label: 'title',
        children: 'children',
      },
      infoTitle: '基本信息',
    }
  },
  computed: {
    formKey() {
      if (this.editRow.id) {
        return this.editRow.id
      } else {
        if (this.editRow.parentId) {
          return 'create_child'
        } else {
          return 'create_company'
        }
      }
    },
  },
  mounted() {
    this.loadData().then(() => {
      this.$refs.deptTree
        .getTreeInstance()
        .setCurrentKey(this.deptTreeData[0] ? this.deptTreeData[0] : null)

      this.editRow = this.deptTreeData[0] ? this.deptTreeData[0] : {}
      this.infoTitle = `${this.editRow.departName} 基本信息`
    })
  },
  methods: {
    handleCreateClickBefore() {
      this.handleCreateClick()
      this.infoTitle = `创建 公司`
    },
    handleCreateChildClick(data) {
      this.editRow = { parentId: data.id }
      this.infoTitle = `创建 部门 / 岗位`
    },
    handleCheck(data, node) {
      this.handleSelectionChange(node.checkedKeys)
    },
    handleCheckAllToggle(keys) {
      this.handleSelectionChange(keys)
    },
    handleCurrentChange(data) {
      this.editRow = data
      this.infoTitle = `${this.editRow.departName} 基本信息`
    },
    // 处理数据
    dataHandler(data) {
      this.deptTreeData = data
    },
  },
}
</script>

<style lang="scss" scoped>
.split-container {
  height: 100%;
  display: flex;

  .split-left {
    flex: none;
    width: 420px;
    height: 100%;
  }

  .split-right {
    height: 100%;
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    border: 1px solid #dcdfe6;
    border-left: none;
    padding: 0 16px;

    .header {
      margin: 16px 0 24px 0;
      color: #303133;
      font-size: 16px;
      font-weight: 400;
      text-align: center;
      display: block;
    }
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;

    .custom-tree-node__operation {
      display: none;
    }

    &:hover {
      .custom-tree-node__operation {
        display: inline;
      }
    }
  }
}
</style>
