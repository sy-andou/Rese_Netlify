<template>
  <div class="index-wrapper">
    <div class="shop-index-wrapper">
      <ShopIndex
        v-bind:shop-lists="shopLists"
        v-on:reload="getShopData"
        class="shop-index"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shopLists: [],
    };
  },
  methods: {
    /*店舗のデータを一覧で取得*/
    async getShopData() {
      const shopData = await this.$axios.get(
        "https://resebackend.herokuapp.com/api/shop"
      );
      this.shopLists = shopData.data.data;
    },
  },
  computed: {},
  created() {
    this.getShopData();
  },
};
</script>

<style scoped>
.index-wrapper {
  width: 100%;
  posiition: relative;
}
.shop-index-wrapper {
  margin: 15px 0;
}
@media screen and (max-width: 768px) {
  .shop-index {
    width: 100%;
  }
}
</style>
