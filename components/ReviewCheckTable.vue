<template>
  <div class="user-index-wrapper">
    <table>
      <tr class="th-container">
        <th>
          <select
            v-model="search.shopName"
            class="shop-name"
          >
            <option value="">店舗名</option>
            <option
              v-for="reviewList in searchForshopNameReviewLists"
              v-bind:key="reviewList.id"
              v-bind:value="reviewList.shop_id"
            >{{reviewList.shop.name}}
            </option>
          </select>
        </th>
        <th class="th-email">
          <select
            v-model="search.userName"
            class="user-name"
          >
            <option value="">ユーザー名</option>
            <option
              v-for="reviewList in searchForuserNameReviewLists"
              v-bind:key="reviewList.review.id"
              v-bind:value="reviewList.user_id"
            >{{reviewList.user.name}}
            </option>
          </select>
        </th>
        <th class="input-date-container">
          <label v-show="dateState === 'collapse'">来店日</label>
          <input
            v-model="search.date"
            v-bind:style="inputCssVars"
            v-on:focus="displayDate(search.date)"
            v-on:blur="displayDate(search.date)"
            type="date"
            placeholder="来店日"
          />
        </th>
        <th>
          <select
            v-model="search.evaluation"
            class="evaluation"
          >
            <option value="">評価</option>
            <option　v-bind:value="5">★5</option>
            <option　v-bind:value="4">★4</option>
            <option　v-bind:value="3">★3</option>
            <option　v-bind:value="2">★2</option>
            <option　v-bind:value="1">★1</option>
          </select>
        </th>
        <th>
          <span>コメント</span>
        </th>
      </tr>
      <tr
        v-for="reviewList in searchAndPaginateReviewLists"
        v-bind:key="reviewList.id"
      >
        <td class="shopName">{{ reviewList.shop.name }}</td>
        <td class="userName">{{ reviewList.user.name }}</td>
        <td class="userName">{{ reviewList.date }}</td>
        <td class="evaluation">★{{ reviewList.review.evaluation }}</td>
        <td class="comment">
          <div>{{reviewList.review.comment}}</div>
        </td>
      </tr>
    </table>
    <div class="paginate-container">
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
</template>
<script>
export default {
  props: ["reviewLists"],
  data() {
    return {
      dateState: "collapse",
      pageCount: this.reviewLists.length,
      paginate: {
        currentPage: 1,
        parPage: 10,
      },
      search: {
        shopName: "",
        userName: "",
        date:"",
        evaluation:"",
      },
    };
  },
  methods: {
    clickCallback(pageNum) {
      this.paginate.currentPage = Number(pageNum);
    },
    displayDate(reserveDate) {
      if (this.dateState === "collapse" || reserveDate) {
        this.dateState = "visible";
      } else {
        this.dateState = "collapse";
      }
    },
  },
  computed: {
    /*検索用の店舗名一覧を作成*/
    searchForshopNameReviewLists() {
      const searchReviewLists = this.reviewLists.filter(
        (reviewList, index) => {
          return (
            this.reviewLists
              .map((reviewList) => {
                return reviewList.shop.name;
              })
              .indexOf(reviewList.shop.name) === index
          );
        }
      );
      return searchReviewLists;
    },
    /*検索用のユーザー名一覧を作成*/
    searchForuserNameReviewLists() {
      const searchReviewLists = this.reviewLists.filter((reviewList, index) => {
        return (
          this.reviewLists
            .map((reviewList) => {
              return reviewList.user.name;
            })
            .indexOf(reviewList.user.name) === index
        );
      });
      return searchReviewLists;
    },
    /*検索内容から検索結果を表示*/
    searchAndPaginateReviewLists() {
      let searchAndPaginateReviewLists = this.reviewLists;
      if (this.search.shopName) {
        searchAndPaginateReviewLists = searchAndPaginateReviewLists.filter(
          (searchAndPaginateReviewList) => {
            return searchAndPaginateReviewList.shop_id===this.search.shopName;
          });
      }
      if (this.search.userName) {
        searchAndPaginateReviewLists = searchAndPaginateReviewLists.filter(
          (searchAndPaginateReviewList) => {
            return searchAndPaginateReviewList.user_id===this.search.userName;
          });
      }
      if (this.search.date) {
        searchAndPaginateReviewLists = searchAndPaginateReviewLists.filter(
          (searchAndPaginateReviewList) => {
            return searchAndPaginateReviewList.date===this.search.date;
          });
      }
      if (this.search.evaluation) {
        searchAndPaginateReviewLists = searchAndPaginateReviewLists.filter(
          (searchAndPaginateReviewList) => {
            return searchAndPaginateReviewList.review.evaluation===this.search.evaluation;
          });
      }
      this.pageCount = this.reviewLists.length;
      this.pageCount = searchAndPaginateReviewLists.length;
      let end = this.paginate.currentPage * this.paginate.parPage;
      let start = end - this.paginate.parPage;
      return searchAndPaginateReviewLists.slice(start, end);
    },
    getPageCount: function () {
      return Math.ceil(this.pageCount / this.paginate.parPage);
    },
    inputCssVars() {
      return {
        "--datetime-display-state": this.dateState,
      };
    },
  },
  watch:{
    search:{
      handler:function(){
        this.clickCallback(1);
      },
      deep:true,
    }
  },
  created(){
  },
};
</script>
<style scoped>
.userDelete{
  cursor:pointer;
}
select:first-child{
  font-weight:normal;
  color:rgba(0,0,0,0.6);
}
th > span{
  font-weight:normal;
  color:rgba(0,0,0,0.6);
  padding:0 0 0 10px;
}
.input-date-container {
  position: relative;
}
th > label {
  position: absolute;
  top: 18px;
  left: 15px;
  font-size: 15px;
  font-weight: normal;
  opacity: 0.6;
}
th > input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  left: -15px;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
  cursor: pointer;
}
th > input[type="date"]::-webkit-datetime-edit {
  visibility: var(--datetime-display-state);
}
select,
input{
  display: inline-black;
  width: 100%;
  height: 50px;
  border: none;
  font-size: 15px;
  background-color: rgba(255, 255, 255, 0);
  cursor:pointer;
}
table {
  width: 100%;
  margin: 20px auto;
}
tr {
  height: 50px;
  border-bottom: 1px solid;
}
th {
  padding: 0 0 0 10px;
  vertical-align: middle;
  text-align: left;
}
td {
  padding: 0 0 0 15px;
  vertical-align: middle;
  text-align: left;
}
.user-index-wrapper {

  height: 100%;
  padding:0 20px 20px 20px;
  background-color: white;
  box-shadow: 2px 2px 4px gray;
}
.comment{
  width:50%;
}
.comment > div{
  width:40vw;
  margin:auto 0;
  white-space:nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.comment > div:hover{
  overflow: visible;
  white-space:normal;
  text-overflow: clip;
}
@media screen and (max-width: 768px) {
  .user-index-wrapper {
    padding: 0;
  }
  tr {
    display: inline-block;
    width: 100%;
    height: auto;
    margin: 0 0 20px 0;
    padding: 10px 0;
    border: none;
    box-shadow: 2px 2px 4px gray;
  }
  .th-container{
    display:grid;
    grid-template-columns:50% 50%;
    padding:0;
  }
  .th-email{
    display:none;
  }
  th{
    padding:0;
  }
  td {
    display: block;
    padding: 5px 20px;
    width: auto;
  }
  .userName::before {
    content: "ユーザー名：";
    vertical-align: bottom;
    width: auto;
    height: auto;
    display: inline-block;
    color: black;
  }
  .userEmail::before {
    content: "メール：";
    vertical-align: bottom;
    width: auto;
    height: auto;
    display: inline-block;
    color: black;
  }
  .userPermissionId::before {
    content: "ユーザー区分：";
    vertical-align: bottom;
    width: auto;
    height: auto;
    display: inline-block;
    color: black;
  }
  .comment > div{

  }
}
</style>
