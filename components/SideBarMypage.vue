<template>
  <nav>
    <h5>ユーザーメニュー</h5>
    <ul>
      <li
        v-on:click="favoriteShopDisplay"
        v-bind:class="{ index: favoriteShopIndex }"
        class="sidebar-shopCreate"
      >
        <span>お気に入り店舗一覧</span>
      </li>
      <li
        v-on:click="reserveCheckDisplay"
        v-bind:class="{ index: reserveCheck }"
        class="sidebar-reserveCheck"
      >
        <span>予約情報確認</span>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  props: ["favoriteShopIndex", "reserveCheck"],
  methods: {
    favoriteShopDisplay() {
      this.$emit("favoriteShopDisplay");
    },
    reserveCheckDisplay() {
      this.$emit("reserveCheckDisplay");
    },
  },
};
</script>
<style scoped>
.index {
  opacity: 0.5;
}
nav {
  height: 100vh;
  width: 270px;
  background-color: white;
}
h5 {
  padding: 20px 10px;
  font-size: 18px;
}
h5::before {
  content: "";
  background: url(./static/img/user.png);
  background-size: cover;
  vertical-align: bottom;
  margin: 0 5px 0 0;
  width: 30px;
  height: 30px;
  display: inline-block;
}
ul {
  width: 100%;
  margin: 20px 0;
}
li {
  margin: 0;
  padding: 30px 10px;
  cursor: pointer;
}
.sidebar-shopCreate {
  color: ;
}
.sidebar-shopCreate::before {
  content: "";
  background: url(./static/img/shop.png);
  background-size: cover;
  vertical-align: bottom;
  width: 25px;
  margin: 0 5px 0 0;
  height: 25px;
  display: inline-block;
}
.sidebar-reserveCheck {
}
.sidebar-reserveCheck::before {
  content: "";
  background: url(./static/img/timer.png);
  background-size: cover;
  vertical-align: bottom;
  width: 25px;
  margin: 0 5px 0 0;
  height: 25px;
  display: inline-block;
}
@media screen and (max-width: 768px) {
  nav {
    height: auto;
    width: 100%;
  }
  h5 {
    display: none;
  }
  ul {
    display: flex;
    justify-content: space-around;
    margin: 0 auto;
    width: 100vw;
  }
  li {
    padding: 10px;
  }
  li > span {
    display: none;
  }
}
</style>
