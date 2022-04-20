export { default as Header } from '../../components/Header.vue'
export { default as Loading } from '../../components/Loading.vue'
export { default as LoginForm } from '../../components/LoginForm.vue'
export { default as MailForm } from '../../components/MailForm.vue'
export { default as NuxtLogo } from '../../components/NuxtLogo.vue'
export { default as RegisterForm } from '../../components/RegisterForm.vue'
export { default as ReserveCheck } from '../../components/ReserveCheck.vue'
export { default as ReserveForm } from '../../components/ReserveForm.vue'
export { default as ReviewCheckTable } from '../../components/ReviewCheckTable.vue'
export { default as ReviewForm } from '../../components/ReviewForm.vue'
export { default as SearchReserves } from '../../components/SearchReserves.vue'
export { default as SearchShops } from '../../components/SearchShops.vue'
export { default as ShopCreateDetail } from '../../components/ShopCreateDetail.vue'
export { default as ShopCreateForm } from '../../components/ShopCreateForm.vue'
export { default as ShopIndex } from '../../components/ShopIndex.vue'
export { default as ShopUpdate } from '../../components/ShopUpdate.vue'
export { default as ShopUpdateDetail } from '../../components/ShopUpdateDetail.vue'
export { default as SideBarAdministrator } from '../../components/SideBarAdministrator.vue'
export { default as SideBarMypage } from '../../components/SideBarMypage.vue'
export { default as SideBarRepresentative } from '../../components/SideBarRepresentative.vue'
export { default as Tutorial } from '../../components/Tutorial.vue'
export { default as UserIndexTable } from '../../components/UserIndexTable.vue'
export { default as ReserveCheckTable } from '../../components/reserveCheckTable.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
