<template>
  <div class="app-container">
    <el-form
      ref="filterForm"
      :model="filterParams"
      inline
      label-width="auto"
      class="filter-container"
    >
      <el-form-item label="名称：" prop="itemText" class="filter-item">
        <el-input
          v-model="filterParams.itemText"
          placeholder="名称"
          clearable
          style="width: 160px"
        ></el-input>
      </el-form-item>

      <el-form-item label="状态：" prop="status" class="filter-item">
        <v-auto-select
          v-model.trim="filterParams.status"
          placeholder="状态"
          clearable
          dictCode="dict_item_status"
          style="width: 160px"
        ></v-auto-select>
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
      class="table-border--hidden"
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
          @onConfirm="handleDeleteClick(row)"
        >
          <el-button slot="reference" type="text" icon="el-icon-delete"
            >删除</el-button
          >
        </el-popconfirm>
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
      width="600px"
      :append-to-body="true"
      :visible.sync="formContainerVisible"
      @closed="handleFormContainerClosed"
    >
      <v-scroll-container v-if="formContainerInnerVisible">
        <DictItemForm :model="editRow" @ok="handleFormOk" />
      </v-scroll-container>
    </el-dialog>
  </div>
</template>

<script>
import { PageTableMixin, CurdMixin } from '@/mixins'
import { dictItemUrl } from '@/api/url'

export default {
  name: 'DictItemList',
  mixins: [PageTableMixin, CurdMixin],
  components: {
    DictItemForm: () =>
      import(/* webpackChunkName: "system" */ './forms/DictItemForm'),
  },
  props: {
    dictId: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      // 接口url
      url: {
        data: dictItemUrl.page,
        delete: dictItemUrl.delete,
      },
      // 表格列
      columns: [
        {
          label: '#',
          prop: 'index',
          type: 'index',
          align: 'center',
        },
        {
          label: '名称',
          prop: 'itemText',
          align: 'center',
        },
        {
          label: '数据值',
          prop: 'itemValue',
          align: 'center',
        },
        {
          label: '描述',
          prop: 'description',
          align: 'center',
        },
        {
          label: '排序',
          prop: 'sortOrder',
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
        column: 'sortOrder',
        order: 'asc',
      },
      filterParams: {
        itemText: null,
        status: null,
      },
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
  methods: {
    getQueryParams() {
      return {
        dictId: this.dictId,
        ...this.filterParams,
        ...this.sortord,
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
