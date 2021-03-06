<template>
  <div class="login-container">
    <el-card class="login-card">
      <p class="title" :style="titleStyle">{{ title }}</p>
      <el-tabs value="login">
        <el-tab-pane label="登录" name="login">
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            @submit.native.prevent
          >
            <el-form-item prop="username">
              <el-input
                ref="username"
                v-model="loginForm.username"
                prefix-icon="el-icon-user"
                placeholder="用户名"
                name="username"
                tabindex="1"
                size="medium"
                clearable
              />
            </el-form-item>

            <el-tooltip
              v-model="capsTooltip"
              content="大写已锁定"
              placement="right"
              manual
            >
              <el-form-item prop="password">
                <el-input
                  ref="password"
                  v-model="loginForm.password"
                  prefix-icon="el-icon-lock"
                  show-password
                  placeholder="密码"
                  name="password"
                  tabindex="2"
                  autocomplete="on"
                  size="medium"
                  clearable
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                />
              </el-form-item>
            </el-tooltip>

            <el-form-item>
              <el-checkbox v-model="loginForm.isSavePassword">
                记住密码
              </el-checkbox>
            </el-form-item>

            <el-form-item>
              <el-button
                :loading="loading"
                class="login-button"
                type="primary"
                size="medium"
                @click.native.prevent="handleLogin"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <v-copyright />
  </div>
</template>

<script>
import settings from '@/settings'
import variables from '@/styles/element-variables.scss'
import Storage, { REMEMBER_PASSWORD_KEY } from '@/utils/storage'

export default {
  name: 'Login',
  data() {
    return {
      title: settings.title,
      titleStyle: { color: variables.primaryColor },
      loginForm: Storage.get(REMEMBER_PASSWORD_KEY, {
        username: '',
        password: '',
        isSavePassword: false,
      }),
      loginRules: {
        username: [
          {
            required: true,
            whitespace: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            whitespace: true,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
      },
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          const { redirect, ...others } = query
          this.redirect = redirect
          this.otherQuery = others
        }
      },
      immediate: true,
    },
  },
  methods: {
    checkCapslock(e) {
      this.capsTooltip = e.getModifierState && e.getModifierState('CapsLock')
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              if (this.loginForm.isSavePassword) {
                Storage.set(REMEMBER_PASSWORD_KEY, this.loginForm)
              } else {
                Storage.remove(REMEMBER_PASSWORD_KEY)
              }
              this.$router
                .push({
                  path: '/future-home',
                  query: this.otherQuery,
                })
                .catch(() => {
                  // console.warn(
                  //   `login successfully, redirected from /login to ${this
                  //     .redirect ||
                  //     '/'} caught error, change vue-router version to 3.0.7, it's ok. And the catch also needs to be deleted`,
                  //   error,
                  // )
                })
            })
            .catch((error) => {
              if (error) {
                this.$notify.warning({
                  title: '系统提示',
                  message: error.message,
                })
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.login-container {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: #6f6bff;
  background-image: url('~@/assets/images/login-inset.png');
  background-repeat: no-repeat;
  background-size: auto 640px;
  background-position: 20% center;
  overflow: hidden;
}

.login-container ::v-deep #tab-login {
  font-size: 16px;
  letter-spacing: 2px;
}

.login-card {
  width: 480px;
  position: absolute;
  top: 50%;
  right: 16%;
  transform: translateY(-50%);
  background-color: #fff;
  animation: login-card-slip-in-right-left 0.4s ease-out;

  ::v-deep {
    .el-card__body {
      padding: 16px 48px;
    }
  }
}

.title {
  margin: 24px 0;
  font-size: 32px;
  text-align: center;
}

.login-form {
  padding-top: 24px;
  padding-bottom: 16px;

  ::v-deep {
    .el-form-item {
      margin-bottom: 24px;
    }
  }
}

.login-button {
  width: 100%;
  letter-spacing: 2px;

  ::v-deep {
    span {
      font-size: 16px;
    }
  }
}

.copyright {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%);
  color: rgba(255, 255, 255, 0.5);
}
</style>
