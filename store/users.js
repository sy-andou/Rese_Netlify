export const state = () => ({
  userLists: [],
  search: {
    name: "",
    email: "",
    permissionId: "",
  },
})

export const mutations = {
  setUserLists(state,userLists) {
    state.userLists = userLists.sort((userA, userB) => {
        if (userA.permission_id < userB.permission_id) {
          return 1;
        } else {
          return -1;
        }
      });
  },
  setSearchName(state,userName) {
    state.search.name = userName;
  },
  setSearchEmail(state,userEmail) {
    state.search.email = userEmail;
  },
  setSearchPermissionId(state,userPermissionId) {
    state.search.permissionId = userPermissionId;
  },
}

export const actions = {
  async getUsersData({commit}) {
      const usersData = await this.$axios.get("https://resebackend.herokuapp.com/api/user");
      const userLists = usersData.data.data;
    commit("setUserLists", userLists);
  },
}

export const getters = {
  getSearchUserLists: (state) => () => {
    let searchUserLists = state.userLists;
    if (state.search.name) {
      searchUserLists = searchUserLists.filter((userList) => {
        return userList.name.includes(state.search.name);
      });
    }
    if (state.search.email) {
      searchUserLists = searchUserLists.filter((userList) => {
        return userList.email.includes(state.search.email);
      })
    }
    if (state.search.permissionId) {
      searchUserLists = searchUserLists.filter((userList) => {
        return userList.permission_id==state.search.permissionId;
      })
    }
    return searchUserLists;
  },
}