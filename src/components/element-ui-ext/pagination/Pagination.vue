<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <span class="el-pagination__count"
        >当前第 {{ (currentPage - 1) * pageSize + 1 }} -
        {{ recordEndIndex }} 条</span
      >
    </el-pagination>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number,
    },
    page: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 20,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      },
    },
    layout: {
      type: String,
      default: 'total, slot, prev, pager, next, sizes',
    },
    background: {
      type: Boolean,
      default: true,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      },
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      },
    },
    recordEndIndex() {
      const endIndex = this.currentPage * this.pageSize
      return this.total < endIndex ? this.total : endIndex
    },
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.pagination-container {
  background: #fff;
  padding: 16px 0 0;

  .el-pagination ::v-deep {
    text-align: right;
    .el-select {
      .el-input {
        margin: 0 0 0 5px;
      }
    }

    .el-pagination__total {
      float: left;
    }

    .el-pagination__count {
      float: left;
    }
  }
}
.pagination-container.hidden {
  display: none;
}
</style>
