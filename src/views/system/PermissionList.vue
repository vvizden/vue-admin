<template>
  <div class="app-container">
    <!-- 筛选条件部分 -->

    <!-- el-table扩展组件，支持自定义展示隐藏列 -->
    <v-table
      v-loading="loading"
      element-loading-text="正在加载..."
      element-loading-custom-class="custom-loading"
      :columns="columns"
      :data="tableData"
      :row-key="rowKey"
      border
      highlight-current-row
      height="100%"
      class="table-border--hidden"
      :columns-ctrl="columnsCtrl"
      @selection-change="handleSelectionChange"
    >
      <!-- 操作区域，如创建，导出，批量删除 -->
      <template #operation>
        <div style="width: 100%;">
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="handleCreateClick"
          >
            创建
          </el-button>

          <!-- <el-button
            type="primary"
            plain
            icon="el-icon-download"
            @click="exportXls('权限列表')"
          >
            导出
          </el-button> -->

          <el-popconfirm
            cancelButtonType="default"
            title="确定删除吗？"
            style="margin-left: 10px;"
            @onConfirm="handleDeleteBatchClick"
          >
            <el-button
              :disabled="selectedRows.length === 0"
              slot="reference"
              type="primary"
              plain
              icon="el-icon-delete"
            >
              批量删除
            </el-button>
          </el-popconfirm>
        </div>
      </template>
      <!-- begin 视情况修改!! -->
      <!-- 自定义列内容，需要配合 scopedSlots: true -->
      <template #avatar="{ row }">
        <el-avatar
          size="small"
          fit="scale-down"
          :src="row.avatar | staticFilter"
          icon="el-icon-user-solid"
          style="vertical-align: middle;"
        ></el-avatar>
      </template>
      <!-- end 视情况修改!! -->

      <!-- 自定义操作列内容，需要配合 scopedSlots: true -->
      <template #action="{ row }">
        <el-button
          type="text"
          icon="el-icon-edit-outline"
          @click.stop="handleEditClick(row)"
          >编辑</el-button
        >
        <el-divider direction="vertical" />
        <el-popconfirm
          cancelButtonType="default"
          title="确定删除吗？"
          @onConfirm="handleDeleteClick(row)"
        >
          <el-button slot="reference" type="text" icon="el-icon-delete"
            >删除</el-button
          >
        </el-popconfirm>
      </template>
    </v-table>

    <!-- 弹窗表单 -->
    <el-dialog
      v-el-dialog-drag
      :title="formContainerTitle"
      top="6vh"
      width="800px"
      :visible.sync="formContainerVisible"
      @closed="handleFormContainerClosed"
    >
      <v-scroll-container class="dialog-inner" v-if="formContainerInnerVisible">
        <!-- 表单组件，存放于同级forms目录下 -->
        <PermissionForm :model="editRow" @ok="handleFormOk" />
      </v-scroll-container>
    </el-dialog>
  </div>
</template>

<script>
import { TableMixin, CurdMixin } from '@/mixins'
import { permissionUrl } from '@/api/url'

export default {
  name: 'PermissionList',
  mixins: [TableMixin, CurdMixin],
  components: {
    PermissionForm: () =>
      import(/* webpackChunkName: "system" */ './forms/PermissionForm'),
  },
  data() {
    return {
      url: {
        data: permissionUrl.list,
        delete: permissionUrl.delete,
        deleteBatch: permissionUrl.deleteBatch,
      },

      // 表格列
      columns: [
        {
          label: '多选',
          prop: 'selection',
          type: 'selection',
          align: 'center',
        },
        {
          label: '菜单名称',
          prop: 'name',
          align: 'left',
        },
        {
          label: '菜单类型',
          prop: 'menuType',
          align: 'left',
          formatter: function(row, column, value) {
            if (value == 0) {
              return '菜单'
            } else if (value == 1) {
              return '菜单'
            } else if (value == 2) {
              return '按钮/权限'
            } else {
              return value
            }
          },
        },
        {
          label: 'icon',
          prop: 'icon',
          align: 'left',
        },
        {
          label: '组件',
          prop: 'component',
          align: 'left',
          showOverflowTooltip: true,
        },
        {
          label: '路径',
          prop: 'url',
          align: 'left',
          showOverflowTooltip: true,
        },
        {
          label: '排序',
          prop: 'sortNo',
          align: 'left',
        },
        {
          label: '操作',
          prop: 'action',
          align: 'center',
          width: '140px',
          scopedSlots: true,
        },
      ],

      // 表格列控制参数
      columnsCtrl: {
        props: {
          placement: 'bottom-end',
          visibleArrow: false,
        },
      },
    }
  },
  mounted() {
    this.loadData()
  },
}
</script>
