export const state=()=>({
  areaLists: [],
  selectAreaId: '',
})
export const mutations = {
  setAreaLists(state, areaLists) {
    state.areaLists = areaLists;
  },
  setSelectAreaId(state, areaId) {
    state.selectAreaId = areaId;
  },
}
export const actions = {
  async getAreasData({commit}) {
      const areasData = await this.$axios.get("https://resebackend.herokuapp.com/api/area");
      const areaLists = areasData.data.data;
    commit("setAreaLists", areaLists);
  },
}
export const getters = {
}