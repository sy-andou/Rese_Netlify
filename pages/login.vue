<template>
  <div>
    <LoginForm class="login-form" />
  </div>
</template>
<script>
export default {
  method: {},
};
</script>
<style scoped>
.login-form {
  margin: 200px auto;
  max-width: 600px;
  width: 60%;
}
@media screen and (max-width: 768px) {
  .login-form {
    margin: 50px auto;
    width: 100%;
  }
}
</style>
