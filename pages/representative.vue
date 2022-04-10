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
            />
          </div>
        </div>
      </div>
      <div v-else-if="display.shopUpdate" class="shop-update-container">
        <h4>店舗情報更新・削除</h4>
        <div
          v-for="shopList in getRepresentativeShopLists"
          v-bind:key="shopList.id"
        >
          <ShopUpdate
            v-on:reload="getShopData"
            v-bind:shop-list="shopList"
            class="shop-update"
          />
        </div>
      </div>
      <div v-else-if="display.reserveCheck" class="reserve-check-container">
        <div>
          <h4>予約情報確認</h4>
        </div>
        <div>
          <reserveCheckTable />
        </div>
      </div>
      <div v-else-if="display.reviewCheck" class="review-create-container">
        <div>
          <h4>レビュー確認</h4>
        </div>
        <div>
          <ReviewCheckTable />
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
      previewData: {},
      display: {
        shopCreate: true,
        shopUpdate: false,
        reserveCheck: false,
        reviewCheck: false,
      },
    };
  },
  methods: {
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
  computed: {
    getRepresentativeShopLists() {
      return this.$store.getters["shops/getRepresentativeShopLists"](
        this.$auth.user.id
      );
    },
  },
  async created() {
    this.$store.dispatch("areas/getAreasData");
    this.$store.dispatch("genres/getgenresData");
    this.$store.dispatch("shops/getShopsData");
    await this.$store.dispatch("reserves/getReservesData");
    this.$store.commit(
      "reserves/setRepresentativeReserveLists",
      this.$auth.user.id,
      this.$auth.user.permission_id
    );
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
