export const state=()=>({
  shopLists: [],
  shopList: {"area":{"area":null},"genre":{"genre":null},"favorite":[]},
  evaluationAvg:"",
  inputShopName:"",
})

export const mutations = {
  setShopLists(state, shopLists) {
    shopLists.forEach((shopList) => {
      const evaluationArray = shopList.reserve.filter((reserveList) => {
        return reserveList.review != null;
      })
        .filter((reserveList) => {
          return reserveList.review.evaluation != null;
        })
        .map((reserveList) => {
          return reserveList.review.evaluation;
        });
      let sumEvaluation = 0;
      evaluationArray.forEach((evaluation) => {
        sumEvaluation = sumEvaluation + evaluation;
      });
      if (sumEvaluation!=0) {
        shopList["evaluationAvg"] = Math.round(sumEvaluation / evaluationArray.length * 10) / 10;
      } else {
        shopList["evaluationAvg"] = 0;
      }
    });
    state.shopLists = shopLists;
  },
  setShopList(state,shopId) {
    state.shopList = state.shopLists.find((shopList) => {
      return shopList.id==shopId;
    });
  },
  setInputShopName(state,shopName) {
    state.inputShopName = shopName;
  },
}

export const actions = {
  async getShopsData({commit}) {
      const shopsData = await this.$axios.get("https://resebackend.herokuapp.com/api/shop");
      const shopLists = shopsData.data.data;
    commit("setShopLists", shopLists);
  },
}
export const getters = {
  checkFavorite: (state) => (shopId, userId) => {
    const shopList = state.shopLists.find((shopList) => {
      return shopList.id == shopId;
    });
    if (shopList) {
      return shopList.favorite.find((favoriteList) => {
        return favoriteList.user_id == userId;
      });
    }
    else { return null; }
  },
  getFavariteShopLists: (state) => (userId) => {
      return state.shopLists.filter((shopList) => {
        return shopList.favorite.find((favoriteList) => {
          return favoriteList.user_id == userId;
        });
      });
  },
  getRepresentativeShopLists: (state) => (userId) => {
    return state.shopLists.filter((shopList) => {
      return shopList.user_id == userId;
    });
  },
  getSearchShopLists: (state) => (areaId,genreId,shopName) => {
    let searchShopLists = state.shopLists;
    if (areaId) {
      searchShopLists = searchShopLists.filter((shopList) => {
        return shopList.area_id == areaId;
      });
    }
    if (genreId) {
      searchShopLists = searchShopLists.filter((shopList) => {
        return shopList.genre_id == genreId;
      })
    }
    if (shopName) {
      searchShopLists = searchShopLists.filter((shopList) => {
        return shopList.name.includes(shopName);
      })
    }
    return searchShopLists;
  },
}