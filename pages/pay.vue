<template>
  <div>
    <p>
      <img
        src="https://reseimgbucket.s3.ap-northeast-3.amazonaws.com/elephant.png"
      />
    </p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      shopLists: [],
    };
  },
  methods: {
    getShopData() {
      const shopData = this.$axios.get("http://127.0.0.1:8000/api/auth/user");
      this.shopLists = shopData.data;
    },
  },
  created() {
    this.getShopData();
  },
};
</script>
