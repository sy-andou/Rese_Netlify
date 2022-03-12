<template>
  <div class="loading">
    <img class="loading__icon" src="/img/loading-icon.svg" alt="ローディング" />
  </div>
</template>

<style scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  &__icon {
    width: 100px;
    height: 100px;
  }
}
</style>
