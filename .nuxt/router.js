import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _57647b7a = () => interopDefault(import('../pages/administrator.vue' /* webpackChunkName: "pages/administrator" */))
const _78e5a4e5 = () => interopDefault(import('../pages/done.vue' /* webpackChunkName: "pages/done" */))
const _444141d4 = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _d8a11f44 = () => interopDefault(import('../pages/mypage.vue' /* webpackChunkName: "pages/mypage" */))
const _1cfdca15 = () => interopDefault(import('../pages/pay.vue' /* webpackChunkName: "pages/pay" */))
const _4b4b5a06 = () => interopDefault(import('../pages/register.vue' /* webpackChunkName: "pages/register" */))
const _25d15880 = () => interopDefault(import('../pages/representative.vue' /* webpackChunkName: "pages/representative" */))
const _c70fb096 = () => interopDefault(import('../pages/detail/_shopId.vue' /* webpackChunkName: "pages/detail/_shopId" */))
const _502ffabd = () => interopDefault(import('../pages/reserves/_reserveId.vue' /* webpackChunkName: "pages/reserves/_reserveId" */))
const _579bdaee = () => interopDefault(import('../pages/thanks/_status.vue' /* webpackChunkName: "pages/thanks/_status" */))
const _1437bbff = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _57647b7a,
    name: "administrator"
  }, {
    path: "/done",
    component: _78e5a4e5,
    name: "done"
  }, {
    path: "/login",
    component: _444141d4,
    name: "login"
  }, {
    path: "/mypage",
    component: _d8a11f44,
    name: "mypage"
  }, {
    path: "/pay",
    component: _1cfdca15,
    name: "pay"
  }, {
    path: "/register",
    component: _4b4b5a06,
    name: "register"
  }, {
    path: "/representative",
    component: _25d15880,
    name: "representative"
  }, {
    path: "/detail/:shopId?",
    component: _c70fb096,
    name: "detail-shopId"
  }, {
    path: "/reserves/:reserveId?",
    component: _502ffabd,
    name: "reserves-reserveId"
  }, {
    path: "/thanks/:status?",
    component: _579bdaee,
    name: "thanks-status"
  }, {
    path: "/",
    component: _1437bbff,
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
