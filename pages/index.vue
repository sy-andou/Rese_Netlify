<template>
  <div class="index-wrapper">
    <SearchShops />
    <div class="shop-index-wrapper">
      <div
        v-for="shopList in getSearchShopLists"
        v-bind:key="shopList.id"
        class="shop-index-container"
      >
        <ShopIndex v-bind:shop-list="shopList" class="shop-index" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {},
  computed: {
    getSearchShopLists() {
      return this.$store.getters["shops/getSearchShopLists"](
        this.$store.state.areas.selectAreaId,
        this.$store.state.genres.selectGenreId,
        this.$store.state.shops.inputShopName
      );
    },
  },
  created() {},
};
</script>

<style scoped>
.shop-index-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.shop-index-container {
  margin: 15px auto;
}
@media screen and (max-width: 768px) {
  .shop-index {
    width: 100%;
  }
}
</style>
