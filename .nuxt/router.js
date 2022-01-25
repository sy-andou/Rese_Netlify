import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _9e29b04c = () => interopDefault(import('../pages/administrator.vue' /* webpackChunkName: "pages/administrator" */))
const _0fb98c85 = () => interopDefault(import('../pages/done.vue' /* webpackChunkName: "pages/done" */))
const _21886b76 = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _75b02004 = () => interopDefault(import('../pages/mypage.vue' /* webpackChunkName: "pages/mypage" */))
const _a3832316 = () => interopDefault(import('../pages/pay.vue' /* webpackChunkName: "pages/pay" */))
const _00a271a6 = () => interopDefault(import('../pages/register.vue' /* webpackChunkName: "pages/register" */))
const _77339940 = () => interopDefault(import('../pages/representative.vue' /* webpackChunkName: "pages/representative" */))
const _73c70755 = () => interopDefault(import('../pages/detail/_shopId.vue' /* webpackChunkName: "pages/detail/_shopId" */))
const _735bdf1d = () => interopDefault(import('../pages/reserves/_reserveId.vue' /* webpackChunkName: "pages/reserves/_reserveId" */))
const _2eeaba8e = () => interopDefault(import('../pages/thanks/_status.vue' /* webpackChunkName: "pages/thanks/_status" */))
const _57e0c85f = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _9e29b04c,
    name: "administrator"
  }, {
    path: "/done",
    component: _0fb98c85,
    name: "done"
  }, {
    path: "/login",
    component: _21886b76,
    name: "login"
  }, {
    path: "/mypage",
    component: _75b02004,
    name: "mypage"
  }, {
    path: "/pay",
    component: _a3832316,
    name: "pay"
  }, {
    path: "/register",
    component: _00a271a6,
    name: "register"
  }, {
    path: "/representative",
    component: _77339940,
    name: "representative"
  }, {
    path: "/detail/:shopId?",
    component: _73c70755,
    name: "detail-shopId"
  }, {
    path: "/reserves/:reserveId?",
    component: _735bdf1d,
    name: "reserves-reserveId"
  }, {
    path: "/thanks/:status?",
    component: _2eeaba8e,
    name: "thanks-status"
  }, {
    path: "/",
    component: _57e0c85f,
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
