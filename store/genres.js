export const state=()=>({
  genreLists: [],
  selectGenreId: '',
})
export const mutations = {
  setgenreLists(state, genreLists) {
    state.genreLists = genreLists;
  },
  setSelectGenreId(state, genreId) {
    state.selectGenreId = genreId;
  },
}
export const actions = {
  async getgenresData({commit}) {
      const genresData = await this.$axios.get("https://resebackend.herokuapp.com/api/genre");
      const genreLists = genresData.data.data;
    commit("setgenreLists", genreLists);
  },
}
export const getters = {
}