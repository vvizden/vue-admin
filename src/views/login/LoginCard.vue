<template>
  <div class="login-container">
    <div class="login-wraper">
      <!-- <div class="login-header">
      </div> -->

      <div class="login-figure">
        <div class="login-figure__inset"></div>
        <div class="login-figure__form">
          <div class="login-figure__title">
            <svg-icon icon-class="app-logo"></svg-icon>
            {{ title }}
          </div>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            size="default"
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
                  autocomplete="new-password"
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
                @click.native.prevent="handleLogin"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <v-copyright />
    </div>
  </div>
</template>

<script>
import { getCurrentTimeDesc } from '@/utils/time'
import Storage, { REMEMBER_PASSWORD_KEY } from '@/utils/storage'
import settings from '@/settings'

export default {
  name: 'LoginCard',
  data() {
    return {
      title: settings.title,
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
              this.$notify.success({
                title: '欢迎',
                message: `${getCurrentTimeDesc()}好，欢迎回来`,
                duration: 2500,
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
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-image: url('~@/assets/images/login-bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.login-header {
  align-self: flex-start;

  font-size: 32px;
  color: #fff;

  margin-bottom: 16px;
}

.login-figure {
  width: 1000px;
  height: 500px;
  display: flex;

  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12), 0 0 8px rgba(0, 0, 0, 0.04);
}

.login-figure__title {
  color: $--color-text-primary;
  font-size: 32px;
  // font-weight: 700;
  text-align: center;
  letter-spacing: 2px;

  height: 160px;
  line-height: 160px;
  overflow: hidden;

  .svg-icon {
    color: $--color-primary;
  }
}

.login-figure__inset {
  width: 500px;

  background-color: #fff;

  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;

  background-image: url('~@/assets/images/login-feature.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.login-figure__form {
  flex: auto;

  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;

  padding: 0 32px;
  background-color: #fff;
}

.login-form {
  ::v-deep {
    .el-form-item {
      margin-bottom: 32px;
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
  color: rgba(255, 255, 255, 0.4);
  text-align: center;

  margin-top: 16px;
}
</style>
