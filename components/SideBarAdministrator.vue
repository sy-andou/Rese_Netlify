<template>
  <nav>
    <h5>管理者専用メニュー</h5>
    <ul>
      <li
        v-on:click="userIndexDisplay"
        v-bind:class="{ index: userIndex }"
        class="sidebar-userIndex"
      >
        <span>ユーザー一覧</span>
      </li>
      <li
        v-on:click="representativeRegisterDisplay"
        v-bind:class="{ index: representativeRegister }"
        class="sidebar-representativeRegister"
      >
        <span>新規店舗代表者登録</span>
      </li>
      <li
        v-on:click="sendEmailDisplay"
        v-bind:class="{ index: sendEmail }"
        class="sidebar-sendEmail"
      >
        <span>メール送信</span>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  props: ["userIndex", "representativeRegister", "sendEmail"],
  methods: {
    userIndexDisplay() {
      this.$emit("userIndexDisplay");
    },
    representativeRegisterDisplay() {
      this.$emit("representativeRegisterDisplay");
    },
    sendEmailDisplay() {
      this.$emit("sendEmailDisplay");
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
  background: url(./static/img/administrator.png);
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
.sidebar-userIndex {
  color: ;
}
.sidebar-userIndex::before {
  content: "";
  background: url(./static/img/user.png);
  background-size: cover;
  vertical-align: bottom;
  width: 25px;
  margin: 0 5px 0 0;
  height: 25px;
  display: inline-block;
}
.sidebar-representativeRegister {
}

.sidebar-representativeRegister::before {
  content: "";
  background: url(./static/img/representative.png);
  background-size: cover;
  vertical-align: bottom;
  width: 25px;
  margin: 0 5px 0 0;
  height: 25px;
  display: inline-block;
}
.sidebar-sendEmail {
}
.sidebar-sendEmail::before {
  content: "";
  background: url(./static/img/email.png);
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
