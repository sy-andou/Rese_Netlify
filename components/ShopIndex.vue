<template>
  <div>
    <form v-if="$route.path === '/'">
      <select v-model="searchArea">
        <option value="">全都道府県</option>
        <option　v-for="areaList in createAreaLists" v-bind:value="areaList.id">{{areaList.area}}</option>
      </select>
      <select v-model="searchGenre">
        <option value="">全ジャンル</option>
        <option　v-for="genreList in createGenreLists" v-bind:value="genreList.id">{{genreList.genre}}</option>
      </select>
      <input v-model="searchShopName" type="search" placeholder="search..." />
    </form>
    <div class="shop-wrapper">
      <div
        v-for="shopList in filterShopLists"
        v-bind:key="shopList.id"
        class="shop-container"
      >
        <img
          v-bind:src="shopList.img_pass"
          v-on:click="showShopSummary(shopList.id)"
          class="shop-img"
        />
        <div class="shop-infomation">
          <div>
            <h3 v-on:click="showShopSummary(shopList.id)" class="shop-name">
              {{ shopList.name }}
            </h3>
            <div class="shop-tag">
              <p v-on:click="getSearchArea(shopList.area_id)">
                #{{ shopList.area.area }}
              </p>
              <p v-on:click="getSearchGenre(shopList.genre_id)">
                #{{ shopList.genre.genre }}
              </p>
            </div>
            <p v-on:click="showShopSummary(shopList.id)" class="shop-link">
              詳しく見る
            </p>
          </div>
          <div class="shop-infomation-right">
            <div　class="evaluation-container">
              <p class="evaluation-star">
                <span
                  class="star5_rating"
                  v-bind:data-rate='evaluationAvg(shopList.id)'>
                </span>
              </p>
              <p>{{evaluationAvg(shopList.id)}}</p>
            </div>
            <div class="favorite-container">
              <div v-if="$auth.loggedIn">
                <img
                  v-if="findFavoriteShop(shopList.id)"
                  v-on:click="deleteFavorite(shopList.id)"
                  src="/img/heartPink.png"
                />
                <img
                  v-else
                  v-on:click="insertFavorite(shopList.id)"
                  src="/img/heartGray.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["shopLists"],
  data() {
    return {
      searchArea:'',
      searchGenre:'',
      searchShopName:'',
    };
  },
  methods: {
  /*店舗詳細へのリンク*/
    showShopSummary(id) {
      this.$router.push({ name: "detail-shopId", params: { shopId: id } });
    },
    /*エリアで検索*/
    getSearchArea(id) {
      if (this.$route.path !== "/") {
        this.$router.push({ name: "index", params: { areaId: id }  });
      }
      else{
        this.searchArea = id;
        this.searchGenre = "";
      }
    },
    /*ジャンルで検索*/
    getSearchGenre(id) {
      if (this.$route.path !== "/") {
        this.$router.push({ name: "index", params: { genreId: id } });
      } else {
        this.searchArea = "";
        this.searchGenre = id;
      }
    },
    /*ページ遷移時に検索を実行する関数*/
    getSearchParams(){
      if(this.$route.params.areaId){
        this.searchArea = this.$route.params.areaId;
      }
      if(this.$route.params.genreId){
        this.searchGenre = this.$route.params.genreId;
      }
    },
    /*お気に入りに追加*/
    async insertFavorite(shopId) {
      const sendData = {
        user_id: this.$auth.user.id,
        shop_id: shopId,
      };
      await this.$axios.post("https://resebackend.herokuapp.com/api/favorite", sendData);
      alert('お気に入りに追加しました。');
      this.$emit("reload");
    },

    /*お気に入りを削除*/
    async deleteFavorite(shopId) {
      const shop = this.shopLists.find((shop) => {
        return shop.id === shopId;
      });
      const favorite = shop.favorite.find((favorite) => {
        return favorite.user_id === this.$auth.user.id;
      });
      const favoriteId = favorite.id;
      await this.$axios.delete(
        "https://resebackend.herokuapp.com/api/favorite/" + favoriteId
      );
      alert('お気に入りから削除しました。');
      this.$emit("reload");
    },
    /*お気に入りであるか判定*/
    findFavoriteShop(shopId) {
      const findShopList = this.shopLists.find((shopList) => {
        return shopList.id === shopId;
      });
      const findFavorite = findShopList.favorite.find((favorite) => {
        return favorite.user_id === this.$auth.user.id;
      });
      if (Boolean(findFavorite)) {
        return true;
      } else {
        return false;
      }
    },
    /*５段階評価の平均を計算*/
    evaluationAvg(id){
      const evaluationArry = this.shopLists.find((shopList)=>{
        return shopList.id===id;
      })
      .reserve.filter((reserveList)=>{
        return reserveList.review!==null;
      })
      .map((reserveList)=>{
          return reserveList.review.evaluation;
      });
      if(evaluationArry.length!==0){
        let sumevaluation=0;
        evaluationArry.forEach((evaluation)=>{
          return  sumevaluation = sumevaluation + evaluation;
        });
        return Math.round(sumevaluation/evaluationArry.length*10)/10;
      }
      else{
        return 0;
      }
    },
  },
  computed:{
    /*店舗一覧を加工しエリア一覧を作成*/
    createAreaLists(){
      const areaLists = this.shopLists.filter((shopList,index)=>{
        return this.shopLists.map((shopList)=>{
          return shopList.area_id;
        })
        .indexOf(shopList.area_id)===index;})
        .map((shopList)=>{
          return shopList.area;
        });
      return areaLists;
    },
    /*店舗一覧を加工しジャンル一覧を作成*/
    createGenreLists(){
      const genreLists = this.shopLists.filter((shopList,index)=>{
        return this.shopLists.map((shopList)=>{
          return shopList.genre_id;
        })
        .indexOf(shopList.genre_id)===index;})
        .map((shopList)=>{
          return shopList.genre;
        });
      return genreLists;
    },
    /*検索内容を元に店舗一覧を表示*/
    filterShopLists() {
      let filterShopLists = this.shopLists;
      if (this.searchArea) {
        filterShopLists = filterShopLists.filter((filterShopList) => {
          return filterShopList.area_id === this.searchArea;
        });
      }
      if (this.searchGenre) {
        filterShopLists = filterShopLists.filter((filterShopList) => {
          return filterShopList.genre_id === this.searchGenre;
        });
      }
      if (this.searchShopName) {
        filterShopLists = filterShopLists.filter((filterShopList) => {
          return filterShopList.name.includes(this.searchShopName);
        });
      }
      return filterShopLists;
    },
  },
  created() {
  　　this.getSearchParams();
  },
};
</script>

