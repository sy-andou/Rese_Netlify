<template>
  <div class="component-wrapper">
    <div class="sidebar">
      <sideBarAdministrator
        v-on:userIndexDisplay="userIndexDisplay"
        v-on:representativeRegisterDisplay="representativeRegisterDisplay"
        v-on:sendEmailDisplay="sendEmailDisplay"
        v-bind:user-index="display.userIndex"
        v-bind:representative-register="display.representativeRegister"
        v-bind:send-email="display.sendEmail"
      />
    </div>
    <div>
      <div v-if="display.userIndex" class="user-lists-wrapper">
        <h3>ユーザー一覧</h3>
        <div>
          <UserIndexTable
            v-bind:user-lists="userLists"
            v-on:reload="getUserData"
          />
        </div>
      </div>
      <div v-else-if="display.representativeRegister">
        <h3>店舗代表者登録フォーム</h3>
        <div>
          <RegisterForm v-on:registerd="alertComplete" class="register-form" />
        </div>
      </div>
      <div v-else-if="display.sendEmail">
        <h3>メール送信フォーム</h3>
        <div>
          <MailForm v-bind:user-lists="userLists" class="mail-form" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  middleware: "administrator",
  data() {
    return {
      userLists: [],
      display: {
        userIndex: true,
        representativeRegister: false,
        sendEmail: false,
      },
    };
  },
  methods: {
    async getUserData() {
      const userData = await this.$axios.get(
        "https://resebackend.herokuapp.com/api/user"
      );
      this.userLists = userData.data.data.sort((userA, userB) => {
        if (userA.permission_id < userB.permission_id) {
          return 1;
        } else {
          return -1;
        }
      });
    },
    alertComplete() {
      alert("店舗代表者の登録が完了しました。");
    },
    userIndexDisplay() {
      if (this.display.userIndex === false) {
        this.display.sendEmail = false;
        this.display.representativeRegister = false;
        this.display.userIndex = true;
      }
    },
    representativeRegisterDisplay() {
      if (this.display.representativeRegister === false) {
        this.display.userIndex = false;
        this.display.sendEmail = false;
        this.display.representativeRegister = true;
      }
    },
    sendEmailDisplay() {
      if (this.display.sendEmail === false) {
        this.display.representativeRegister = false;
        this.display.userIndex = false;
        this.display.sendEmail = true;
      }
    },
  },
  created() {
    this.getUserData();
  },
};
</script>
<style scoped>
.sidebar {
  position: fixed;
  left: 0;
}
h3 {
  height: 30px;
  padding: 20px 0;
  margin: 0 50px 0 0;
  font-size: 30px;
}
.component-wrapper {
  margin: 0 0 0 220px;
  width: 80%;
}
.component-wrapper > div {
}
.mail-form {
  width: 100%;
  max-width: 1000px;
}
.register-form {
  width: 60%;
  max-width: 600px;
}
@media screen and (max-width: 768px) {
  .sidebar {
    bottom: 0;
    z-index: 2;
  }
  h3 {
    height: auto;
    font-size: 20px;
  }
  .component-wrapper {
    flex-direction: column;
    margin: 0;
    width: 100%;
  }
  .component-wrapper > div {
    margin: 0;
  }
  .register-form {
    width: 100%;
  }
  .user-lists-wrapper {
    padding: 0 0 30px 0;
  }
}
</style>
