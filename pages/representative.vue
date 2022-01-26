<template>
  <div class="representative-wrapper">
    <div class="sidebar">
      <SideBarRepresentative
        v-on:shopCreateDisplay="shopCreateDisplay"
        v-on:shopUpdateDisplay="shopUpdateDisplay"
        v-on:reserveCheckDisplay="reserveCheckDisplay"
        v-on:reviewCheckDisplay="reviewCheckDisplay"
        v-bind:shop-create="display.shopCreate"
        v-bind:shop-update="display.shopUpdate"
        v-bind:reserve-check="display.reserveCheck"
        v-bind:review-check="display.reviewCheck"
      />
    </div>
    <div class="rewpesentative-container">
      <div v-if="display.shopCreate" class="shop-create-container">
        <h4>新規店舗情報登録</h4>
        <div class="shop-create-component-container">
          <div class="shop-create-detail-container">
            <ShopCreateDetail v-bind:preview-data="previewData" />
          </div>
          <div class="shop-create-form-container">
            <ShopCreateForm
              v-on:reload="getShopData"
              v-on:receivePreviewData="displayPreview"
              v-bind:area-lists="areaLists"
              v-bind:genre-lists="genreLists"
            />
          </div>
        </div>
      </div>
      <div v-else-if="display.shopUpdate" class="shop-update-container">
        <h4>店舗情報更新・削除</h4>
        <div v-for="shopList in shopLists" v-bind:key="shopList.id">
          <ShopUpdate
            v-on:reload="getShopData"
            v-bind:shop-list="shopList"
            v-bind:area-lists="areaLists"
            v-bind:genre-lists="genreLists"
            class="shop-update"
          />
        </div>
      </div>
      <div v-else-if="display.reserveCheck" class="reserve-check-container">
        <div>
          <h4>予約情報確認</h4>
        </div>
        <div>
          <reserveCheckTable v-bind:reserve-lists="reserveLists" />
        </div>
      </div>
      <div v-else-if="display.reviewCheck" class="review-create-container">
        <div>
          <h4>レビュー確認</h4>
        </div>
        <div>
          <ReviewCheckTable v-bind:review-lists="reviewLists" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  middleware: "representative",
  data() {
    return {
      shopLists: [],
      reserveLists: [],
      reviewLists: [],
      areaLists: [],
      genreLists: [],
      previewData: {},
      display: {
        shopCreate: true,
        shopUpdate: false,
        reserveCheck: false,
        reviewCheck: false,
      },
      search: {
        shopId: "",
        userId: "",
        reserveDate: "",
        reserveTime: "",
        reserveStatus: "",
        reserveTitle: "",
        reserveNumber: "",
      },
    };
  },
  methods: {
    async getReserveData() {
      const reserveData = await this.$axios.get(
        "https://resebackend.herokuapp.com/api/reserve"
      );
      this.reserveLists = reserveData.data.data
        .filter((reserveList) => {
          return reserveList.shop.user_id === this.$auth.user.id;
        })
        .sort((reserveA, reserveB) => {
          if (reserveA.id < reserveB.id) {
            return 1;
          } else {
            return -1;
          }
        });
      this.reviewLists = this.reserveLists
        .filter((reserveList) => {
          return reserveList.review !== null;
        })
        .filter((reserveList) => {
          return reserveList.review.evaluation !== null;
        });
    },
    async getShopData() {
      const shopData = await this.$axios.get(
        "https://resebackend.herokuapp.com/api/shop"
      );
      this.shopLists = shopData.data.data.filter((shopList) => {
        return shopList.user_id === this.$auth.user.id;
      });
    },
    /*地域のデータを一覧で取得*/
    async getAreaData() {
      const areaData = await this.$axios.get(
        "https://resebackend.herokuapp.com/api/area"
      );
      this.areaLists = areaData.data.data;
    },
    /*ジャンルのデータを一覧で取得*/
    async getGenreData() {
      const genreData = await this.$axios.get(
        "https://resebackend.herokuapp.com/api/genre"
      );
      this.genreLists = genreData.data.data;
    },
    displayPreview(previewData) {
      this.previewData = previewData;
    },
    shopCreateDisplay() {
      if (this.display.shopCreate === false) {
        this.display.shopUpdate = false;
        this.display.reserveCheck = false;
        this.display.reviewCheck = false;
        this.display.shopCreate = true;
      }
    },
    shopUpdateDisplay() {
      if (this.display.shopUpdate === false) {
        this.display.reserveCheck = false;
        this.display.reviewCheck = false;
        this.display.shopCreate = false;
        this.display.shopUpdate = true;
      }
    },
    reserveCheckDisplay() {
      if (this.display.reserveCheck === false) {
        this.display.reviewCheck = false;
        this.display.shopCreate = false;
        this.display.shopUpdate = false;
        this.display.reserveCheck = true;
      }
    },
    reviewCheckDisplay() {
      if (this.display.reviewCheck === false) {
        this.display.shopCreate = false;
        this.display.shopUpdate = false;
        this.display.reserveCheck = false;
        this.display.reviewCheck = true;
      }
    },
  },
  computed: {},
  created() {
    this.getReserveData();
    this.getShopData();
    this.getAreaData();
    this.getGenreData();
  },
};
</script>
<style scoped>
.sidebar {
  position: fixed;
  left: 0;
}
.representative-wrapper {
  margin: 0 0 0 220px;
  width: 80%;
}
h4 {
  height: 30px;
  padding: 20px 0;
  margin: 0 50px 0 0;
  font-size: 30px;
}
.shop-create-component-container {
  display: grid;
  grid-template-columns: 50% 50%;
  width: 100%;
  padding: 20px;
  box-shadow: 2px 2px 4px gray;
  background-color: white;
}
.shop-create-detail-container {
  margin: 0 0 0 0;
}
.shop-create-form-container {
  width: 100%;
  margin: 0 auto;
}
.shop-create-wrapper {
  width: 100%;
}
.shop-update-container {
}
.title-container {
  display: flex;
  align-items: center;
}
.reserve-check-container {
}
.reserveStatusStyle {
  border-radius: 2px;
}
.review-create-container{
}
@media screen and (max-width: 768px) {
  .sidebar {
    bottom: 0;
    z-index: 2;
  }
  h4 {
    height: auto;
    font-size: 20px;
  }
  .representative-wrapper {
    flex-direction: column;
    margin: 0;
    width: 100%;
  }
  .shop-create-component-container {
    display: block;
    padding: 0 0 50px 0;
  }
  .shop-create-container {
    margin: 0 0 100px 0;
  }
  .shop-create-detail-container {
    display: none;
  }
  .shop-update-container {
    margin: 0;
  }
  .shop-update {
    width: 100%;
  }
  .reserve-check-container {
    padding: 0 0 30px 0;
  }
}
</style>
