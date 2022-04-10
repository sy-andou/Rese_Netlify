<template>
  <div class="reserve-wrapper">
    <validation-observer ref="obs" v-slot="ObserverProps">
      <h2>Reserve</h2>
      <form v-on:submit.prevent="insertReserve">
        <validation-provider
          v-slot="ProviderProps"
          rules="max:40"
          class="reserve-input-container"
        >
          <div class="name-input-wrapper">
            <label class="inp">
              <input
                v-model="name"
                type="text"
                name="予約名"
                class="reserve-name-form"
                placeholder=" "
              />
              <span class="label">Title (Feel free to enter)</span>
              <span class="border"></span>
            </label>
            <p class="error">{{ ProviderProps.errors[0] }}</p>
            <p v-show="errors.name" class="error">*{{ errors.name }}</p>
          </div>
        </validation-provider>
        <validation-provider
          v-slot="ProviderProps"
          rules="required"
          class="reserve-input-container"
        >
          <div class="date-input-wrapper">
            <label class="inp">
              <input
                v-model="date"
                v-bind:style="inputCssVars"
                v-on:focus="displayDate"
                v-on:blur="displayDate"
                type="date"
                name="日付"
                class="reserve-date-form"
              />
              <span v-bind:class="{ customLabel: date }" class="date-label"
                >Date</span
              >
              <span class="border"></span>
            </label>
            <p class="error">{{ ProviderProps.errors[0] }}</p>
            <p v-show="errors.date" class="error">*{{ errors.date }}</p>
          </div>
        </validation-provider>
        <validation-provider
          v-slot="ProviderProps"
          rules="required"
          class="reserve-input-container"
        >
          <div class="time-input-wrapper">
            <label class="inp">
              <select v-model="time" name="時間">
                <option
                  v-for="time in calReserveTime"
                  v-bind:value="time + ':00'"
                >
                  {{ time }}
                </option>
              </select>
              <span v-bind:class="{ customLabel: time }" class="time-label"
                >Time</span
              >
              <span class="border"></span>
            </label>
            <p class="error">{{ ProviderProps.errors[0] }}</p>
            <p v-show="errors.date" class="error">*{{ errors.time }}</p>
          </div>
        </validation-provider>
        <validation-provider
          v-slot="ProviderProps"
          rules="required"
          class="reserve-input-container"
        >
          <div
            v-if="
              date &&
              time &&
              $store.state.shops.shopList.max_number !== sumReserveNumber
            "
            class="number-input-wrapper"
          >
            <label class="inp">
              <select v-model="number" name="人数">
                <option
                  v-for="n in calReserveNumber"
                  v-bind:value="n - 1 + $store.state.shops.shopList.min_number"
                >
                  {{ n - 1 + $store.state.shops.shopList.min_number }}人
                </option>
              </select>
              <span v-bind:class="{ customLabel: number }" class="number-label"
                >Number</span
              >
              <span class="border"></span>
            </label>
            <p class="error">{{ ProviderProps.errors[0] }}</p>
            <p v-show="errors.date" class="error">*{{ errors.number }}</p>
          </div>
          <div
            v-else-if="
              date &&
              time &&
              $store.state.shops.shopList.max_number === sumReserveNumber
            "
            class="number-input-wrapper"
          >
            <span class="cannot-select" style="color: red"
              >予約可能人数に空きがありません。別の日時を選択してください。</span
            >
          </div>
          <div v-else class="number-input-wrapper">
            <span class="cannot-select"
              >予約人数の入力は予約日時選択後に実施ください</span
            >
          </div>
        </validation-provider>
        <div class="input-check-wrapper">
          <div class="input-check">
            <p class="reserve-item">Title</p>
            <p class="reserve-data">{{ defaultReserveName }}</p>
          </div>
          <div class="input-check">
            <p class="reserve-item">User</p>
            <p v-if="$auth.loggedIn" class="reserve-data">
              {{ $auth.user.name }}様
            </p>
            <p v-else class="reserve-data" style="color: red">
              ログインしてください
            </p>
          </div>
          <div class="input-check">
            <p class="reserve-item">Shop</p>
            <p class="reserve-data">{{ $store.state.shops.shopList.name }}</p>
          </div>
          <div class="input-check">
            <p class="reserve-item">Date</p>
            <p class="reserve-data">{{ date }}</p>
          </div>
          <div class="input-check">
            <p class="reserve-item">Time</p>
            <p class="reserve-data">{{ time }}</p>
          </div>
          <div class="input-check">
            <p class="reserve-item">Number</p>
            <p class="reserve-data">
              {{ number }}<span v-show="number">人</span>
            </p>
          </div>
        </div>
        <div class="reserve-btn-container">
          <input
            v-if="$auth.loggedIn"
            type="submit"
            value="予約する"
            class="reserve-btn"
          />
          <input
            v-else
            type="submit"
            value="予約はログイン後に実施してください"
            class="reserve-btn"
          />
        </div>
      </form>
    </validation-observer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dateState: "collapse",
      name: "",
      date: "",
      time: "",
      number: "",
      errors: {
        name: "",
        user_id: "",
        shop_id: "",
        date: "",
        time: "",
        number: "",
      },
    };
  },
  methods: {
    async insertReserve() {
      if (this.$auth.loggedIn) {
        try {
          if (window.confirm("予約を実施いたしますか？")) {
            const sendData = {
              name: this.defaultReserveName,
              user_id: this.$auth.user.id,
              shop_id: this.$route.params.shopId,
              date: this.date,
              time: this.time,
              number: this.number,
            };
            let reserveCreateData = await this.$axios
              .post("https://resebackend.herokuapp.com/api/reserve", sendData)
              .then((response) => {
                alert(response.data.message);
                this.$router.push("/done");
              });
          } else {
            alert("予約は実施されませんでした。");
          }
        } catch (response) {
          var status = response.response.status;
          if (status == 400) {
            var errors = response.response.data.errors;
            this.errors.name = errors.name ? errors.name[0] : "";
            this.errors.user_id = errors.user_id ? errors.user_id[0] : "";
            this.errors.shop_id = errors.shop_id ? errors.shop_id[0] : "";
            this.errors.date = errors.date ? errors.date[0] : "";
            this.errors.time = errors.time ? errors.time[0] : "";
            this.errors.number = errors.number ? errors.number[0] : "";
          }
          if (status === 404) {
            alert(response.response.data.message);
          }
        }
      } else {
        this.$router.push("/login");
      }
    },
    displayDate() {
      if (this.dateState === "collapse" || this.date) {
        this.dateState = "visible";
      } else {
        this.dateState = "collapse";
      }
    },
  },
  computed: {
    inputCssVars() {
      return {
        "--datetime-display-state": this.dateState,
      };
    },
    defaultReserveName() {
      if (this.$auth.loggedIn) {
        if (this.name) {
          return this.name;
        } else {
          return (
            "【" +
            this.$auth.user.name +
            "様】" +
            this.$store.state.shops.shopList.name +
            "へのご来店"
          );
        }
      }
    },
    sumReserveNumber() {
      let sumReserveNumber = 0;
      this.$store.state.shops.shopList.reserve
        .filter((reserveList) => {
          return reserveList.date === this.date;
        })
        .filter((reserveList) => {
          return reserveList.time === this.time;
        })
        .forEach((reserveList) => {
          return (sumReserveNumber += reserveList.number);
        });
      return sumReserveNumber;
    },
    calReserveNumber() {
      let sumReserveNumber = 0;
      this.$store.state.shops.shopList.reserve
        .filter((reserveList) => {
          return reserveList.date === this.date;
        })
        .filter((reserveList) => {
          return reserveList.time === this.time;
        })
        .forEach((reserveList) => {
          return (sumReserveNumber += reserveList.number);
        });
      return (
        this.$store.state.shops.shopList.max_number -
        this.$store.state.shops.shopList.min_number +
        1 -
        sumReserveNumber
      );
    },
    calReserveTime() {
      if (
        this.$store.state.shops.shopList.opening_time &&
        this.$store.state.shops.shopList.closing_time
      ) {
        let arrayTime = [];
        for (
          let i = Number(
            this.$store.state.shops.shopList.opening_time.split(":")[0]
          );
          i <=
          Number(this.$store.state.shops.shopList.closing_time.split(":")[0]);
          i++
        ) {
          arrayTime.push(i.toString() + ":00");
        }
        return arrayTime;
      }
    },
  },
  mounted() {},
  beforeUpdate() {},
};
</script>
<style scoped>
.customLabel {
  color: #5a667f;
  transform: translateY(-26px) scale(0.75);
}
input[type="date"]::-webkit-datetime-edit {
  visibility: var(--datetime-display-state);
}
input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  left: -30px;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
}
.error {
  margin: 5px 0 5px 50px;
}
.reserve-wrapper {
  width: 100%;
  margin: 65px 0;
  overflow: hidden;
  background-color: white;
  box-shadow: 2px 2px 4px gray;
}
h2 {
  padding: 20px;
  font-size: 20px;
  background-color: rgb(244, 171, 1);
}
form {
  margin: 40px auto;
  width: 90%;
}
.name-input-wrapper,
.date-input-wrapper,
.time-input-wrapper,
.number-input-wrapper {
  height: 90px;
  width: 100%;
  margin: 0 auto;
}
.name-input-wrapper::before {
  content: "";
  background: url(./static/img/title.png);
  background-size: cover;
  vertical-align: bottom;
  width: 40px;
  height: 40px;
  display: inline-block;
}
.date-input-wrapper::before {
  content: "";
  background: url(./static/img/calendar.png);
  background-size: cover;
  vertical-align: bottom;
  width: 40px;
  height: 40px;
  display: inline-block;
}
.time-input-wrapper::before {
  content: "";
  background: url(./static/img/time.png);
  background-size: cover;
  vertical-align: bottom;
  width: 40px;
  height: 40px;
  display: inline-block;
}
.number-input-wrapper::before {
  content: "";
  background: url(./static/img/number.png);
  background-size: cover;
  vertical-align: bottom;
  width: 40px;
  height: 40px;
  display: inline-block;
}
.reserve-name-form {
}
input[type="date"] {
  position: relative;
}
.inp {
  display: inline-block;
  position: relative;
  margin: auto 5px;
  width: 80%;
}
.inp .label,
.date-label,
.time-label,
.number-label {
  position: absolute;
  top: 15px;
  left: 5px;
  width: 100%;
  font-size: 16px;
  color: #9098a9;
  font-weight: 500;
  transform-origin: 0 0;
  transition: all 0.2s ease;
}

