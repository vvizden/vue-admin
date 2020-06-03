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
      <template #avatar="{ row }">
        <el-avatar
          size="small"
          fit="scale-down"
          :src="row.avatar | staticFilter"
          icon="el-icon-user-solid"
        ></el-avatar>
      </template>
    </v-table>
    <pagination
      v-show="pagination.total > 0"
      :total="pagination.total"
      :page.sync="pagination.page"
      :limit.sync="pagination.limit"
      @pagination="loadData"
    />
  </div>
</template>

<script>
import { TableMixin } from '@/mixins'
import { url } from '@/api/user'

export default {
  name: 'UserList',
  mixins: [TableMixin],
  data() {
    return {
      url: { data: url.page },
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
          sorter: true,
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
          label: '负责部门',
          align: 'center',
          prop: 'departIds_dictText',
        },
        {
          label: '状态',
          align: 'center',
          prop: 'status_dictText',
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
