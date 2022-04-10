<template>
  <div>
    <div class="sidebar">
      <sideBarMypage
        v-on:favoriteShopDisplay="favoriteShopDisplay"
        v-on:reserveCheckDisplay="reserveCheckDisplay"
        v-bind:favorite-shop-index="favoriteShopIndex"
        v-bind:reserve-check="reserveCheck"
      />
    </div>
    <div class="mypage-container">
      <div v-if="favoriteShopIndex" class="shopIndex-wrapper">
        <h3>お気に入り店舗一覧</h3>
        <div class="favoriteshopList-container">
          <div v-for="shopList in getFavoriteShopLists" v-bind:key="shopList.id">
            <ShopIndex v-bind:shop-list="shopList" />
          </div>
        </div>
        <div class="noFavoriteDisplay-wrapper">
          <div v-if="getFavoriteShopLists.length === 0" class="noFavoriteDisplay">
            <p class="message-first">
              お気に入りに登録された店舗はありません。
            </p>
            <p class="message-second">
              ホーム画面の<span><img src="/img/heartGray.png" /></span
              >をクリックしてお気に入り店舗を追加してください。
            </p>
            <NuxtLink to="/">ホーム画面へ</NuxtLink>
          </div>
        </div>
      </div>
      <div v-else class="reserve-review-container">
        <div class="reserve-check-container">
          <h3>予約状況</h3>
          <SearchReserves
            v-bind:tab-reserved="tab.reserved"
            v-bind:tab-not-review="tab.notReview"
            v-bind:tab-old-reserve="tab.oldReserve" />
        </div>
        <div class="reserve-list-wrapper">
          <ul class="tab-container">
            <li
              v-on:click="acceptingReservation"
              v-bind:class="{selectedTab:tab.reserved}"
              class="tab"
            >予約中
            </li>
            <li
              v-on:click="acceptingReview"
              v-bind:class="{selectedTab:tab.notReview}"
              class="tab"
            >レビュー未投稿
            </li>
            <li
              v-on:click="oldReserve"
              v-bind:class="{selectedTab:tab.oldReserve}"
              class="tab"
            >過去の予約
            </li>
          </ul>
          <div
            v-for="reserveList in searchAndPaginateReserveLists"
            v-bind:key="reserveList.id"
            class="reserve-wrapper"
          >
            <div>
              <ReserveCheck
                v-bind:reserve-list="reserveList"
                v-bind:sum-reserve-number="sumReserveNumber(reserveList.shop_id,reserveList.date,reserveList.time)"
                v-on:reload="getUserData($auth.user.id)"
                class="reserve-check"
              />
            </div>
          </div>
          <div class="noFavoriteDisplay-wrapper">
            <div
              v-if="searchAndPaginateReserveLists.length === 0"
              class="noFavoriteDisplay"
            >
              <p class="message-first">予約はありません。</p>
              <p v-if="searchAndPaginateReserveLists.length === 0" class="message-second">
                ホーム画面から店舗詳細ページへ移動し予約登録を行ってください。
              </p>
              <p
                v-else-if="searchAndPaginateReserveLists.length === 0"
                class="message-second"
              >
                検索した条件の予約は見つかりません。
              </p>
              <NuxtLink　v-if="searchAndPaginateReserveLists.length === 0" to="/">ホーム画面へ</NuxtLink>
            </div>
          </div>
        </div>
        <div
          v-if="searchAndPaginateReserveLists.length !== 0"
          class="paginate-container"
        >
          <paginate
            :page-count="getPageCount"
            :page-range="3"
            :margin-pages="2"
            :click-handler="clickCallback"
            :prev-text="'＜'"
            :next-text="'＞'"
            :container-class="'pagination'"
            :page-class="'page-item'"
            :page-link-class="'page-link'"
            :prev-class="'prev'"
            :prev-link-class="'prev-link'"
            :next-class="'next'"
            :next-link-class="'next-link'"
          >
          </paginate>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  middleware: "loginUser",
  data() {
    return {
      favoriteShopIndex: true,
      reserveCheck: false,
      tab:{
        reserved:true,
        notReview:false,
        oldReserve:false,
      },
      paginate: {
        pageCount: "",
        currentPage: 1,
        parPage: 10,
      },
    };
  },
  methods: {
    searchReset(){
      this.$store.commit("reserves/setSearchShopId", "");
      this.$store.commit("reserves/setSearchDate", "");
      this.$store.commit("reserves/setSearchStatus", "");
      this.$store.commit("reserves/setSearchTitle", "");
    },
    acceptingReservation(){
      this.tab.reserved=true;
      this.tab.notReview=false;
      this.tab.oldReserve=false;
      this.searchReset();
    },
    acceptingReview(){
      this.tab.reserved=false;
      this.tab.notReview=true;
      this.tab.oldReserve=false;
      this.searchReset();
    },
    oldReserve(){
      this.tab.reserved=false;
      this.tab.notReview=false;
      this.tab.oldReserve=true;
      this.searchReset();
    },
    favoriteShopDisplay() {
      if (this.favoriteShopIndex === false) {
        this.reserveCheck = false;
        this.favoriteShopIndex = true;
      }
    },
    reserveCheckDisplay() {
      if (this.reserveCheck === false) {
        this.favoriteShopIndex = false;
        this.reserveCheck = true;
      }
    },
    clickCallback(pageNum) {
      this.paginate.currentPage = Number(pageNum);
    },
  },
  computed: {
    getFavoriteShopLists(){
      return this.$store.getters["shops/getFavariteShopLists"](this.$auth.user.id)
    },
    /*検索とページネーションに対応した配列*/
    searchAndPaginateReserveLists() {
    let searchAndPaginateReserveLists
      if(this.tab.reserved==true){
        searchAndPaginateReserveLists = this.$store.getters["reserves/getSearchReserveLists"](this.$store.getters["reserves/getActUserReserveLists"]());
      }
      else if(this.tab.notReview==true){
        searchAndPaginateReserveLists = this.$store.getters["reserves/getSearchReserveLists"](this.$store.getters["reserves/getDeactUserReserveLists"]());
      }
      else if(this.tab.oldReserve==true){
        searchAndPaginateReserveLists = this.$store.getters["reserves/getSearchReserveLists"](this.$store.getters["reserves/getOldUserReserveLists"]());
      }
      this.paginate.pageCount = searchAndPaginateReserveLists.length;
      let end = this.paginate.currentPage * this.paginate.parPage;
      let start = end - this.paginate.parPage;
      return searchAndPaginateReserveLists.slice(start, end);
    },
    /*同一店舗同一日時での予約人数の合計を計算*/
    sumReserveNumber(){
      return function(reserveShopId,reserveDate,reserveTime){
        let sumReserveNumber=0;
        this.$store.state.reserves.allReserveLists.filter((reserveList)=>{
          return reserveList.shop_id===reserveShopId;
        })
        .filter((reserveList)=>{
          return reserveList.date===reserveDate;
        })
        .filter((reserveList)=>{
          return reserveList.time===reserveTime;
        })
        .forEach((reserveList)=>{
          return sumReserveNumber += reserveList.number
        });
        return sumReserveNumber;
      }
    },
    getPageCount: function () {
      return Math.ceil(this.paginate.pageCount / this.paginate.parPage);
    },
  },
  watch:{
    search:{
      handler:function(){
        this.clickCallback(1);
      },
      deep:true,
    },
    tab:{
      handler:function(){
        this.clickCallback(1);
      },
      deep:true,
    }
  },
  async created() {
    await this.$store.dispatch("reserves/getReservesData");
    this.$store.commit("reserves/setUserReserveLists",this.$auth.user.id);
    this.acceptingReservation();
  },
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
}
h3 {
  height: 30px;
  padding: 20px 0;
  font-size: 30px;
}
form {
  display: flex;
  position: absolute;
  right: 50px;
}
form > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

