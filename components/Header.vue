<template>
  <div class="header-wrapper">
    <div class="header-menu">
      <div class="menu-container">
        <div class="btn-container">
          <div v-show="!menu" v-on:click="menu = true" class="logo-container">
            <img src="/img/restaurant.png" class="logo-img" />
          </div>
          <div
            v-show="menu"
            v-on:click="menu = false"
            class="close-btn-container"
          >
            <img src="/img/restaurantCross.png" class="logo-img" />
          </div>
        </div>
        <h1 v-on:click="menu = true">Rese</h1>
      </div>
      <div class="login-state-container">
        <div v-if="$auth.loggedIn" class="login-user-container">
          <p v-on:click="userMenuDisplay" class="login-user">
            {{ $auth.user.name }}様
            <span v-if="$auth.user.permission_id === 2">(店舗代表者) </span>
            <span v-if="$auth.user.permission_id === 3">(管理者)</span>
          </p>
          <div v-show="userMenu" class="user-menu">
            <div class="user-menu-mypage">
              <NuxtLink to="/mypage">MyPage</NuxtLink>
            </div>
            <div v-on:click="logout" class="user-menu-logout">
              <span>LogOut</span>
            </div>
          </div>
        </div>
        <div v-show="!$auth.loggedIn" class="login-menu-container">
          <div class="register-link register-container">
            <NuxtLink to="/register" class="login-menu">Register</NuxtLink>
          </div>
          <div class="login-link login-container">
            <NuxtLink to="/login" class="login-menu">Login</NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <transition name="left">
      <div class="modal-window" v-show="menu">
        <div class="modal-bg">
          <ul v-if="$auth.loggedIn">
            <li v-on:click="menu = false" class="home-link">
              <NuxtLink to="/">Home</NuxtLink>
            </li>
            <li v-on:click="logout" class="logout-link">
              <NuxtLink to="/login">LogOut</NuxtLink>
            </li>
            <li v-on:click="menu = false" class="mypage-link">
              <NuxtLink to="/mypage">Mypage</NuxtLink>
            </li>
            <li
              v-if="$auth.user.permission_id === 2"
              v-on:click="menu = false"
              class="representative-link"
            >
              <NuxtLink to="/representative">Representative</NuxtLink>
            </li>
            <li
              v-if="$auth.user.permission_id === 3"
              v-on:click="menu = false"
              class="administrator-link"
            >
              <NuxtLink to="/administrator">Administrator</NuxtLink>
            </li>
          </ul>
          <ul v-else>
            <li v-on:click="menu = false" class="home-link">
              <NuxtLink to="/">Home</NuxtLink>
            </li>
            <li v-on:click="menu = false" class="register-link">
              <NuxtLink to="/register">Registration</NuxtLink>
            </li>
            <li v-on:click="menu = false" class="login-link">
              <NuxtLink to="/login">Login</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginStatus: "",
      menu: false,
      userMenu: false,
    };
  },
  methods: {
    async logout() {
      try {
        await this.$auth.logout();
        this.$router.push("/login");
        this.menu = false;
        this.userMenu = false;
      } catch {
        alert("ログアウトできませんでした。");
      }
    },
    userMenuDisplay() {
      if (this.userMenu === false) {
        this.userMenu = true;
      } else {
        this.userMenu = false;
      }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  updated() {},
};
</script>
<style scoped>
a {
  text-decoration: none;
  color: black;
}
.header-wrapper {
  width: 90%;
  margin: 0 auto;
}
.header-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: auto;
  padding: 20px 0;
}
h1 {
  margin: auto 30px;
  font-size: 50px;
  font-family: Courier;
  color: rgb(0, 108, 255);
  cursor: pointer;
}
.menu-container {
  display: flex;
  align-items: center;
}
.login-state-container {
  margin: auto 0;
}
.login-menu-container {
  display: flex;
  align-items: center;
}
.login-user-container {
  position: relative;
}
.login-user {
  cursor: pointer;
}
.login-user::before {
  content: "";
  background: url(./static/img/key2.png);
  background-size: cover;
  vertical-align: bottom;
  width: 30px;
  height: 30px;
  display: inline-block;
}
.login-user::after {
  content: "";
  background: url(./static/img/down.png);
  background-size: cover;
  vertical-align: middle;
  width: 15px;
  height: 15px;
  display: inline-block;
}
.user-menu {
  position: absolute;
  top: 45px;
  right: -5px;
  display: inline-block;
  padding: 5px;
  background-color: rgb(244, 171, 1);
  box-shadow: 0px 2px 4px gray;
}
.user-menu-mypage,
.user-menu-logout {
  padding: 5px;
  cursor: pointer;
}
.user-menu-logout > span,
.user-menu-mypage > a {
  padding: 10px;
  font-size: 15px;
}
.user-menu-logout > span {
  display: inline-block;
  line-height: 10px;
}
.user-menu-mypage::before {
  content: "";
  background: url(./static/img/user.png);
  background-size: cover;
  vertical-align: bottom;
  width: 30px;
  height: 30px;
  display: inline-block;
}
.user-menu-logout::before {
  content: "";
  background: url(./static/img/logout.png);
  background-size: cover;
  vertical-align: bottom;
  width: 30px;
  height: 30px;
  display: inline-block;
}
.login-menu {
  padding: 5px;
}
.register-container,
.login-container {
  margin: auto 0 auto 30px;
}
.register-link::before {
  content: "";
  background: url(./static/img/register.png);
  background-size: cover;
  vertical-align: bottom;
  width: 30px;
  height: 30px;
  display: inline-block;
}
.login-link::before {
  content: "";
  background: url(./static/img/key3.png);
  background-size: cover;
  vertical-align: bottom;
  width: 30px;
  height: 30px;
  display: inline-block;
}

