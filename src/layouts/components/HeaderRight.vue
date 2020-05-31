<template>
  <div class="header-right">
    <el-dropdown>
      <el-avatar>{{ realname }}</el-avatar>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item divided @click.native="logout">
          登出
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {},
  computed: {
    ...mapGetters(['realname']),
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
  },
}
</script>

<style lang="scss" scoped></style>
