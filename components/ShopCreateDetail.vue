<template>
  <div class="shop_detail-wrapper">
    <div class="shop-ttl-container">
      <h3 v-if="!previewData.name" class="default-message">
        店舗名を入力してください
      </h3>
      <h3 v-else>{{ previewData.name }}</h3>
    </div>
    <div>
      <img v-if="!previewData.imgUrl" src="/img/noImg.png" class="shop-img" />
      <img v-else v-bind:src="previewData.imgUrl" class="shop-img" />
    </div>
    <div class="shop-tag">
      <div class="area-container">
        <p v-if="!previewData.area" class="default-message">
          エリアを選択してください
        </p>
        <p v-else>#{{ previewData.area }}</p>
      </div>
      <div>
        <p v-if="!previewData.genre" class="default-message">
          ジャンルを選択してください
        </p>
        <p v-else>#{{ previewData.genre }}</p>
      </div>
    </div>
    <div>
      <p v-if="!previewData.summary" class="shop-summary default-message">
        店舗概要を入力してください
      </p>
      <p v-else　class="shop - summary">{{ previewData.summary }}</p>
    </div>
    <div class="shop-time-container">
      <div>
        <p v-if="!previewData.opening_time" class="default-message">
          営業開始を選択してください
        </p>
        <p v-else>{{ previewData.opening_time }}</p>
      </div>
      <div>〜</div>
      <div>
        <p v-if="!previewData.closing_time" class="default-message">
          営業終了を選択してください
        </p>
        <p v-else>{{ previewData.closing_time }}</p>
      </div>
    </div>
    <div class="shop-number-container">
      <div>
        <p v-if="!previewData.min_number" class="default-message">
          １時間あたりの最小予約可能人数を選択してください
        </p>
        <p v-else>{{ previewData.min_number }}人</p>
      </div>
      <div>〜</div>
      <div>
        <p v-if="!previewData.max_number" class="default-message">
          １時間あたりの最大予約可能人数を選択してください
        </p>
        <p v-else>{{ previewData.max_number }}人</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["previewData"],
  data() {
    return {
      shopLists: [],
      shopList: [],
      reviewLists: [],
      areaList: [],
      genreList: [],
      favoriteLists: [],
      reserveLists: [],
    };
  },
  methods: {},
  computed: {},
  created() {},
};
</script>

<style scoped>
.default-message {
  color: red;
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
  font-size: 18px;
  padding: 10px;
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
  padding: 5px;
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
