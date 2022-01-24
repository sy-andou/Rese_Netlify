<template>
  <div>
    <div class="reserve-check-wrapper">
      <div class="reserve-ttl-container">
        <img src="/img/clock.png" />
        <p>{{ reserveList.name }}</p>
      </div>
      <div class="reserve-infomation-container">
        <div class="reserve-infomation">
          <p>Customer</p>
          <p>{{ userList.name }} 様</p>
        </div>
        <div class="reserve-infomation">
          <p>Shop</p>
          <p>{{ shopList.name }}</p>
        </div>
        <div class="reserve-infomation">
          <p>Date</p>
          <p>{{ reserveList.date }}</p>
        </div>
        <div class="reserve-infomation">
          <p>Time</p>
          <p>{{ reserveList.time }}</p>
        </div>
        <div class="reserve-infomation">
          <p>Number</p>
          <p>{{ reserveList.number }}人</p>
        </div>
      </div>
      <div>
        <input
          v-on:click="insertReview(reserveList.id)"
          type="submit"
          value="来店を確認しました"
          class="btn"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: "representative",
  data() {
    return {
      reserveList: [],
      userList: [],
      shopList: [],
    };
  },
  methods: {
    async showReserve(id) {
      const reserveData = await this.$axios.get(
        "https://resebackend.herokuapp.com/api/reserve/" + id
      );
      this.reserveList = reserveData.data.data[0];
      this.userList = this.reserveList.user;
      this.shopList = this.reserveList.shop;
    },
    async insertReview(id) {
      try {
        if (this.$auth.user.id === this.shopList.user_id) {
          if (window.confirm("来店を確認しましたか？")) {
            const sendData = {
              reserve_id: id,
            };
            await this.$axios
              .post("https://resebackend.herokuapp.com/api/review/", sendData)
              .then((response) => {
                alert(response.data.message);
                this.$router.push("/representative");
              });
          } else {
            alert("来店確認は実施されませんでした。");
          }
        } else {
          alert("店舗代表者以外の方が来店確認を行うことはできません");
        }
      } catch (response) {
        var status = response.response.status;
        if (status === 404) {
          alert(response.response.data.message);
        }
      }
    },
  },
  created() {
    this.showReserve(this.$route.params.reserveId);
  },
};
</script>

<style scoped>
* {
  color: white;
}
.reserve-check-wrapper {
  position: relative;
  height: 300px;
  width: 500px;
  margin: 30px 0;
  padding: 20px;
  background-color: rgba(0, 108, 255);
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 2px 2px 4px gray;
}
.reserve-ttl-container {
  display: flex;
  align-items: center;
  margin: 0 0 10px 0;
}
.reserve-ttl-container > p {
  margin: 0 20px;
}
.reserve-infomation {
  display: flex;
}
.reserve-infomation > p,
.reserve-infomation > input,
.reserve-infomation > select {
  width: 200px;
  margin: 5px 0;
  padding: 10px 0;
}
.btn {
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: auto;
  padding: 10px 0;
  margin: 0px;
  color: white;
  background-color: blue;
  border: none;
}
</style>
