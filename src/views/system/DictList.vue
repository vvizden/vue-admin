<template>
  <div class="app-container">
    <el-form
      ref="filterForm"
      :model="filterParams"
      inline
      label-width="auto"
      class="filter-container"
    >
      <el-form-item label="字典名称：" prop="dictName" class="filter-item">
        <el-input
          v-model="filterParams.dictName"
          placeholder="字典名称"
          clearable
          style="width: 160px"
        ></el-input>
      </el-form-item>

      <el-form-item label="字典编码：" prop="dictCode" class="filter-item">
        <el-input
          v-model.trim="filterParams.dictCode"
          placeholder="字典编码"
          clearable
          style="width: 160px"
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

          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            @click="handleRefreshClick"
          >
            刷新缓存
          </el-button>

          <el-button
            type="primary"
            plain
            icon="el-icon-download"
            @click="exportXls('数据字典列表')"
          >
            导出
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
        <el-button
          type="text"
          icon="el-icon-setting"
          @click.stop="handleSettingClick(row)"
          >配置</el-button
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

    <!-- 表单弹窗 -->
    <el-dialog
      v-el-dialog-drag
      :title="formContainerTitle"
      top="6vh"
      width="600px"
      :visible.sync="formContainerVisible"
      @closed="handleFormContainerClosed"
    >
      <v-scroll-container v-if="formContainerInnerVisible">
        <DictForm :model="editRow" @ok="handleFormOk" />
      </v-scroll-container>
    </el-dialog>

    <!-- 字典列表抽屉 -->
    <el-drawer
      title="字典列表"
      size="720px"
      append-to-body
      :visible.sync="drawerVisible"
      @open="handleDrawerOpen"
    >
      <DictItemList class="no-padding" :key="dictId" :dictId="dictId" />
    </el-drawer>
  </div>
</template>

<script>
import { PageTableMixin, CurdMixin, ExportMixin } from '@/mixins'
import { dictUrl } from '@/api/url'
import { mapActions } from 'vuex'

export default {
  name: 'DictList',
  mixins: [PageTableMixin, CurdMixin, ExportMixin],
  components: {
    DictForm: () => import('./forms/DictForm'),
    DictItemList: () => import('./DictItemList'),
  },
  data() {
    return {
      // 接口url
      url: {
        data: dictUrl.page,
        listAll: dictUrl.listAll,
        refreshCache: dictUrl.refreshCache,
        delete: dictUrl.delete,
        exportXls: dictUrl.exportXls,
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
          label: '字典名称',
          prop: 'dictName',
          align: 'center',
        },
        {
          label: '字典编号',
          prop: 'dictCode',
          align: 'center',
        },
        {
          label: '描述',
          prop: 'description',
          align: 'center',
        },
        {
          label: '操作',
          prop: 'action',
          align: 'center',
          width: '200px',
          scopedSlots: true,
        },
      ],
      // 排序条件
      sortord: {
        column: 'createTime',
        order: 'desc',
      },
      filterParams: {
        dictCode: null,
        dictName: null,
      },
      columnsCtrl: {
        props: {
          placement: 'bottom-end',
          visibleArrow: false,
        },
      },
      drawerVisible: false,
      configDict: {},
      dictId: String(Date.now()),
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    ...mapActions('app', ['setDict']),
    handleSettingClick(row) {
      this.configDict = row
      this.drawerVisible = true
    },
    handleDrawerOpen() {
      this.dictId = this.configDict.id
    },
    handleRefreshClick() {
      this.$http
        .get(this.url.refreshCache)
        .then(() => {
          return this.$http.get(this.url.listAll).then((res) => {
            this.setDict(res.result)
            this.$message.success('缓存刷新成功')
          })
        })
        .catch(() => {
          this.$message.error('缓存刷新失败')
        })
    },
  },
}
</script>

<style lang="scss" scoped></style>
