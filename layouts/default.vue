<template>
  <div class="layout-container">
    <div class="header-container">
      <Header />
    </div>
    <div class="pages-container">
      <Nuxt />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    setListner() {
      this.$nuxt.$on("setLoading", this.setLoading);
    },
    setLoading() {
      if (this.loading === false) {
        this.loading = true;
      } else {
        this.loading = false;
      }
    },
  },
  created() {
    this.setListner();
  },
};
</script>
<style>
html,
body {
  height: 100%;
  background-color: rgb(233, 233, 233);
}
a {
  text-decoration: none;
}
.error {
  color: red;
}
.layout-container {
  width: 100%;
  margin: 0 auto;
}
.header-container {
  position: fixed;
  z-index: 2;
  width: 100%;
  margin: auto;
  background-color: rgb(244, 171, 1);
  box-shadow: 0 4px 6px gray;
}
.pages-container {
  width: 90%;
  margin: 0 auto;
  padding: 100px 0 0 0;
}
@media screen and (max-width: 768px) {
  .pages-container {
    width: 100%;
    padding: 130px 0 0 0;
  }
}
</style>