.inp .border {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background: #07f;
  transform: scaleX(0);
  transform-origin: 0 0;
  transition: all 0.15s ease;
}
.inp input,
select {
  -webkit-appearance: none;
  width: 100%;
  padding: 0 0 0 5px;
  border: 0;
  font-family: inherit;
  height: 40px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 2px solid #c8ccd4;
  background: none;
  border-radius: 0;
  color: #223254;
  transition: all 0.15s ease;
  z-index: 1;
}
.inp input:hover,
select:hover {
  background: rgba(34, 50, 84, 0.03);
}
.inp input:not(:placeholder-shown) + .label {
  color: #5a667f;
  transform: translateY(-26px) scale(0.75);
}
.inp input:focus,
select:focus {
  background: none;
  outline: none;
}
.inp input:focus + span,
select:focus + span {
  color: #07f;
  transform: translateY(-26px) scale(0.75);
}
.inp input:focus + span + .border,
select:focus + span + .border {
  transform: scaleX(1);
}
.cannot-select {
  display: inline-block;
  width: 80%;
  margin: 0 0 0 5px;
  padding: 0 0 5px 0;
  color: #9098a9;
  font-weight: 500;
  font-family: inherit;
  border-radius: 0;
  background: none;
  border-bottom: 2px solid #c8ccd4;
}
.input-check-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: ;
  margin: 20px 0;
  padding: 20px;
  background-color: white;
  box-shadow: 1px 1px 2px gray;
}
.input-check {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.reserve-item {
  width: 30%;
}
.reserve-data {
  width: 70%;
}
.reserve-btn-container {
  width: 80%;
  margin: 0 0 0 40px;
  text-align: right;
}
.reserve-btn {
  width: auto;
  padding: 5px 20px;
  border-radius: 3px;
  color: white;
  background-color: rgb(0, 108, 255);
  cursor: pointer;
}
</style>
