<template>
  <div class="login-container">
    <el-card class="login-card">
      <p class="title" :style="titleStyle">{{ title }}</p>
      <el-tabs value="login">
        <el-tab-pane label="登陆" name="login">
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
          >
            <el-form-item prop="username">
              <el-input
                ref="username"
                v-model="loginForm.username"
                prefix-icon="el-icon-user"
                placeholder="用户名"
                name="username"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item>

            <el-tooltip
              v-model="capsTooltip"
              content="Caps lock is On"
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
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                />
              </el-form-item>
            </el-tooltip>

            <el-button
              :loading="loading"
              class="login-button"
              type="primary"
              @click.native.prevent="handleLogin"
            >
              登陆
            </el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <copyright class="copyright" />
  </div>
</template>

<script>
import { getCurrentTimeDesc } from '@/utils/time'
import { validUsername } from '@/utils/validate'
import settings from '@/settings'
import variables from '@/styles/element-variables.scss'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      title: settings.title,
      titleStyle: { color: variables.primaryColor },
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername },
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword },
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
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router
                .push({
                  path: this.redirect || '/',
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
              })
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
  background-color: #101038;
  overflow: hidden;
}

.login-card {
  width: 400px;
  position: absolute;
  top: 50%;
  right: 200px;
  transform: translateY(-50%);
  background-color: #fff;
}

.title {
  margin: 32px 0;
  font-size: 32px;
  text-align: center;
}

.login-form {
  padding-top: 16px;
  padding-bottom: 32px;
}

.login-button {
  width: 100%;
  font-size: 16px;
  letter-spacing: 2px;
}

.copyright {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%);
  color: #4b4b6e;
}
</style>

<style lang="scss">
.login-container #tab-login {
  font-size: 16px;
  letter-spacing: 2px;
}
</style>