select,
input {
  height: 40px;
  border: none;
  box-shadow: 2px 2px 4px gray;
}
select {
  width: 100px;
}
select:first-child {
  border-radius: 5px 0 0 5px;
}
input {
  width: 300px;
  max-width: 400px;
  border-radius: 0 5px 5px 0;
}
.mypage-container {
  display: flex;
  width: auto;
  margin: 0 0 0 220px;
}
.favoriteshopList-container{
  display: flex;
  flex-wrap:wrap;
}
.reserve-list-wrapper{
  width:70vw;
  min-height:100vh;
  background-color:white;
}
.noFavoriteDisplay-wrapper {
  width:100%;
}
.noFavoriteDisplay {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: auto;
  max-width: 600px;
  margin: 20vh auto;
  padding: 80px 20px;
  background-color: white;
  box-shadow: 2px 2px 4px gray;
}
.message-first {
  font-weight: bold;
  font-size: 25px;
  margin: 30px auto;
}
.message-second {
  font-size: 15px;
}
.noFavoriteDisplay > a {
  text-align: center;
  width: 120px;
  margin: 50px 0 0 0;
  padding: 10px 5px;
  color: white;
  border-radius: 3px;
  background-color: rgba(0, 108, 255);
  box-shadow: 2px 2px 4px gray;
  cursor: pointer;
}
.noFavoriteDisplay > p > span > img {
  width: 15px;
}
.tab-container{
  width:100%;
  magin:0 auto;
  display:grid;
  grid-template-columns:30% 30% 30%;
  background-color: rgb(233, 233, 233);
}
.tab{
  width:90%;
  padding:20px 0;
  text-align:center;
  list-style:none;
  background-color:rgb(135, 135, 135);
  cursor:pointer;
}
.selectedTab{
  background-color:white;
}
.reserve-wrapper {
  width: auto;
  padding: 20px 10px;
}
.reserve-check-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: auto;
}
.shopIndex-wrapper {
  width: 100%;
}
@media screen and (max-width: 768px) {
  .sidebar {
    bottom: 0;
    z-index: 2;
  }
  h3 {
    height: auto;
    font-size: 20px;
  }
  .mypage-container {
    flex-direction: column;
    margin: 0;
  }
  .shopIndex-wrapper {
    margin: 0;
  }
  .noFavoriteDisplay-wrapper {
    position: static;
    left: 0;
  }
  .reserve-check-container {
    display: block;
  }
  form {
    display: block;
    position: static;
  }
  input,
  select {
    width: 100%;
    border-radius: 0;
  }
  .reserve-wrapper{
    margin:20px 0;
    padding:20px 0;
  }
  .reserve-list-wrapper{
    width:100%;
  }
  .tab-container{
    margin:20px 0 0 0;
  }
  .tab{
    padding:10px 0;
  }
}
</style>
