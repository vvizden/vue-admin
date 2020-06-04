<template>
  <div>
    <div class="filter-container"></div>
    <v-table
      v-loading="loading"
      :columns="columns"
      :data="tableData"
      border
      highlight-current-row
      columnsCtrl
    >
      <template #operation>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-plus-outline"
          @click="handleCreateClick"
          >创建</el-button
        >
      </template>
      <template #avatar="{ row }">
        <el-avatar
          size="small"
          fit="scale-down"
          :src="row.avatar | staticFilter"
          icon="el-icon-user-solid"
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
        <el-button type="text" icon="el-icon-delete">删除</el-button>
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
      :title="dialogTitle"
      top="6vh"
      width="70%"
      :visible.sync="dialogFormVisible"
      destroy-on-close
    >
      <UserForm :model="editRow" @ok="handleUserFormOk" />
    </el-dialog>
  </div>
</template>

<script>
import { TableMixin } from '@/mixins'
import { userUrl } from '@/api/url'

export default {
  name: 'UserList',
  mixins: [TableMixin],
  components: {
    UserForm: () => import(/* webpackChunkName: "system" */ './forms/UserForm'),
  },
  data() {
    return {
      url: { data: userUrl.page },
      // begin ----> table
      columns: [
        {
          label: '用户账号',
          align: 'center',
          prop: 'username',
        },
        {
          label: '用户姓名',
          align: 'center',
          prop: 'realname',
        },
        {
          label: '头像',
          align: 'center',
          prop: 'avatar',
          scopedSlots: true,
        },

        {
          label: '性别',
          align: 'center',
          prop: 'sex_dictText',
        },
        {
          label: '生日',
          align: 'center',
          prop: 'birthday',
        },
        {
          label: '手机号码',
          align: 'center',
          prop: 'phone',
        },
        {
          label: '部门',
          align: 'center',
          prop: 'orgCode',
        },
        {
          label: '状态',
          align: 'center',
          prop: 'status_dictText',
        },
        {
          label: '操作',
          align: 'center',
          prop: 'action',
          width: '140px',
          scopedSlots: true,
        },
      ],
      tableData: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
      },
      sortord: {
        column: 'createTime',
        order: 'desc',
      },
      editRow: {},
      // end <---- table
      // begin ---->  dialog
      dialogTitle: '创建',
      dialogFormVisible: false,
      // begin <----  dialog
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    handleCreateClick() {
      this.editRow = {}
      this.dialogTitle = '创建'
      this.dialogFormVisible = true
    },
    handleEditClick(row) {
      this.editRow = row
      this.dialogTitle = '编辑'
      this.dialogFormVisible = true
    },
    handleUserFormOk() {
      this.dialogFormVisible = false
      this.pagination.page = 1
      this.loadData()
    },
    dataHandler(data) {
      this.tableData = data.records
      this.pagination.total = data.total
    },
    getQueryParams() {
      return {
        pageNo: this.pagination.page,
        pageSize: this.pagination.limit,
        ...this.sortord,
      }
    },
  },
}
</script>

<style></style>
