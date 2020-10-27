<template>
  <div class="app-container">
    <el-form
      ref="filterForm"
      :model="filterParams"
      inline
      label-width="auto"
      class="filter-container"
    >
      <el-form-item label="性别：" prop="sex" class="filter-item">
        <el-select
          v-model="filterParams.sex"
          placeholder="性别"
          clearable
          style="width: 140px"
        >
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态：" prop="status" class="filter-item">
        <el-select
          v-model="filterParams.status"
          placeholder="状态"
          clearable
          style="width: 140px"
        >
          <el-option label="正常" :value="1"></el-option>
          <el-option label="冻结" :value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="用户账号：" prop="username" class="filter-item">
        <el-input
          v-model="filterParams.username"
          placeholder="用户账号"
          clearable
          style="width: 140px"
        ></el-input>
      </el-form-item>

      <el-form-item label="用户姓名：" prop="realname" class="filter-item">
        <el-input
          v-model.trim="filterParams.realname"
          placeholder="用户姓名"
          clearable
          style="width: 140px"
        ></el-input>
      </el-form-item>

      <el-form-item label="手机号：" prop="phone" class="filter-item">
        <el-input
          v-model.trim="filterParams.phone"
          placeholder="手机号"
          clearable
          style="width: 140px"
        ></el-input>
      </el-form-item>

      <el-form-item class="filter-item">
        <el-button type="primary" icon="el-icon-search" @click="loadData"
          >查询</el-button
        >
        <el-button
          type="primary"
          plain
          icon="el-icon-refresh-left"
          @click="handleResetClick('filterForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

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
      v-table-cols-cache="'UserList'"
      :columns-ctrl="columnsCtrl"
      @selection-change="handleSelectionChange"
    >
      <template #operation>
        <div style="width: 100%;">
          <el-button
            v-permission="['user:add']"
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="handleCreateClick"
            >创建</el-button
          >

          <el-button
            type="primary"
            plain
            icon="el-icon-download"
            @click="exportXls('用户列表')"
            >导出</el-button
          >

          <el-popconfirm
            v-permission="['user:del:batch']"
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
              >批量删除</el-button
            >
          </el-popconfirm>
        </div>
      </template>
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
          v-permission="['user:edit']"
          type="text"
          icon="el-icon-edit-outline"
          @click.stop="handleEditClick(row)"
          >编辑</el-button
        >

        <el-divider
          v-if="
            checkPermission([
              'user:edit',
              'user:menu:auth',
              'user:password:reset',
              'user:del',
            ])
          "
          direction="vertical"
        />

        <el-dropdown
          v-if="
            checkPermission([
              'user:menu:auth',
              'user:password:reset',
              'user:del',
            ])
          "
          :hide-on-click="false"
        >
          <el-button type="text">
            更多
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-permission="['user:password:reset']">
              <el-button
                type="text"
                icon="el-icon-key"
                @click="handleResetPasswordClick(row)"
                >重置密码</el-button
              >
            </el-dropdown-item>
            <el-popconfirm
              v-permission="['user:del']"
              :visible-arrow="false"
              placement="left-end"
              cancelButtonType="default"
              title="确定删除吗？"
              @onConfirm="handleDeleteClick(row)"
            >
              <el-dropdown-item slot="reference">
                <el-button type="text" icon="el-icon-delete">删除</el-button>
              </el-dropdown-item>
            </el-popconfirm>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </v-table>

    <v-pagination
      :total="pagination.total"
      :page.sync="pagination.page"
      :limit.sync="pagination.limit"
      @pagination="loadData"
    />

    <el-dialog
      v-el-dialog-drag
      :title="formContainerTitle"
      top="6vh"
      width="800px"
      :visible.sync="formContainerVisible"
      @closed="handleFormContainerClosed"
    >
      <v-scroll-container class="dialog-inner" v-if="formContainerInnerVisible">
        <UserForm :model="editRow" @ok="handleFormOk" />
      </v-scroll-container>
    </el-dialog>

    <ResetPasswordModal
      :visible.sync="resetPasswordModalVisible"
      :model="resetPasswordModel"
      @ok="handleResetPasswordOk"
    />
  </div>
</template>

<script>
import { PageTableMixin, CurdMixin, ExportMixin } from '@/mixins'
import { userUrl } from '@/api/url'
import { checkPermission } from '@/utils/permission'

export default {
  name: 'UserList',
  mixins: [PageTableMixin, CurdMixin, ExportMixin],
  components: {
    UserForm: () => import(/* webpackChunkName: "system" */ './forms/UserForm'),
    ResetPasswordModal: () =>
      import(
        /* webpackChunkName: "system" */ './components/ResetPasswordModal'
      ),
  },
  data() {
    const columns = [
      {
        label: '多选',
        prop: 'selection',
        type: 'selection',
        align: 'center',
      },
      {
        label: '用户账号',
        prop: 'username',
        align: 'center',
      },
      {
        label: '用户姓名',
        prop: 'realname',
        align: 'center',
      },
      {
        label: '头像',
        prop: 'avatar',
        align: 'center',
        scopedSlots: true,
      },

      {
        label: '性别',
        prop: 'sex_dictText',
        align: 'center',
      },
      {
        label: '生日',
        prop: 'birthday',
        align: 'center',
      },
      {
        label: '手机号码',
        prop: 'phone',
        align: 'center',
      },
      {
        label: '部门',
        prop: 'orgCode',
        align: 'center',
      },
      {
        label: '状态',
        prop: 'status_dictText',
        align: 'center',
      },
    ]

    if (checkPermission(['user:edit', 'user:password:reset', 'user:del'])) {
      columns.push({
        label: '操作',
        prop: 'action',
        align: 'center',
        width: '140px',
        scopedSlots: true,
      })
    }

    return {
      // 接口url
      url: {
        data: userUrl.page,
        delete: userUrl.delete,
        deleteBatch: userUrl.deleteBatch,
        exportXls: userUrl.exportXls,
      },
      // begin ----> table
      // 表格列
      columns: columns,
      // 排序条件
      sortord: {
        column: 'createTime',
        order: 'desc',
      },
      filterParams: {
        sex: null,
        status: null,
        username: null,
        realname: null,
        phone: null,
      },
      columnsCtrl: {
        props: {
          placement: 'bottom-end',
          visibleArrow: false,
        },
      },
      // end <---- table
      resetPasswordModalVisible: false,
      resetPasswordModel: {},
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    checkPermission,
    handleResetPasswordClick(row) {
      this.resetPasswordModel = {
        username: row.username,
      }
      this.resetPasswordModalVisible = true
    },
    handleResetPasswordOk() {
      this.resetPasswordModalVisible = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