<style>

.star5_rating{
    position: relative;
    z-index: 0;
    display: inline-block;
    white-space: nowrap;
    color: #CCCCCC; /* グレーカラー 自由に設定化 */
    /*font-size: 30px; フォントサイズ 自由に設定化 */
}
.star5_rating:before, .star5_rating:after{
    content: '★★★★★';
}
.star5_rating:after{
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    overflow: hidden;
    white-space: nowrap;
    color: #ffcf32; /* イエローカラー 自由に設定化 */
}
.star5_rating[data-rate="5"]:after{ width: 100%; } /* 星5 */
.star5_rating[data-rate="4.9"]:after{ width: 98%; } /* 星4.9 */
.star5_rating[data-rate="4.8"]:after{ width: 96%; } /* 星4.8 */
.star5_rating[data-rate="4.7"]:after{ width: 94%; } /* 星4.7 */
.star5_rating[data-rate="4.6"]:after{ width: 92%; } /* 星4.6 */
.star5_rating[data-rate="4.5"]:after{ width: 90%; } /* 星4.5 */
.star5_rating[data-rate="4.4"]:after{ width: 88%; } /* 星4.4 */
.star5_rating[data-rate="4.3"]:after{ width: 86%; } /* 星4.3 */
.star5_rating[data-rate="4.2"]:after{ width: 84%; } /* 星4.2 */
.star5_rating[data-rate="4.1"]:after{ width: 82%; } /* 星4.1 */
.star5_rating[data-rate="4"]:after{ width: 80%; } /* 星4 */
.star5_rating[data-rate="3.9"]:after{ width: 78%; } /* 星3.9 */
.star5_rating[data-rate="3.8"]:after{ width: 76%; } /* 星3.8 */
.star5_rating[data-rate="3.7"]:after{ width: 74%; } /* 星3.7 */
.star5_rating[data-rate="3.6"]:after{ width: 72%; } /* 星3.6 */
.star5_rating[data-rate="3.5"]:after{ width: 70%; } /* 星3.5 */
.star5_rating[data-rate="3.4"]:after{ width: 68%; } /* 星3.4 */
.star5_rating[data-rate="3.3"]:after{ width: 66%; } /* 星3.3 */
.star5_rating[data-rate="3.2"]:after{ width: 64%; } /* 星3.2 */
.star5_rating[data-rate="3.1"]:after{ width: 62%; } /* 星3.1 */
.star5_rating[data-rate="3"]:after{ width: 60%; } /* 星3 */
.star5_rating[data-rate="2.9"]:after{ width: 58%; } /* 星2.9 */
.star5_rating[data-rate="2.8"]:after{ width: 56%; } /* 星2.8 */
.star5_rating[data-rate="2.7"]:after{ width: 54%; } /* 星2.7 */
.star5_rating[data-rate="2.6"]:after{ width: 52%; } /* 星2.6 */
.star5_rating[data-rate="2.5"]:after{ width: 50%; } /* 星2.5 */
.star5_rating[data-rate="2.4"]:after{ width: 48%; } /* 星2.4 */
.star5_rating[data-rate="2.3"]:after{ width: 46%; } /* 星2.3 */
.star5_rating[data-rate="2.2"]:after{ width: 44%; } /* 星2.2 */
.star5_rating[data-rate="2.1"]:after{ width: 42%; } /* 星2.1 */
.star5_rating[data-rate="2"]:after{ width: 40%; } /* 星2 */
.star5_rating[data-rate="1.9"]:after{ width: 38%; } /* 星1.9 */
.star5_rating[data-rate="1.8"]:after{ width: 36%; } /* 星1.8 */
.star5_rating[data-rate="1.7"]:after{ width: 34%; } /* 星1.7 */
.star5_rating[data-rate="1.6"]:after{ width: 32%; } /* 星1.6 */
.star5_rating[data-rate="1.5"]:after{ width: 30%; } /* 星1.5 */
.star5_rating[data-rate="1.4"]:after{ width: 28%; } /* 星1.4 */
.star5_rating[data-rate="1.3"]:after{ width: 26%; } /* 星1.3 */
.star5_rating[data-rate="1.2"]:after{ width: 24%; } /* 星1.2 */
.star5_rating[data-rate="1.1"]:after{ width: 22%; } /* 星1.1 */
.star5_rating[data-rate="1"]:after{ width: 20%; } /* 星1 */
.star5_rating[data-rate="0.9"]:after{ width: 18%; } /* 星0.9 */
.star5_rating[data-rate="0.8"]:after{ width: 16%; } /* 星0.8 */
.star5_rating[data-rate="0.7"]:after{ width: 14%; } /* 星0.7 */
.star5_rating[data-rate="0.6"]:after{ width: 12%; } /* 星0.6 */
.star5_rating[data-rate="0.5"]:after{ width: 10%; } /* 星0.5 */
.star5_rating[data-rate="0.4"]:after{ width: 8%; } /* 星0.4 */
.star5_rating[data-rate="0.3"]:after{ width: 6%; } /* 星0.3 */
.star5_rating[data-rate="0.2"]:after{ width: 4%; } /* 星0.2 */
.star5_rating[data-rate="0.1"]:after{ width: 2%; } /* 星0.1 */
.star5_rating[data-rate="0"]:after{ width: 0%; } /* 星0 */

