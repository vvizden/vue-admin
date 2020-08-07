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
      <el-form-item label="任务状态：" prop="status" class="filter-item">
        <el-select
          v-model="filterParams.status"
          placeholder="任务状态"
          clearable
          style="width: 140px"
        >
          <el-option label="已启动" :value="0"></el-option>
          <el-option label="已停止" :value="-1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="任务类名：" prop="jobClassName" class="filter-item">
        <el-input
          v-model="filterParams.jobClassName"
          placeholder="任务类名"
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

          <el-button
            type="primary"
            plain
            icon="el-icon-download"
            @click="exportXls('定时任务信息')"
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
      <!-- 自定义列内容，需要配合 scopedSlots: true -->
      <template #status="{ row }">
        <el-tag v-if="row.status === 0" type="success" effect="plain"
          >已启动</el-tag
        >
        <el-tag v-if="row.status === -1" type="info" effect="plain"
          >已停止</el-tag
        >
      </template>

      <!-- 自定义操作列内容，需要配合 scopedSlots: true -->
      <template #action="{ row }">
        <el-button
          v-if="row.status === 0"
          type="text"
          icon="el-icon-switch-button"
          @click.stop="toggleStatus(row)"
          >停止</el-button
        >
        <el-button
          v-if="row.status === -1"
          type="text"
          icon="el-icon-video-play"
          @click.stop="toggleStatus(row)"
          >启动</el-button
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
                icon="el-icon-edit-outline"
                @click.stop="handleEditClick(row)"
                >编辑</el-button
              >
            </el-dropdown-item>
            <el-popconfirm
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
    <!-- 分页 -->
    <v-pagination
      :total="pagination.total"
      :page.sync="pagination.page"
      :limit.sync="pagination.limit"
      @pagination="loadData"
    />

    <!-- 弹窗表单 -->
    <el-dialog
      v-el-dialog-drag
      :title="formContainerTitle"
      top="6vh"
      width="600px"
      :visible.sync="formContainerVisible"
      @closed="handleFormContainerClosed"
    >
      <v-scroll-container v-if="formContainerInnerVisible">
        <!-- 表单组件，存放于同级forms目录下 -->
        <QuartzJobForm :model="editRow" @ok="handleFormOk" />
      </v-scroll-container>
    </el-dialog>
  </div>
</template>

<script>
import { PageTableMixin, CurdMixin, ExportMixin } from '@/mixins'
import { quartzJobUrl } from '@/api/url'

export default {
  name: 'QuartzJobList',
  mixins: [PageTableMixin, CurdMixin, ExportMixin],
  components: {
    QuartzJobForm: () =>
      import(/* webpackChunkName: "system" */ './forms/QuartzJobForm'),
  },
  data() {
    return {
      url: {
        data: quartzJobUrl.page,
        delete: quartzJobUrl.delete,
        deleteBatch: quartzJobUrl.deleteBatch,
        exportXls: quartzJobUrl.exportXls,
        pause: quartzJobUrl.pause,
        resume: quartzJobUrl.resume,
      },
      // begin ----> table
      columns: [
        {
          label: '#',
          prop: 'index',
          type: 'index',
          align: 'center',
        },
        {
          label: '任务类名',
          prop: 'jobClassName',
          align: 'center',
        },
        {
          label: 'cron',
          prop: 'cronExpression',
          align: 'center',
        },
        {
          label: '参数',
          prop: 'parameter',
          align: 'center',
        },
        {
          label: '描述',
          prop: 'description',
          align: 'center',
        },
        {
          label: '状态',
          prop: 'status',
          align: 'center',
          scopedSlots: true,
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
      filterParams: {
        status: null,
        jobClassName: '',
      },
      // 表格列控制参数
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
  methods: {
    toggleStatus(row) {
      let url = row.status === 0 ? this.url.pause : this.url.resume
      this.$http
        .get(url, {
          jobClassName: row.jobClassName,
        })
        .then((res) => {
          this.loadData()
          this.$message.success(res.message)
        })
        .catch((error) => {
          if (error) {
            this.$message.warning(error.message)
          }
        })
    },
  },
}
</script>

<style lang="scss" scoped></style>
