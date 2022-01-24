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
        <ShopIndex
          v-bind:shop-lists="shopLists"
          v-on:reload="getUserData($auth.user.id)"
        />
        <div class="noFavoriteDisplay-wrapper">
          <div v-if="shopLists.length === 0" class="noFavoriteDisplay">
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
      <div v-else-if="reserveCheck" class="reserve-review-container">
        <div class="reserve-check-container">
          <h3>予約状況</h3>
          <form>
            <div>
              <select v-model="search.shopId">
                <option value="">店舗名</option>
                <option
                  v-for="searchShopList in searchShopLists"
                  v-bind:key="searchShopList.id"
                  v-bind:value="searchShopList.id"
                >
                  {{ searchShopList.name }}
                </option>
              </select>
              <select v-model="search.reserveDate">
                <option value="">来店日</option>
                <option
                  v-for="reserveList in searchReserveListsForDate"
                  v-bind:key="reserveList.id"
                  v-bind:value="reserveList.date"
                >
                  {{ reserveList.date }}
                </option>
              </select>
              <select v-model="search.reserveStatus">
                <option value="">予約状況</option>
                <option v-for="reserveList in searchReserveListsForStatus"
                  v-bind:key="reserveList.id"
                  v-bind:value="reserveList.status"
                >
                  {{reserveList.status}}
                </option>
              </select>
            </div>
            <input
              type="search"
              v-model="search.reserveTitle"
              placeholder="予約名を入力してください"
            />
          </form>
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
              <p v-if="reserveLists.length === 0" class="message-second">
                ホーム画面から店舗詳細ページへ移動し予約登録を行ってください。
              </p>
              <p
                v-else-if="searchAndPaginateReserveLists.length === 0"
                class="message-second"
              >
                検索した条件の予約は見つかりません。
              </p>
              <NuxtLink　v-if="reserveLists.length === 0" to="/">ホーム画面へ</NuxtLink>
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
      userList: [],
      favoriteLists: [],
      shopLists: [],
      reserveLists: [],
      newReserveLists: [],
      allReserveLists:[],
      tab:{
        reserved:true,
        notreview:false,
        oldreserve:false,
      },
      paginate: {
        pageCount: "",
        currentPage: 1,
        parPage: 10,
      },
      search: {
        shopId: "",
        reserveDate: "",
        reserveStatus: "",
        reserveTitle: "",
      },
    };
  },
  methods: {
    /*ログイン中のユーザデータ取得*/
    async getUserData(id) {
      const userData = await this.$axios.get(
        "https://resebackend.herokuapp.com/api/user/" + id
      );
      this.userList = userData.data.data[0];
      this.favoriteLists = this.userList.favorite;
      this.shopLists = this.favoriteLists.map((favoriteList) => {
        return favoriteList.shop;
      });
      this.reserveLists = this.userList.reserve
        .sort((reserveA, reserveB) => {
          if (reserveA.date > reserveB.date) {
            return 1;
          } else if (reserveA.date === reserveB.date) {
            return reserveA.time > reserveB.time ? 1 : -1;
          } else {
            return -1;
          }
        })
        .filter((reserveList)=>{
          let today = moment().format("YYYY-MM-DD");
          if (reserveList.deleted_at!== null) {
            return reserveList.status = "予約削除済";
          }
          if (reserveList.review!==null) {
            if(reserveList.review.evaluation===null){
              return reserveList.status = "レビュー未投稿";
            }
            else if(reserveList.review.evaluation!==null){
              return reserveList.status = "レビュー投稿済";
            }
          }
          if (reserveList.date === today) {
            return reserveList.status = "本日の予約";
          } else if (reserveList.date > today) {
            return reserveList.status = "予約中";
          }
          else if(reserveList.date < today){
            return reserveList.status = "予約日超過";
          }
        });
      this.acceptingReservation();
    },
    async getAllReserveData(){
      const allReserveData = await this.$axios.get(
        "https://resebackend.herokuapp.com/api/reserve/"
      );
      this.allReserveLists = allReserveData.data.data;
    },
    acceptingReservation(){
      this.tab.reserved=true;
      this.tab.notReview=false;
      this.tab.oldReserve=false;
      this.newReserveLists = this.reserveLists;
      this.search.reserveStatus="";
      this.newReserveLists=this.reserveLists.filter((reserveList)=>{
        return reserveList.status==="本日の予約"||reserveList.status==="予約中";
      })
    },
    acceptingReview(){
      this.tab.reserved=false;
      this.tab.notReview=true;
      this.tab.oldReserve=false;
      this.newReserveLists = this.reserveLists;
      this.search.reserveStatus="";
      this.newReserveLists=this.reserveLists.filter((reserveList)=>{
        return reserveList.status==="レビュー未投稿";
      })
    },
    oldReserve(){
      this.tab.reserved=false;
      this.tab.notReview=false;
      this.tab.oldReserve=true;
      this.newReserveLists = this.reserveLists;
      this.search.reserveStatus="";
      this.newReserveLists=this.reserveLists.filter((reserveList)=>{
        return reserveList.status==="予約削除済"||reserveList.status==="レビュー投稿済"||reserveList.status==="予約日超過";;
      });
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
    /*検索用の店舗一覧を作成*/
    searchShopLists() {
      const searchShopLists = this.newReserveLists
        .filter((reserveList, index) => {
          return (
            this.newReserveLists
              .map((reserveList) => {
                return reserveList.shop_id;
              })
              .indexOf(reserveList.shop_id) === index
          );
        })
        .map((reserveList) => {
          return reserveList.shop;
        });
      return searchShopLists;
    },
    /*検索用の予約日一覧を作成*/
    searchReserveListsForDate() {
      const searchReserveLists = this.newReserveLists.filter(
        (reserveList, index) => {
          return (
            this.newReserveLists
              .map((reserveList) => {
                return reserveList.date;
              })
              .indexOf(reserveList.date) === index
          );
        }
      );
      return searchReserveLists;
    },
    /*検索用のステータス一覧を作成*/
    searchReserveListsForStatus() {
      const searchReserveLists = this.newReserveLists.filter(
        (reserveList, index) => {
          return (
            this.newReserveLists
              .map((reserveList) => {
                return reserveList.status;
              })
              .indexOf(reserveList.status) === index
          );
        }
      );
      return searchReserveLists;
    },
    /*検索とページネーションに対応した配列*/
    searchAndPaginateReserveLists() {
      let searchAndPaginateReserveLists = this.newReserveLists;
      if (this.search.shopId) {
        searchAndPaginateReserveLists = searchAndPaginateReserveLists.filter(
          (searchAndPaginateReserveList) => {
            return searchAndPaginateReserveList.shop.id === this.search.shopId;
          }
        );
      }
      if (this.search.reserveDate) {
        searchAndPaginateReserveLists = searchAndPaginateReserveLists.filter(
          (searchAndPaginateReserveList) => {
            return (
              searchAndPaginateReserveList.date === this.search.reserveDate
            );
          }
        );
      }
      if (this.search.reserveStatus) {
        switch (this.search.reserveStatus) {
          case "予約削除済":
            searchAndPaginateReserveLists =
              searchAndPaginateReserveLists.filter(
                (searchAndPaginateReserveList) => {
                  return searchAndPaginateReserveList.status==="予約削除済";
                }
              );
            break;
          case "レビュー未投稿":
            searchAndPaginateReserveLists =
              searchAndPaginateReserveLists.filter(
                (searchAndPaginateReserveList) => {
                  return searchAndPaginateReserveList.status==="レビュー未投稿";
                }
              );
            break;
          case "レビュー投稿済":
            searchAndPaginateReserveLists =
              searchAndPaginateReserveLists.filter(
                (searchAndPaginateReserveList) => {
                  return searchAndPaginateReserveList.status==="レビュー投稿済";
                }
              );
            break;
          case "本日の予約":
            searchAndPaginateReserveLists =
              searchAndPaginateReserveLists.filter(
                (searchAndPaginateReserveList) => {
                  return searchAndPaginateReserveList.status==="本日の予約";
                }
              );
            break;
          case "予約中":
            searchAndPaginateReserveLists =
              searchAndPaginateReserveLists.filter(
                (searchAndPaginateReserveList) => {
                  return searchAndPaginateReserveList.status==="予約中";
                }
              );
            break;
          case "予約日超過":
            searchAndPaginateReserveLists =
              searchAndPaginateReserveLists.filter(
                (searchAndPaginateReserveList) => {
                  return (
                    searchAndPaginateReserveList.date <
                      moment().format("YYYY-MM-DD") &&
                    searchAndPaginateReserveList.review === null &&
                    searchAndPaginateReserveList.deleted_at === null
                  );
                }
              );
            break;
        }
      }
      if (this.search.reserveTitle) {
        searchAndPaginateReserveLists = searchAndPaginateReserveLists.filter(
          (searchReserveList) => {
            return searchAndPaginateReserveList.name.includes(
              this.search.reserveTitle
            );
          }
        );
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
        this.allReserveLists.filter((reserveList)=>{
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
  created() {
    this.getUserData(this.$auth.user.id);
    this.getAllReserveData();
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
