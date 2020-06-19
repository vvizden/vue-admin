<template>
  <div class="header-right">
    <el-dropdown>
      <el-avatar size="medium" class="user-avatar">{{ realname }}</el-avatar>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item divided @click.native="handleUpdatePasswordClick">
          <i class="el-icon-lock el-icon--left"></i>修改密码
        </el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">
          <i class="el-icon-switch-button el-icon--left"></i>登出
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <UpdatePasswordModal
      :visible.sync="passwordModalVisible"
      @ok="handleUpdatePasswordOk"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HeaderRight',
  components: {
    UpdatePasswordModal: () =>
      import(
        /* webpackChunkName: "system" */ '@/views/system/components/UpdatePasswordModal'
      ),
  },
  data() {
    return {
      passwordModalVisible: false,
    }
  },
  computed: {
    ...mapGetters(['realname']),
  },
  methods: {
    handleUpdatePasswordOk() {
      this.passwordModalVisible = false
      this.logout()
    },
    handleUpdatePasswordClick() {
      this.passwordModalVisible = true
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.header-right {
  height: 100%;
  display: flex;
  align-items: center;

  .el-dropdown {
    line-height: 0;
  }

  .user-avatar {
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }
}
</style>
