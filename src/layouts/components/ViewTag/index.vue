<template>
  <div class="view-tag-container">
    <ul class="view-tag">
      <li class="view-tag__item">
        <span class="view-tag__title" title="测试路由测">
          测试路由测
        </span>
        <i class="el-icon-close"></i>
      </li>
      <li class="view-tag__item" title="测试路由测试路由">
        <span class="view-tag__title">
          测试路由测试路由
        </span>
        <i class="el-icon-close"></i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ViewTag',
  methods: {},
}
</script>

<style lang="scss" scoped>
.view-tag-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.view-tag {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;

  font-size: 14px;
}

.view-tag__item {
  width: 120px;
  overflow: hidden;
  position: relative;
  padding: 6px 28px 6px 12px;
  background-color: #dee1e6;

  white-space: nowrap;
  word-break: keep-all;
  user-select: none;
  cursor: pointer;

  &:hover {
    background-color: #f1f2f3;

    .el-icon-close {
      visibility: visible;
    }
  }
}

.view-tag__item + .view-tag__item::before {
  content: '';
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  height: 100%;
  transform: scaleY(0.8);
  background-color: #8b8e92;
}

.view-tag__title {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.el-icon-close {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  visibility: hidden;
  border-radius: 50%;

  &:hover {
    background-color: #d1d2d3;
  }
}
</style>
