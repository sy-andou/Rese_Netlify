<template>
  <div class="user-index-wrapper">
    <table>
      <tr class="th-container">
        <th>
          <input
            v-bind:value="$store.state.users.search.name"
            v-on:change="searchName($event)"
            type="search"
            placeholder="ユーザー名"
          />
        </th>
        <th class="th-email">
          <input
            v-bind:value="$store.state.users.search.email"
            v-on:change="searchEmail($event)"
            type="search"
            placeholder="メールアドレス"
          />
        </th>
        <th>
          <select
            v-bind:value="$store.state.users.search.permissionId"
            v-on:change="searchPermissionId($event)"
            class="userPermissionId"
          >
            <option value="">ユーザー区分</option>
            <option　v-bind:value="1">利用者</option>
            <option　v-bind:value="2">店舗代表者</option>
            <option　v-bind:value="3">管理者</option>
          </select>
        </th>
        <th>
          <span>削除</span>
        </th>
      </tr>
      <tr
        v-for="userList in searchAndPaginateUserLists"
        v-bind:key="userList.id"
      >
        <td class="userName">{{ userList.name }}</td>
        <td class="userEmail">{{ userList.email }}</td>
        <td class="userPermissionId"
          v-bind:style="userPermissionIdStyle(userList.permission_id)"
        >
          {{ userList.permission.name }}
        </td>
        <td v-if="userList.permission_id<3" v-on:click="deleteUser(userList.id)" class="userDelete">削除する</td>
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
  data() {
    return {
      pageCount: this.$store.state.users.userLists.length,
      paginate: {
        currentPage: 1,
        parPage: 10,
      },
    };
  },
  methods: {
    searchName(event) {
      this.$store.commit("users/setSearchName", event.target.value);
    },
    searchEmail(event) {
      this.$store.commit("users/setSearchEmail", event.target.value);
    },
    searchPermissionId(event) {
      this.$store.commit("users/setSearchPermissionId", event.target.value);
    },
    async deleteUser(id) {
      if (window.confirm("ユーザー情報を削除いたしますか？")) {
        await this.$axios.delete("https://resebackend.herokuapp.com/api/user/" + id);
        alert("ユーザー情報を削除しました。");
        this.$emit("reload");
      }
      else{
        alert("削除は実行されませんでした。");
      }
    },
    clickCallback(pageNum) {
      this.paginate.currentPage = Number(pageNum);
    },
  },
  computed: {
    /*検索内容から検索結果を表示*/
    searchAndPaginateUserLists() {
      let searchAndPaginateUserLists = this.$store.getters["users/getSearchUserLists"]();
      this.pageCount = this.$store.state.users.userLists.length;
      this.pageCount = searchAndPaginateUserLists.length;
      let end = this.paginate.currentPage * this.paginate.parPage;
      let start = end - this.paginate.parPage;
      return searchAndPaginateUserLists.slice(start, end);
    },
    getPageCount: function () {
      return Math.ceil(this.pageCount / this.paginate.parPage);
    },
    userPermissionIdStyle() {
      return function (permissionId) {
        if (permissionId===1) {
          return {
            color: "black",
          };
        }
        else if (permissionId===2) {
          return {
            color: "orange",
          };
        }
        else if (permissionId===3) {
          return {
            color: "red",
          };
        }
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
  width: 100%;
  height: 100%;
  padding:0 20px 20px 20px;
  background-color: white;
  box-shadow: 2px 2px 4px gray;
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
}
</style>
