<template>
  <div>
    <div class="done-container">
      <h2>ご予約ありがとうございます</h2>
      <NuxtLink to="/mypage" class="return-btn">マイページへ</NuxtLink>
    </div>
  </div>
</template>
<script>
export default {
  middleware: "auth",
};
</script>

<style scoped>
.done-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50vh;
  margin: 20vh auto;
  padding: 80px 0;
  background-color: white;
  box-shadow: 2px 2px 4px gray;
}
@media screen and (max-width: 768px) {
  .done-container {
    width: 100%;
  }
}
h2 {
  font-size: 20px;
}
.return-btn {
  text-align: center;
  width: auto;
  margin: 80px 0 0 0;
  padding: 10px 20px;
  color: white;
  background-color: rgba(0, 108, 255);
  box-shadow: 2px 2px 4px gray;
  border-radius: 3px;
}
</style>
