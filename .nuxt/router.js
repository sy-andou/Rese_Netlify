import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _94ddc47c = () => interopDefault(import('../pages/administrator.vue' /* webpackChunkName: "pages/administrator" */))
const _12985cc6 = () => interopDefault(import('../pages/done.vue' /* webpackChunkName: "pages/done" */))
const _19d6c95e = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _52b561d4 = () => interopDefault(import('../pages/mypage.vue' /* webpackChunkName: "pages/mypage" */))
const _5adb265d = () => interopDefault(import('../pages/pay.vue' /* webpackChunkName: "pages/pay" */))
const _af772a84 = () => interopDefault(import('../pages/register.vue' /* webpackChunkName: "pages/register" */))
const _547efa78 = () => interopDefault(import('../pages/representative.vue' /* webpackChunkName: "pages/representative" */))
const _03dfce6d = () => interopDefault(import('../pages/detail/_shopId.vue' /* webpackChunkName: "pages/detail/_shopId" */))
const _20c871f6 = () => interopDefault(import('../pages/reserves/_reserveId.vue' /* webpackChunkName: "pages/reserves/_reserveId" */))
const _81f8fcb4 = () => interopDefault(import('../pages/thanks/_status.vue' /* webpackChunkName: "pages/thanks/_status" */))
const _502f2647 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/administrator",
    component: _94ddc47c,
    name: "administrator"
  }, {
    path: "/done",
    component: _12985cc6,
    name: "done"
  }, {
    path: "/login",
    component: _19d6c95e,
    name: "login"
  }, {
    path: "/mypage",
    component: _52b561d4,
    name: "mypage"
  }, {
    path: "/pay",
    component: _5adb265d,
    name: "pay"
  }, {
    path: "/register",
    component: _af772a84,
    name: "register"
  }, {
    path: "/representative",
    component: _547efa78,
    name: "representative"
  }, {
    path: "/detail/:shopId?",
    component: _03dfce6d,
    name: "detail-shopId"
  }, {
    path: "/reserves/:reserveId?",
    component: _20c871f6,
    name: "reserves-reserveId"
  }, {
    path: "/thanks/:status?",
    component: _81f8fcb4,
    name: "thanks-status"
  }, {
    path: "/",
    component: _502f2647,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
