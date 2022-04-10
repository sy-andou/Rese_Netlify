import moment from "moment";

export const state = () => ({
  allReserveLists: [],
  userReserveLists: [],
  representativeReserveLists: [],
  search: {
    shopId: "",
    date: "",
    status: "",
    title: "",
    name: "",
    number: "",
    date: "",
    time: "",
    review: {
      evaluation:"",
    },
  },
})

export const mutations = {
  setAllReserveLists(state,reserveLists) {
    state.allReserveLists = reserveLists.sort((reserveA, reserveB) => {
      if (reserveA.date > reserveB.date) {
        return 1;
      } else if (reserveA.date === reserveB.date) {
        return reserveA.time > reserveB.time ? 1 : -1;
      } else {
        return -1;
      }
    }).filter((reserveList)=>{
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
  },
  setUserReserveLists(state, userId) {
      state.userReserveLists = state.allReserveLists.filter((reserveList) => {
        return reserveList.user_id == userId;
      });
  },
  setRepresentativeReserveLists(state, userId,) {
    state.representativeReserveLists = state.allReserveLists.filter((reserveList) => {
      return reserveList.shop.user_id == userId;
    });
  },
  setSearchShopId(state,shopId) {
    state.search.shopId = shopId;
  },
  setSearchDate(state, date) {
    state.search.date = date;
  },
  setSearchTime(state, time) {
    state.search.time = time;
  },
  setSearchNumber(state, number) {
    state.search.number = number;
  },
  setSearchStatus(state, status) {
    state.search.status = status;
  },
  setSearchName(state, name) {
    state.search.name = name;
  },
  setSearchTitle(state, title) {
    state.search.title = title;
  },
  setSearchEvaluation(state, evaluation) {
    state.search.review.evaluation = evaluation;
  },
}

export const actions = {
  async getReservesData({commit}) {
    const reservesData = await this.$axios.get("https://resebackend.herokuapp.com/api/reserve");
    const reserveLists = reservesData.data.data;
    commit("setAllReserveLists", reserveLists);
  },
}

export const getters = {
  getActUserReserveLists: (state) => () => {
    return state.userReserveLists.filter((reserveList) => {
      return reserveList.status == "本日の予約" || reserveList.status === "予約中";
    });
  },
  getDeactUserReserveLists: (state) => () => {
    return state.userReserveLists.filter((reserveList) => {
      return reserveList.status == "レビュー未投稿";
    });
  },
  getOldUserReserveLists: (state) => () => {
    return state.userReserveLists.filter((reserveList) => {
      return reserveList.status==="予約削除済"||reserveList.status==="レビュー投稿済"||reserveList.status==="予約日超過";
    });
  },
  getSearchReserveLists: (state) => (reserveLists) => {
    let searchReserveLists = reserveLists;
    if (state.search.shopId) {
      searchReserveLists = searchReserveLists.filter((reserveList) => {
        return reserveList.shop_id == state.search.shopId;
      });
    }
    if (state.search.number) {
      searchReserveLists = searchReserveLists.filter((reserveList) => {
        return reserveList.number == state.search.number;
      });
    }
    if (state.search.date) {
      searchReserveLists = searchReserveLists.filter((reserveList) => {
        return reserveList.date == state.search.date;
      });
    }
    if (state.search.time) {
      searchReserveLists = searchReserveLists.filter((reserveList) => {
        return reserveList.time == state.search.time;
      });
    }
    if (state.search.status) {
      searchReserveLists = searchReserveLists.filter((reserveList) => {
        return reserveList.status == state.search.status;
      });
    }
    if (state.search.title) {
      searchReserveLists = searchReserveLists.filter((reserveList) => {
        return reserveList.name.includes(state.search.title);
      })
    }
    if (state.search.name) {
      searchReserveLists = searchReserveLists.filter((reserveList) => {
        return reserveList.user.name.includes(state.search.name);
      })
    }
    if (state.search.review.evaluation) {
      searchReserveLists = searchReserveLists.filter((reserveList) => {
        return reserveList.review.evaluation == state.search.review.evaluation;
      })
    }
    return searchReserveLists;
  },
  getReviewLists: (state) => () => {
    return state.representativeReserveLists.filter((reserveList) => {
      return reserveList.review !== null;
    }).filter((reserveLsit) => {
      return reserveLsit.review.evaluation !== null;
    });
  },
}