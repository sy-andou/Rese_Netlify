<template>
  <div>
    <form>
      <select v-model="search.reserveStatus">
        <option value="">予約状況</option>
        <option value="予約中">予約中</option>
        <option value="本日">本日</option>
        <option value="予約日超過">予約日超過</option>
        <option value="来店済">来店済</option>
        <option value="予約削除済">予約削除済</option>
      </select>
      <input v-model="search.shopName" type="search" placeholder="店舗名" />
      <input v-model="search.userName" type="search" placeholder="予約者名" />
      <div class="input-date-container">
        <label v-show="dateState === 'collapse'">来店日</label>
        <input
          v-model="search.reserveDate"
          v-bind:style="inputCssVars"
          v-on:focus="displayDate(search.reserveDate)"
          v-on:blur="displayDate(search.reserveDate)"
          type="date"
          placeholder="来店日"
        />
      </div>
    </form>
    <div class="reserve-check-wrapper">
      <table>
        <tr class="th-contaier">
          <th>
            <select v-model="search.reserveStatus">
              <option value="">予約状況</option>
              <option value="予約中">予約中</option>
              <option value="本日">本日</option>
              <option value="予約日超過">予約日超過</option>
              <option value="来店済">来店済</option>
              <option value="予約削除済">予約削除済</option>
            </select>
          </th>
          <th>
            <input
              v-model="search.shopName"
              type="search"
              placeholder="店舗名"
            />
          </th>
          <th>
            <input
              v-model="search.reserveTitle"
              type="search"
              placeholder="予約タイトル"
            />
          </th>
          <th>
            <input
              v-model="search.userName"
              type="search"
              placeholder="予約者名"
            />
          </th>
          <th>
            <select v-model="search.reserveNumber">
              <option value="">予約人数</option>
              <option
                v-for="reserveList in searchForNumberReserveLists"
                v-bind:key="reserveList.id"
                v-bind:value="reserveList.number"
              >
                {{ reserveList.number }}人
              </option>
            </select>
          </th>
          <th class="input-date-container">
            <label v-show="dateState === 'collapse'">来店日</label>
            <input
              v-model="search.reserveDate"
              v-bind:style="inputCssVars"
              v-on:focus="displayDate(search.reserveDate)"
              v-on:blur="displayDate(search.reserveDate)"
              type="date"
              placeholder="来店日"
            />
          </th>
          <th>
            <select v-model="search.reserveTime">
              <option value="">来店時間</option>
              <option
                v-for="reserveList in searchForTimeReserveLists"
                v-bind:key="reserveList.id"
                v-bind:value="reserveList.time"
              >
                {{ reserveList.time }}
              </option>
            </select>
          </th>
        </tr>
        <tr
          v-for="reserveList in searchAndPaginateReserveLists"
          v-bind:key="reserveList.id"
        >
          <td
            v-bind:style="reserveStatusStyle(reserveList)"
            class="reserveStatusStyle"
          >
            {{ reserveStatus(reserveList) }}
          </td>
          <td class="reserveShopName">{{ reserveList.shop.name }}</td>
          <td class="reserveTitle">{{ reserveList.name }}</td>
          <td class="reserveuserName">{{ reserveList.user.name }}</td>
          <td class="reserveNumber">{{ reserveList.number }}人</td>
          <td class="reserveDate">{{ reserveList.date }}</td>
          <td class="reserveTime">{{ reserveList.time }}</td>
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
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: ["reserveLists"],
  data() {
    return {
      dateState: "collapse",
      paginate: {
        pageCount: "",
        currentPage: 1,
        parPage: 10,
      },
      search: {
        shopName: "",
        userName: "",
        reserveDate: "",
        reserveTime: "",
        reserveStatus: "",
        reserveTitle: "",
        reserveNumber: "",
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
    /*検索用の予約人数一覧を作成*/
    searchForNumberReserveLists() {
      const searchReserveLists = this.reserveLists.filter(
        (reserveList, index) => {
          return (
            this.reserveLists
              .map((reserveList) => {
                return reserveList.number;
              })
              .indexOf(reserveList.number) === index
          );
        }
      );
      return searchReserveLists;
    },
    /*検索用の予約時間一覧を作成*/
    searchForTimeReserveLists() {
      const searchReserveLists = this.reserveLists.filter(
        (reserveList, index) => {
          return (
            this.reserveLists
              .map((reserveList) => {
                return reserveList.time;
              })
              .indexOf(reserveList.time) === index
          );
        }
      );
      return searchReserveLists;
    },
    /*検索内容から検索結果を表示*/
    searchAndPaginateReserveLists() {
      let searchAndPaginateReserveLists = this.reserveLists;
      if (this.search.reserveStatus) {
        switch (this.search.reserveStatus) {
          case "予約削除済":
            searchAndPaginateReserveLists =
              searchAndPaginateReserveLists.filter(
                (searchAndPaginateReserveList) => {
                  return searchAndPaginateReserveList.deleted_at !== null;
                }
              );
            break;
          case "来店済":
            searchAndPaginateReserveLists =
              searchAndPaginateReserveLists.filter(
                (searchAndPaginateReserveList) => {
                  return searchAndPaginateReserveList.review !== null;
                }
              );
            break;
          case "本日":
            searchAndPaginateReserveLists =
              searchAndPaginateReserveLists.filter(
                (searchAndPaginateReserveList) => {
                  return (
                    searchAndPaginateReserveList.date ===
                      moment().format("YYYY-MM-DD") &&
                    searchAndPaginateReserveList.review === null &&
                    searchAndPaginateReserveList.deleted_at === null
                  );
                }
              );
            break;
          case "予約中":
            searchAndPaginateReserveLists =
              searchAndPaginateReserveLists.filter(
                (searchAndPaginateReserveList) => {
                  return (
                    searchAndPaginateReserveList.date >
                      moment().format("YYYY-MM-DD") &&
                    searchAndPaginateReserveList.deleted_at === null
                  );
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
      if (this.search.shopName) {
        searchAndPaginateReserveLists = searchAndPaginateReserveLists.filter(
          (searchAndPaginateReserveList) => {
            return searchAndPaginateReserveList.shop.name.includes(
              this.search.shopName
            );
          }
        );
      }
      if (this.search.reserveTitle) {
        searchAndPaginateReserveLists = searchAndPaginateReserveLists.filter(
          (searchAndPaginateReserveList) => {
            return searchAndPaginateReserveList.name.includes(
              this.search.reserveTitle
            );
          }
        );
      }
      if (this.search.userName) {
        searchAndPaginateReserveLists = searchAndPaginateReserveLists.filter(
          (searchAndPaginateReserveList) => {
            return searchAndPaginateReserveList.user.name.includes(
              this.search.userName
            );
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
      if (this.search.reserveTime) {
        searchAndPaginateReserveLists = searchAndPaginateReserveLists.filter(
          (searchAndPaginateReserveList) => {
            return (
              searchAndPaginateReserveList.time === this.search.reserveTime
            );
          }
        );
      }
      this.paginate.pageCount = searchAndPaginateReserveLists.length;
      let end = this.paginate.currentPage * this.paginate.parPage;
      let start = end - this.paginate.parPage;
      return searchAndPaginateReserveLists.slice(start, end);
    },
    getPageCount: function () {
      return Math.ceil(this.paginate.pageCount / this.paginate.parPage);
    },
    reserveStatus() {
      return function (reserveList) {
        let today = moment().format("YYYY-MM-DD");
        if (reserveList.deleted_at) {
          return "予約削除済";
        }
        if (reserveList.review !== null) {
          return "来店済";
        }
        if (reserveList.date === today) {
          return "本日";
        } else if (reserveList.date > today) {
          return "予約中";
        } else if (reserveList.date < today) {
          return "予約日超過";
        }
      };
    },
    reserveStatusStyle() {
      return function (reserveList) {
        let today = moment().format("YYYY-MM-DD");
        if (reserveList.deleted_at) {
          return {
            color: "rgb(137, 137, 137)",
          };
        }
        if (reserveList.review !== null) {
          return {
            color: "rgb(137, 137, 137)",
          };
        }
        if (reserveList.date === today) {
          return {
            color: "rgb(221, 95, 95)",
          };
        } else if (reserveList.date > today) {
          return {
            color: "rgb(95, 221, 158)",
          };
        } else if (reserveList.date < today) {
          return {
            color: "rgb(221, 95, 95)",
          };
        }
      };
    },
    inputCssVars() {
      return {
        "--datetime-display-state": this.dateState,
      };
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
  justify-content: flex-sart;
  margin: 0 0 10px 0;
}
form > select,
form > input,
form > div > input {
  height: 40px;
  width: auto;
  border: none;
  box-shadow: 2px 2px 4px gray;
}
.input-date-container {
  position: relative;
}
form > div > label {
  position: absolute;
  top: 13px;
  left: 0px;
  font-size: 14px;
  font-weight: normal;
  opacity: 0.6;
}
form > div > input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  left: -30px;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
  cursor: pointer;
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
th > select,
th > input {
  display: inline-black;
  width: 100%;
  height: 50px;
  border: none;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.6);
  background-color: rgba(255, 255, 255, 0);
  cursor: pointer;
}
input[type="date"] {
}
input[type="date"]::-webkit-datetime-edit {
  visibility: var(--datetime-display-state);
}
table {
  width: 100%;
  margin: 0 auto;
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
.reserve-check-wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: white;
  box-shadow: 2px 2px 4px gray;
}
@media screen and (max-width: 768px) {
  .reserve-check-wrapper {
    padding: 0;
  }
  form {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 50% 50%;
  }
  form > select,
  form > input,
  form > div > input {
    width: 100%;
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
  .th-contaier {
    display: none;
  }
  td {
    display: block;
    padding: 5px 20px;
    width: auto;
  }
  .reserveStatusStyle::before {
    content: "予約状況：";
    vertical-align: bottom;
    width: auto;
    height: auto;
    display: inline-block;
    color: black;
  }
  .reserveShopName::before {
    content: "店舗名：";
    vertical-align: bottom;
    width: auto;
    height: auto;
    display: inline-block;
    color: black;
  }
  .reserveTitle::before {
    content: "予約名：";
    vertical-align: bottom;
    width: auto;
    height: auto;
    display: inline-block;
    color: black;
  }
  .reserveUserName::before {
    content: "予約者：";
    vertical-align: bottom;
    width: auto;
    height: auto;
    display: inline-block;
    color: black;
  }
  .reserveNumber::before {
    content: "予約人数：";
    vertical-align: bottom;
    width: auto;
    height: auto;
    display: inline-block;
    color: black;
  }
  .reserveDate::before {
    content: "来店日：";
    vertical-align: bottom;
    width: auto;
    height: auto;
    display: inline-block;
    color: black;
  }
  .reserveTime::before {
    content: "来店時間：";
    vertical-align: bottom;
    width: auto;
    height: auto;
    display: inline-block;
    color: black;
  }
}
</style>
