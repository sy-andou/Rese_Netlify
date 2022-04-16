<template>
  <div class="shop_detail-wrapper">
    <div class="shop-comment-wrapper">
      <div class="shop-wrapper">
        <div class="shop-container">
          <div class="shop-ttl-container">
            <NuxtLink to="/"><img src="/img/return.png" /></NuxtLink>
            <h3 v-on:click="showShop($route.params.shopId)" class="shop-name">
              {{ $store.state.shops.shopList.name }}
            </h3>
          </div>
          <div　class="evaluation-container">
            <p class="evaluation-star">
              <span
                class="star5_rating"
                v-bind:data-rate='$store.state.shops.shopList.evaluationAvg'>
              </span>
            </p>
            <p class="star-number">{{$store.state.shops.shopList.evaluationAvg}}</p>
          </div>
        </div>
        <img
          v-bind:src="$store.state.shops.shopList.img_pass"
          v-on:click="showShop(shopList.id)" class="shop-img"
        />
        <div>
          <div class="shop-btn-container">
            <div class="shop-tag">
              <p v-on:click="indexShopArea(areaList.id)"> #{{ $store.state.shops.shopList.area.area }}
              </p>
              <p v-on:click="indexShopGenre(genreList.id)">
                #{{ $store.state.shops.shopList.genre.genre }}
              </p>
            </div>
            <div v-if="$auth.loggedIn" class="favorite-container">
              <img
                v-if="favoriteCheck"
                v-on:click="deleteFavorite"
                src="/img/heartPink.png"
                class="favorite-icon"
              />
              <img
                v-else
                v-on:click="insertFavorite"
                src="/img/heartGray.png"
                class="unfavorite-icon"/>
            </div>
          </div>
          <p class="shop-summary">{{ $store.state.shops.shopList.summary }}</p>
        </div>
      </div>
      <div class="review-comment-wrapper">
        <h5>レビューコメント</h5>
        <div v-for="reserveList in reviewLists" v-bind:key="reserveList.id" class="review-comment-container">
          <p class="review-comment">{{reserveList.review.comment}}</p>
        </div>
      </div>
    </div>
    <div class="reserve-form-container">
      <ReserveForm />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    async insertFavorite() {
      const sendData = {
        user_id: this.$auth.user.id,
        shop_id: this.$route.params.shopId,
      };
      await this.$axios.post("https://resebackend.herokuapp.com/api/favorite", sendData);
      alert('お気に入りに追加しました。');
      this.$store.dispatch("shops/getShopsData");
    },
    async deleteFavorite() {
      const favoriteId = this.$store.state.shops.shopList.favorite.find((favoriteList)=>{
        return favoriteList.user_id===this.$auth.user.id;
      }).id;
      await this.$axios.delete(
        "https://resebackend.herokuapp.com/api/favorite/" + favoriteId
      );
      alert('お気に入りから削除しました。');
      this.$store.dispatch("shops/getShopsData");
    },
  },
  computed: {
    favoriteCheck() {
      return this.$store.getters["shops/checkFavorite"](this.$store. state.shops.shopList.id,this.$auth.user.id)
    },
    reviewLists() {
      if(this.$store.state.shops.shopList.reserve){
        return this.$store.state.shops.shopList.reserve
          .filter((reserveList) => {
            return reserveList.review !== null;
          })
          .filter((reserveList) => {
            return reserveList.review.evaluation !== null;
          });
      }
    },
  },
  async created() {
    if(this.$store.state.shops.shopLists.length==0){
      await this.$store.dispatch("shops/getShopsData");
      await this.$store.commit("shops/setShopList",this.$route.params.shopId);
    }
    else{
      this.$store.commit("shops/setShopList",this.$route.params.shopId);
    }
  },
  mounted(){},
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
.shop_detail-wrapper {
  display: grid;
  grid-template-columns:50% 50%;
  width:100%;
  margin:50px 0 0 0;
}
.evaluation-container{
  display: flex;
  align-items:center;
}
.evaluation-star{
  font-size:30px;
}
.star-number{
  display:inline;
  margin:0 0 0 10px;
  vertical-align:text-bottom;
  font-size:30px;
}
.shop-comment-wrapper {
  width: 100%;
  margin:0 50px 0 0 ;
}
.shop-wrapper {
}
.shop-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin:0 0 20px 0;
}
.shop-ttl-container {
  display: flex;
  align-items: center;
}
h3 {
  font-size: 40px;
  margin: 0 0 0 15px;
}
.shop-ttl-container > a {
  background-color: white;
  border-radius: 5px;
  box-shadow: 2px 2px 4px gray;
}
.shop-ttl-container > a > img {
  padding: 5px;
}
.shop-img {
  width: 100%;
}
.shop-btn-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}
.shop-tag {
  display: flex;
}
.shop-tag > p {
  margin: 0 10px 0 0;
  padding:5px;
  font-size: 20px;
  cursor: pointer;
}
.favorite-container {
  display: flex;
  align-items: center;
}
.favorite-container > img {
  margin: 0 20px 0 0;
  cursor: pointer;
}
.shop-summary {
  font-size: 18px;
  padding:10px;
  background-color:#d9d9d9;
}
.review-comment-wrapper{
  margin:20px 0;
  padding:10px;
  background-color:#d9d9d9;
}
.review-comment-container{
  margin:10px;
}
.review-comment{
  display:block;
  margin: 20px 5px;
  padding:5px;
  width:90%;
  white-space:nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.review-comment:hover{
  overflow: visible;
  white-space:normal;
  text-overflow: clip;
}
.reserve-form-container{
  width: 100% ;
  margin:0 0 0 50px;
}
@media screen and (max-width: 768px) {
  .shop_detail-wrapper {
    display:flex;
    flex-direction:column;
    margin:70px 0 0 0;
  }
  .shop-container{
    display:block;
  }
  .shop-comment-wrapper {
    width:100%;
  }
  .reserve-form-container{
    width:100%;margin:0;
  }
}
</style>
