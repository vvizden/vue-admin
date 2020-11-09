import router from './router'
import store from './store'
import { Notification } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/app'
import { getCurrentTimeDesc } from '@/utils/time'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/403'] // Access is allowed even without a token

router.onError((error) => {
  console.log('router onError', error)
})

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  if (whiteList.includes(to.path)) {
    // in the free login whitelist, go directly
    next()
  } else {
    // determine whether the user has logged in
    const accessToken = getToken()
    if (accessToken) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        const firstRoute = store.getters.firstRoute
        const toPath = firstRoute ? firstRoute.path : '/403'
        next(toPath)
        // NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
      } else {
        // determine whether the user has obtained his menu permissions
        const hasMenuPermissions =
          store.getters.menuPermissions &&
          store.getters.menuPermissions.length > 0
        if (hasMenuPermissions) {
          if (to.path === '/') {
            const firstRoute = store.getters.firstRoute
            const toPath = firstRoute ? firstRoute.path : '/403'
            next(toPath)
          } else {
            next()
          }
        } else {
          let addRoutes = []
          try {
            // get user permissions
            const permissions = await store.dispatch('user/getPermissions')

            const menu = permissions.menu

            // 若用户无权限，路由到403
            if (!menu || menu.length === 0) {
              store.dispatch('user/logout')
              next('/403')
              NProgress.done()
              return
            }

            // generate accessible routes
            addRoutes = await store.dispatch('permission/generateRoutes', menu)

            // 若用户无权限，路由到403
            if (!addRoutes || addRoutes.length === 0) {
              store.dispatch('user/logout')
              next('/403')
              NProgress.done()
              return
            }
          } catch (error) {
            // remove token and go to login page to re-login
            await store.dispatch('user/resetToken').catch((err) => {
              console.error(
                "permission.js store.dispatch('user/resetToke) catch error",
                err,
              )
            })

            // Notification.error(error || '系统错误')
            if (
              error &&
              error.response &&
              [500, 401].includes(error.response.status)
            ) {
              next()
            } else {
              console.log(error)
              next(`/login?redirect=${to.path}`)
            }
            NProgress.done()
            return
          }

          // dynamically add accessible routes
          router.addRoutes(
            addRoutes.concat({
              path: '*',
              component: () =>
                import(/* webpackChunkName: "error" */ '@/views/404'),
              meta: {
                hidden: true,
              },
            }),
          )

          if (to.path === '/future-home') {
            const firstRoute = store.getters.firstRoute
            const toPath = firstRoute ? firstRoute.path : '/403'
            next({ path: toPath, replace: true })

            Notification.success({
              title: '欢迎',
              message: `${getCurrentTimeDesc()}好，欢迎回来`,
              duration: 2500,
            })
          } else {
            // hack method to ensure that addRoutes is complete
            // set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true })
          }
        }
      }
    } else {
      /* has no token*/
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next()
      } else {
        next(`/login?redirect=${to.path}`)
      }
      // NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    }
  }
  NProgress.done()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
