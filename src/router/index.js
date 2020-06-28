import Vue from 'vue'
import VueRouter from 'vue-router'
// eslint-disable-next-line
import { BaseLayout, AsideLayout, MainLayout } from '@/layouts'
import { generateChildRoutes } from '@/utils/route'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(VueRouter)

/**
 * concat asyncRoutes
 * @param routes
 */
// eslint-disable-next-line
export function concatAsyncRoutes(routes) {
  return [
    // {
    //   path: '/',
    //   component: AsideLayout,
    //   redirect: '/home',
    //   hidden: true,
    // },
    ...generateChildRoutes(routes),
    {
      path: '*',
      component: () => import(/* webpackChunkName: "fail" */ '@/views/404'),
      hidden: true,
    },
  ]
}

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    hidden: true,
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/login/index'),
  },
]

const createRouter = () =>
  new VueRouter({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    base: process.env.BASE_URL,
    routes: constantRoutes,
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
