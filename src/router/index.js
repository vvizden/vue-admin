import Vue from 'vue'
import VueRouter from 'vue-router'
// eslint-disable-next-line
import { BaseLayout, AsideLayout, MainLayout } from '@/layouts'
// import { generateChildRoutes } from '@/utils/route'

Vue.use(VueRouter)

/**
 * concat asyncRoutes
 * @param routes
 */
// eslint-disable-next-line
export function concatAsyncRoutes(routes) {
  return [
    {
      path: '/',
      component: BaseLayout,
      // children: generateChildRoutes(routes),
    },
    { path: '*', redirect: '/404', hidden: true },
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
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/login/index'),
  },
]

const createRouter = () =>
  new VueRouter({
    mode: 'history',
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