</style>

<style scoped>
form{
  display:flex;
  justify-content:flex-end;
  margin:20px 50px;
}
select,input{
  height:40px;
  border:none;
  box-shadow: 2px 2px 4px gray;
}
select{
  width:100px;
}
select:first-child{
  border-radius:5px 0 0 5px;
}
input{
  width:400px;
  border-radius:0 5px 5px 0;
}
.shop-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.shop-container {
  width: 320px;
  margin:0 15px 15px 0 ;
  border-radius: 5px;
  overflow: hidden;
  background-color: white;
  box-shadow: 2px 2px 4px gray;
}
.shop-img {
  height: auto;
  width: 100%;
  cursor: pointer;
}
.shop-infomation {
  display: flex;
  justify-content: space-between;
  margin: 20px;
}
.shop-name {
  margin: 10px 0;
  font-size: 20px;
  cursor: pointer;
}
.shop-tag {
  display: flex;
}
.shop-tag > p {
  margin: 0 10px 0 0;
  cursor: pointer;
}
.shop-link {
  text-align: center;
  width: 90px;
  margin: 15px 0 0 0;
  padding: 10px;
  color: white;
  background-color: rgba(0, 108, 255);
  border-radius: 5px;
  cursor: pointer;
}
.shop-infomation-right{
  display:flex;
  flex-direction:column;
  justify-content: space-between;
  align-items:flex-end;
}
.evaluation-container{
  display: flex;
  align-items:center;
  margin:５px;
}
.evaluation-star{
  margin:10px;
  font-size:15px;
}
.favorite-container > div > img {
  cursor: pointer;
}
@media screen and (max-width: 768px) {
  form {
    flex-direction:column;
    margin:70px 0 30px 0;
  }
  form > select,
  form > input {
    width:100%;
    border-radius:0;
    over-flow:hidden;
  }
  .shop-wrapper {
    display: block;
  }
  .shop-container{
    width:100%;
    margin:0 0 15px 0;
    border-radius:0;
  }
}
</style>
