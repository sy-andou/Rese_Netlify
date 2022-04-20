<template>
  <div class="serchFrom-wrapper">
    <form　onsubmit="return false">
        <select
          v-on:change="searchShopId($event)"
          v-bind:value="$store.state.reserves.search.shopId"
        >
          <option value="">店舗名</option>
          <option
            v-for="searchShopList in searchShopLists"
            v-bind:key="searchShopList.id"
            v-bind:value="searchShopList.id"
          >
            {{ searchShopList.name }}
          </option>
        </select>
        <select
          v-on:change="searchDate($event)"
          v-bind:value="$store.state.reserves.search.date"
        >
          <option value="">来店日</option>
          <option
            v-for="searchDateList in searchDateLists"
            v-bind:key="searchDateList.date"
            v-bind:value="searchDateList.date"
          >
            {{ searchDateList.date }}
          </option>
        </select>
        <select
          v-on:change="searchStatus($event)"
          v-bind:value="$store.state.reserves.search.status"
        >
          <option value="">予約状況</option>
          <option
            v-for="reserveList in searchReserveListsForStatus"
            v-bind:key="reserveList.id"
            v-bind:value="reserveList.status"
          >
            {{ reserveList.status }}
          </option>
        </select>
      <input
        type="search"
        v-on:change.prevent="searchTitle"
        v-bind:value="$store.state.reserves.search.title"
        placeholder="予約名を入力してください"
      />
    </form>
    <input v-on:click="searchReset" type="submit" value="検索リセット"/>
  </div>
</template>
<script>
export default {
  props: ["tabReserved", "tabNotReview", "tabOldReserve"],
  methods: {
    searchShopId(event) {
      this.$store.commit("reserves/setSearchShopId", event.target.value);
    },
    searchDate(event) {
      this.$store.commit("reserves/setSearchDate", event.target.value);
    },
    searchStatus(event) {
      this.$store.commit("reserves/setSearchStatus", event.target.value);
    },
    searchTitle(event) {
      this.$store.commit("reserves/setSearchTitle", event.target.value);
    },
    searchReset(){
      this.$store.commit("reserves/setSearchShopId", "");
      this.$store.commit("reserves/setSearchDate", "");
      this.$store.commit("reserves/setSearchStatus", "");
      this.$store.commit("reserves/setSearchTitle", "");
    },
  },
  computed: {
    /*検索用の店舗一覧を作成*/
    searchShopLists() {
      if (this.tabReserved == true) {
        return this.$store.getters["reserves/getActUserReserveLists"]()
          .filter((reserveList, index) => {
            return (
              this.$store.getters["reserves/getActUserReserveLists"]()
                .map((reserveList) => {
                  return reserveList.shop_id;
                })
                .indexOf(reserveList.shop_id) === index
            );
          })
          .map((reserveList) => {
            return reserveList.shop;
          });
      } else if (this.tabNotReview == true) {
        return this.$store.getters["reserves/getDeactUserReserveLists"]()
          .filter((reserveList, index) => {
            return (
              this.$store.getters["reserves/getDeactUserReserveLists"]()
                .map((reserveList) => {
                  return reserveList.shop_id;
                })
                .indexOf(reserveList.shop_id) === index
            );
          })
          .map((reserveList) => {
            return reserveList.shop;
          });
      } else if (this.tabOldReserve == true) {
        return this.$store.getters["reserves/getOldUserReserveLists"]()
          .filter((reserveList, index) => {
            return (
              this.$store.getters["reserves/getOldUserReserveLists"]()
                .map((reserveList) => {
                  return reserveList.shop_id;
                })
                .indexOf(reserveList.shop_id) === index
            );
          })
          .map((reserveList) => {
            return reserveList.shop;
          });
      }
    },
    /*検索用の来店日一覧を作成*/
    searchDateLists() {
      if (this.tabReserved == true) {
        return this.$store.getters["reserves/getActUserReserveLists"]().filter(
          (reserveList, index) => {
            return (
              this.$store.getters["reserves/getActUserReserveLists"]()
                .map((reserveList) => {
                  return reserveList.date;
                })
                .indexOf(reserveList.date) === index
            );
          }
        );
      } else if (this.tabNotReview == true) {
        return this.$store.getters[
          "reserves/getDeactUserReserveLists"
        ]().filter((reserveList, index) => {
          return (
            this.$store.getters["reserves/getDeactUserReserveLists"]()
              .map((reserveList) => {
                return reserveList.date;
              })
              .indexOf(reserveList.date) === index
          );
        });
      } else if (this.tabOldReserve == true) {
        return this.$store.getters["reserves/getOldUserReserveLists"]().filter(
          (reserveList, index) => {
            return (
              this.$store.getters["reserves/getOldUserReserveLists"]()
                .map((reserveList) => {
                  return reserveList.date;
                })
                .indexOf(reserveList.date) === index
            );
          }
        );
      }
    },
    /*検索用のステータス一覧を作成*/
    searchReserveListsForStatus() {
      if (this.tabReserved == true) {
        return this.$store.getters["reserves/getActUserReserveLists"]().filter(
          (reserveList, index) => {
            return (
              this.$store.getters["reserves/getActUserReserveLists"]()
                .map((reserveList) => {
                  return reserveList.status;
                })
                .indexOf(reserveList.status) === index
            );
          }
        );
      } else if (this.tabNotReview == true) {
        return this.$store.getters[
          "reserves/getDeactUserReserveLists"
        ]().filter((reserveList, index) => {
          return (
            this.$store.getters["reserves/getDeactUserReserveLists"]()
              .map((reserveList) => {
                return reserveList.status;
              })
              .indexOf(reserveList.status) === index
          );
        });
      } else if (this.tabOldReserve == true) {
        return this.$store.getters["reserves/getOldUserReserveLists"]().filter(
          (reserveList, index) => {
            return (
              this.$store.getters["reserves/getOldUserReserveLists"]()
                .map((reserveList) => {
                  return reserveList.status;
                })
                .indexOf(reserveList.status) === index
            );
          }
        );
      }
    },
  },
};
</script>
<style scoped>
  .serchFrom-wrapper{
    display:flex;
    justify-content:flex-end;
    margin:20px 0;
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

