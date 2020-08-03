import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/app'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = [] // Access is allowed even without a token

router.onError((error) => {
  console.log('router onError', error)
})

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  if (whiteList.indexOf(to.path) !== -1) {
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
          next()
        } else {
          let addRoutes = []
          try {
            // get user permissions
            const permissions = await store.dispatch('user/getPermissions')
            // generate accessible routes
            addRoutes = await store.dispatch(
              'permission/generateRoutes',
              permissions.menu,
            )
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
          router.addRoutes(addRoutes)

          if (to.path === '/future-home') {
            const firstRoute = store.getters.firstRoute
            const toPath = firstRoute ? firstRoute.path : '/403'
            next({ path: toPath, replace: true })
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
