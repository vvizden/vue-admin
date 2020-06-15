<template>
  <div class="app-container">
    <!-- 筛选条件部分 -->
    <el-form
      ref="filterForm"
      :model="filterParams"
      inline
      label-width="auto"
      class="filter-container"
    >
      <el-form-item label="角色名称：" prop="roleName" class="filter-item">
        <el-input
          v-model="filterParams.roleName"
          placeholder="角色名称"
          clearable
          style="width: 180px"
        ></el-input>
      </el-form-item>

      <!-- 查询和重置 -->
      <el-form-item class="filter-item">
        <el-button type="primary" icon="el-icon-search" @click="loadData">
          查询
        </el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-refresh-left"
          @click="handleResetClick('filterForm')"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>

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

          <el-button
            type="primary"
            plain
            icon="el-icon-download"
            @click="exportXls('角色列表')"
          >
            导出
          </el-button>

          <!-- <el-popconfirm
            v-if="selectedRows.length > 0"
            cancelButtonType="default"
            title="确定删除吗？"
            style="margin-left: 10px;"
            @onConfirm="handleDeleteBatchClick"
          >
            <el-button
              slot="reference"
              type="primary"
              plain
              icon="el-icon-delete"
            >
              批量删除
            </el-button>
          </el-popconfirm> -->
        </div>
      </template>
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

      <!-- 自定义操作列内容，需要配合 scopedSlots: true -->
      <template #action="{ row }">
        <el-button
          type="text"
          icon="el-icon-edit-outline"
          @click.stop="handleEditClick(row)"
          >编辑</el-button
        >
        <el-divider direction="vertical" />
        <el-dropdown :hide-on-click="false">
          <el-button type="text">
            更多
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button
                type="text"
                icon="el-icon-menu"
                @click="handleAuthClick(row)"
              >
                授权
              </el-button>
            </el-dropdown-item>
            <el-popconfirm
              :visible-arrow="false"
              placement="left-end"
              cancelButtonType="default"
              title="确定删除吗？"
              @onConfirm="handleDeleteClick(row.id)"
            >
              <el-dropdown-item slot="reference">
                <el-button type="text" icon="el-icon-delete">
                  删除
                </el-button>
              </el-dropdown-item>
            </el-popconfirm>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </v-table>
    <!-- 分页 -->
    <v-pagination
      :total="pagination.total"
      :page.sync="pagination.page"
      :limit.sync="pagination.limit"
      @pagination="loadData"
    />
    <!-- 弹窗表单 -->
    <el-dialog
      :title="formContainerTitle"
      top="6vh"
      width="70%"
      :visible.sync="formContainerVisible"
      @closed="handleFormContainerClosed"
    >
      <v-scroll-container class="dialog-inner" v-if="formContainerInnerVisible">
        <!-- 表单组件，存放于同级forms目录下 -->
        <RoleUserForm :model="editRow" @ok="handleFormOk" />
      </v-scroll-container>
    </el-dialog>

    <!-- 弹窗授权 -->
    <el-dialog
      title="授权"
      top="6vh"
      width="800px"
      :visible.sync="authContainerVisible"
      @closed="handleAuthContainerClosed"
    >
      <v-scroll-container class="dialog-inner" v-if="authContainerInnerVisible">
        <!-- 授权组件，存放于同级forms目录下 -->
        <RoleAuthForm :model="authRow" @ok="handleRoleAuthFormOk" />
      </v-scroll-container>
    </el-dialog>
  </div>
</template>

<script>
import { PageTableMixin, CurdMixin, ExportMixin } from '@/mixins'
import { roleUrl } from '@/api/url'

export default {
  name: 'RoleUserList',
  mixins: [PageTableMixin, CurdMixin, ExportMixin],
  components: {
    RoleUserForm: () =>
      import(/* webpackChunkName: "system" */ './forms/RoleUserForm'),
    RoleAuthForm: () =>
      import(/* webpackChunkName: "system" */ './forms/RoleAuthForm'),
  },
  data() {
    return {
      url: { data: roleUrl.page, delete: roleUrl.delete },
      // begin ----> table
      columns: [
        {
          label: '多选',
          prop: 'selection',
          type: 'selection',
          align: 'center',
        },
        {
          label: '角色编码',
          prop: 'roleCode',
          align: 'center',
        },
        {
          label: '角色名称',
          prop: 'roleName',
          align: 'center',
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
        },
        {
          label: '操作',
          prop: 'action',
          align: 'center',
          width: '140px',
          scopedSlots: true,
        },
      ],
      sortord: {
        column: 'createTime',
        order: 'desc',
      },
      // 表格列控制参数
      columnsCtrl: {
        props: {
          placement: 'bottom-end',
          visibleArrow: false,
        },
      },
      // end <---- table
      authContainerVisible: false,
      authContainerInnerVisible: true,
      authRow: {},
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    handleAuthClick(row) {
      this.authRow = row
      this.authContainerInnerVisible = true
      this.$nextTick(() => {
        this.authContainerVisible = true
      })
    },
    handleAuthContainerClosed() {
      this.authContainerInnerVisible = false
    },
    handleRoleAuthFormOk() {
      this.authContainerVisible = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
