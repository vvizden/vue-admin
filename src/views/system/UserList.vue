<template>
  <div class="app-container">
    <el-form
      ref="filterForm"
      :model="filterParams"
      inline
      label-width="auto"
      class="filter-container"
    >
      <el-form-item label="性别：" class="filter-item">
        <el-select
          v-model="filterParams.sex"
          placeholder="性别"
          clearable
          style="width: 140px"
        >
          <el-option label="男" :value="1"> </el-option>
          <el-option label="女" :value="2"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态：" class="filter-item">
        <el-select
          v-model="filterParams.status"
          placeholder="状态"
          clearable
          style="width: 140px"
        >
          <el-option label="正常" :value="1"> </el-option>
          <el-option label="冻结" :value="2"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="用户账号：" class="filter-item">
        <el-input
          v-model="filterParams.username"
          placeholder="用户账号"
          clearable
          style="width: 140px"
        ></el-input>
      </el-form-item>

      <el-form-item label="用户姓名：" class="filter-item">
        <el-input
          v-model.trim="filterParams.realname"
          placeholder="用户姓名"
          clearable
          style="width: 140px"
        ></el-input>
      </el-form-item>

      <el-form-item label="手机号：" class="filter-item">
        <el-input
          v-model.trim="filterParams.phone"
          placeholder="手机号"
          clearable
          style="width: 140px"
        ></el-input>
      </el-form-item>

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
            @click="exportXls('用户列表')"
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
            <el-button
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
      <template #avatar="{ row }">
        <el-avatar
          size="small"
          fit="scale-down"
          :src="row.avatar | staticFilter"
          icon="el-icon-user-solid"
          style="vertical-align: middle;"
        ></el-avatar>
      </template>
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
          @onConfirm="handleDeleteClick(row.id)"
        >
          <el-button slot="reference" type="text" icon="el-icon-delete"
            >删除</el-button
          >
        </el-popconfirm>
      </template>
    </v-table>

    <v-pagination
      v-show="pagination.total > 0"
      :total="pagination.total"
      :page.sync="pagination.page"
      :limit.sync="pagination.limit"
      @pagination="loadData"
    />

    <el-dialog
      :title="formContainerTitle"
      top="6vh"
      width="70%"
      :visible.sync="formContainerVisible"
      @closed="handleFormContainerClosed"
    >
      <v-scroll-container class="dialog-inner" v-if="formContainerInnerVisible">
        <UserForm :model="editRow" @ok="handleFormOk" />
      </v-scroll-container>
    </el-dialog>
  </div>
</template>

<script>
import { PageTableMixin, CurdMixin, ExportMixin } from '@/mixins'
import { userUrl } from '@/api/url'

export default {
  name: 'UserList',
  mixins: [PageTableMixin, CurdMixin, ExportMixin],
  components: {
    UserForm: () => import(/* webpackChunkName: "system" */ './forms/UserForm'),
  },
  data() {
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
      columns: [
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
        {
          label: '操作',
          prop: 'action',
          align: 'center',
          width: '140px',
          scopedSlots: true,
        },
      ],
      // 排序条件
      sortord: {
        column: 'createTime',
        order: 'desc',
      },
      columnsCtrl: {
        props: {
          placement: 'bottom-end',
          visibleArrow: false,
        },
      },
      // end <---- table
    }
  },
  mounted() {
    this.loadData()
  },
}
</script>

<style lang="scss" scoped></style>
