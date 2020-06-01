<template>
  <el-main>
    <el-scrollbar>
      <div class="app-container">
        <router-view></router-view>
      </div>
    </el-scrollbar>
  </el-main>
</template>

<script>
export default {
  name: 'ViewLayout',
}
</script>
