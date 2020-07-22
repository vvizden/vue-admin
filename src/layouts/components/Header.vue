<template>
  <el-header class="layout-header">
    <div class="layout-header__item">
      <span class="title">
        {{ title }}
      </span>
    </div>
    <!-- <div class="layout-header__item">中间功能</div> -->
    <div class="layout-header__item right-item">
      <HeaderRight />
    </div>
  </el-header>
</template>

<script>
import settings from '@/settings'

export default {
  name: 'Header',
  components: {
    HeaderRight: () =>
      import(/* webpackChunkName: "layout" */ '../components/HeaderRight'),
  },
  data() {
    return {
      title: settings.title,
    }
  },
}
</script>

<style lang="scss" scoped>
.layout-header {
  display: flex;
  background-image: linear-gradient(
    to right,
    $header-bg-color-begin,
    $header-bg-color-end
  );

  .title {
    color: #fff;
    font-size: 24px;
    letter-spacing: 2px;
  }

  .right-item {
    justify-content: flex-end;
  }
}

.layout-header__item {
  flex: 1;
  display: flex;
  align-items: center;
}
</style>
