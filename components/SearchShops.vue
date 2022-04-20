<template>
  <div class="serchFrom-wrapper">
    <form onsubmit="return false">
      <select v-bind:value="$store.state.areas.selectAreaId" v-on:change="selectAreaId($event)">
        <option value="">全都道府県</option>
        <option　v-for="areaList in createAreaLists" v-bind:value="areaList.id">{{areaList.area}}</option>
      </select>
      <select v-bind:value="$store.state.genres.selectGenreId" v-on:change="selectGenreId($event)">
        <option value="">全ジャンル</option>
        <option　v-for="genreList in createGenreLists" v-bind:value="genreList.id">{{genreList.genre}}</option>
      </select>
      <input　v-bind:value="$store.state.shops.inputShopName" v-on:change.prevent="inputShopName" type="search" placeholder="search..." />
    </form>
    <input v-on:click="searchReset" type="submit" value="検索リセット"/>
  </div>
</template>
<script>
export default{
  data(){
    return {
    }
  },
  methods:{
    selectAreaId(event){
      this.$store.commit("areas/setSelectAreaId", event.target.value);
    },
    selectGenreId(event){
      this.$store.commit("genres/setSelectGenreId", event.target.value);
    },
    inputShopName(event){
      this.$store.commit("shops/setInputShopName", event.target.value);
    },
    searchReset(){
      this.$store.commit("areas/setSelectAreaId");
      this.$store.commit("genres/setSelectGenreId");
      this.$store.commit("shops/setInputShopName");
    },
  },
  computed:{
    createAreaLists(){
      const areaLists = this.$store.state.shops.shopLists.filter((shopList,index)=>{
        return this.$store.state.shops.shopLists.map((shopList)=>{
          return shopList.area_id;
        })
        .indexOf(shopList.area_id)===index;})
        .map((shopList)=>{
          return shopList.area;
        });
      return areaLists;
    },
    createGenreLists(){
      const genreLists = this.$store.state.shops.shopLists.filter((shopList,index)=>{
        return this.$store.state.shops.shopLists.map((shopList)=>{
          return shopList.genre_id;
        })
        .indexOf(shopList.genre_id)===index;})
        .map((shopList)=>{
          return shopList.genre;
        });
      return genreLists;
    },
  }
}
</script>
<style scoped>
  .serchFrom-wrapper{
    display:flex;
    justify-content:flex-end;
    margin:20px 50px;
  }
  form{
    display:flex;
  }
  select,input{
    height:40px;
    border:none;
    box-shadow: 2px 2px 4px gray;
  }
  select{
    width:100px;
    cursor:pointer;
  }
  select:first-child{
    border-radius:5px 0 0 5px;
  }
  input[type="search"]{
    width:400px;
    border-radius:0 5px 5px 0;
  }
  input[type="submit"]{
    margin:0 0 0 20px;
    padding:0 10px;
    border-radius:5px;
    cursor:pointer;
  }
  @media screen and (max-width: 768px) {
    .serchFrom-wrapper{
      margin:0;
      flex-direction:column;
    }
    form {
      flex-direction:column;
      margin:30px auto 0 auto;
      width:90%;
    }
    form > select,
    form > input[type="search"] {
      width:100%;
      over-flow:hidden;
      border-radius:0;
      background-color:white;
    }
    input[type="submit"]{
      margin:0 auto;
      width:90%;
      border-radius:0;
    }
}
</style>
