<template>
  <div class="shop_detail-wrapper">
    <div class="shop-ttl-container">
      <h3>{{ shopListName }}</h3>
    </div>
    <div>
      <img
        v-if="!shopListImg"
        v-bind:src="shopListImgDefault"
        class="shop-img"
      />
      <img v-else v-bind:src="shopListImg" class="shop-img" />
    </div>
    <div class="shop-tag">
      <div class="area-container">
        <p>#{{ shopListArea }}</p>
      </div>
      <div>
        <p>#{{ shopListGenre }}</p>
      </div>
    </div>
    <div class="shop-summary">
      <p class="shop - summary">{{ shopListSummary }}</p>
    </div>
    <div class="shop-time-container">
      <div>
        <p>{{ shopListOpeningTime }}</p>
      </div>
      <div>〜</div>
      <div>
        <p>{{ shopListClosingTime }}</p>
      </div>
    </div>
    <div class="shop-number-container">
      <div>
        <p>{{ shopListMinNumber }}人</p>
      </div>
      <div>〜</div>
      <div>
        <p>{{ shopListMaxNumber }}人</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    "shopListName",
    "shopListImgDefault",
    "shopListImg",
    "shopListSummary",
    "shopListArea",
    "shopListGenre",
    "shopListOpeningTime",
    "shopListClosingTime",
    "shopListMinNumber",
    "shopListMaxNumber",
  ],
  data() {
    return {
      reviewLists: [],
    };
  },
  methods: {},
  computed: {},
  created() {},
};
</script>

<style scoped>
.default-message {
}
.shop_detail-wrapper {
  width: 100%;
  min-width: 500px;
}
.shop-ttl-container {
}
h3 {
  font-size: 30px;
}
.shop-ttl-container > a > img {
  padding: 5px;
}
.shop-img {
  width: 80%;
  margin: 10px auto;
}
.shop-tag {
  display: flex;
  margin: 10px auto;
}
.shop-tag > div > p {
  margin: 0 10px 0 0;
  padding: 5px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
}

.shop-summary {
  height: 50px;
  margin: 0 0 70px 0;
  width: 80%;
  font-size: 18px;
  border-radius: 10px;
}
.shop-time-container,
.shop-number-container {
  display: flex;
  margin: 10px auto;
}
.shop-time-container > div,
.shop-number-container > div {
  margin: auto 0;
}
.shop-time-container > div > p,
.shop-number-container > div > p {
  margin: 0 5px 0 0;

  border-radius: 10px;
}
@media screen and (max-width: 768px) {
  .shop_detail-wrapper {
    flex-direction: column;
    margin: 70px 0 0 0;
  }
  .shop-container {
    display: block;
  }
  .shop-comment-wrapper {
    width: 100%;
  }
}
</style>
