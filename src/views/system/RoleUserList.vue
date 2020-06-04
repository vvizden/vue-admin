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
          @click="dialogFormVisible = true"
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
    </v-table>
    <v-pagination
      v-show="pagination.total > 0"
      :total="pagination.total"
      :page.sync="pagination.page"
      :limit.sync="pagination.limit"
      @pagination="loadData"
    />

    <el-dialog
      title="dialogTitle"
      :visible.sync="dialogFormVisible"
      fullscreen
      destroy-on-close
    >
    </el-dialog>
  </div>
</template>

<script>
import { TableMixin } from '@/mixins'
import { roleUrl } from '@/api/url'

export default {
  name: 'RoleUserList',
  mixins: [TableMixin],
  components: {
    // UserForm: () => import(/* webpackChunkName: "system" */ './forms/UserForm'),
  },
  data() {
    return {
      url: { data: roleUrl.page },
      // begin ----> table
      columns: [
        {
          label: '角色编码',
          align: 'center',
          prop: 'roleCode',
        },
        {
          label: '角色名称',
          align: 'center',
          prop: 'roleName',
        },
        {
          label: '创建时间',
          align: 'center',
          prop: 'createTime',
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
        order: 'order',
      },
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
