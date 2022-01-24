<template>
  <div class="">
    <RegisterForm v-on:registerd="pushThanksPage" class="register-form" />
  </div>
</template>
<script>
export default {
  methods: {
    pushThanksPage() {
      this.$router.push("/thanks/pre_register");
    },
  },
};
</script>
<style scoped>
.register-form {
  width: 60%;
  max-width: 600px;
  margin: 200px auto;
}
@media screen and (max-width: 768px) {
  .register-form {
    margin: 50px auto;
    width: 100%;
  }
}
</style>
