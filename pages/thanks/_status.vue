<template>
  <div class="thanks-wrapper">
    <div class="thanks-container">
      <p class="message-first">{{ messageFirst }}</p>
      <p class="message-second">{{ messageSecond }}</p>
      <NuxtLink to="/login" class="login-btn">ログインする</NuxtLink>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      messageFirst: "",
      messageSecond: "",
    };
  },
  created() {
    if (this.$route.params.status === "success") {
      this.messageFirst = "本登録が完了しました。";
      this.messageSecond = "ログイン画面からログインを行なってください。";
    } else if (this.$route.params.status === "fail") {
      this.messageFirst = "メール認証に失敗しました。";
      this.messageSecond = "再度、メールからリンクをクリックしてください。";
    } else if (this.$route.params.status === "pre_register") {
      this.messageFirst = "仮登録が完了しました。";
      this.messageSecond =
        "送付されたメールのリンクをクリックして本登録をしてください。";
    } else if (this.$route.params.status === "invalid") {
      this.messageFirst = "無効なトークンです。";
    } else if (this.$route.params.status === "exist") {
      this.messageFirst = "すでに本登録されています。";
      this.messageSecond = "ログインして利用してください。";
    } else {
      this.$router.push({ name: "not_found" });
    }
  },
  methods: {},
};
</script>

<style scoped>
.thanks-wrapper {
  height: 67.7vh;
}
.thanks-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80%;
  margin: 20vh auto;
  padding: 80px 0;
  background-color: white;
  box-shadow: 2px 2px 4px gray;
}
.message-first {
  font-weight: bold;
  font-size: 25px;
  margin: 30px auto;
}
.message-second {
  font-size: 15px;
}
.login-btn {
  text-align: center;
  width: 120px;
  margin: 50px 0 0 0;
  padding: 10px 5px;
  color: white;
  background-color: rgba(0, 108, 255);
  border-radius: 3px;
  box-shadow: 2px 2px 4px gray;
  cursor: pointer;
}
@media screen and (max-width: 768px) {
  .thanks-container {
    width: 100%;
  }
}
</style>