.btn-container {
  z-index: 4;
}
.logo-container,
.close-btn-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  width: 60px;
  height: 60px;
  background-color: rgb(0, 108, 255);
  border-radius: 7px;
  box-shadow: 2px 2px 4px gray;
  cursor: pointer;
}
.logo-img {
  padding: 10px;
}
.close-btn {
  text-align: center;
}
ul {
  padding-top: 80px;
}
ul li {
  list-style-type: none;
  width: 70%;
  margin: 50px auto;
  padding: 0 20px;
}
.home-link > a,
.logout-link > a,
.mypage-link > a,
.representative-link > a,
.administrator-link > a,
.register-link > a,
.login-link > a {
  padding: 0 5px;
}
.home-link::before {
  content: "";
  background: url(./static/img/home.png);
  background-size: cover;
  vertical-align: bottom;
  width: 25px;
  height: 25px;
  display: inline-block;
}
.logout-link::before {
  content: "";
  background: url(./static/img/logout.png);
  background-size: cover;
  vertical-align: middle;
  width: 25px;
  height: 25px;
  display: inline-block;
}
.mypage-link::before {
  content: "";
  background: url(./static/img/user.png);
  background-size: cover;
  vertical-align: bottom;
  width: 25px;
  height: 25px;
  display: inline-block;
}
.representative-link::before {
  content: "";
  background: url(./static/img/representative.png);
  background-size: cover;
  vertical-align: bottom;
  width: 25px;
  height: 25px;
  display: inline-block;
}
.administrator-link::before {
  content: "";
  background: url(./static/img/administrator.png);
  background-size: cover;
  vertical-align: bottom;
  width: 25px;
  height: 25px;
  display: inline-block;
}
.left-enter-active,
.left-leave-active {
  transform: translate(0px, 0px);
}
.left-enter,
.left-leave-to {
  transform: translateX(-100%);
}
.modal-window {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  width: 200px;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  transition: 0.7s;
}
.modal-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 50px 0;
  background: white;
  opacity: 1;
}
@media screen and (max-width: 768px) {
  .header-menu {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 0;
  }
  .login-state-container {
    margin: 10px 0;
  }
  .login-menu {
    margin: auto 10px auto 0;
  }
  .register-container,
  .login-container {
    margin: auto 0 auto 0;
  }
  .modal {
    width: 40%;
  }
}
</style>
