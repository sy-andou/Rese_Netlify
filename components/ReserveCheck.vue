<template>
  <div class="reserve-check-wrapper">
    <div class="reserve-check-menu-container">
      <p v-bind:style="reserveStatusStyle" class="reserve-status">{{ reserveList.status }}</p>
      <div class="reserve-left-container">
        <img v-bind:src="reserveList.shop.img_pass" class="shop-img" />
        <div v-if="reserveList.review&&reviewDisplay" class="review-wrapper">
          <ReviewForm
            v-bind:review-list="reserveList.review"
            v-on:closeReviewWindow="reviewDisplay=false"
            />
        </div>
        <div v-show="qr_modal" v-on:click="qr_modal=false" class="qr_modal">
          <img
            src="/img/cross2.png"
            v-on:click="qr_modal=false"
            class="qr_modal-close-btn"
          />
          <qriously
            v-bind:value="showReserves(reserveList.id)"
            class="qrcode"
            :size="200"
          />
        </div>
      </div>
      <div　class="reserve-check-menu">
        <div v-on:click="qrModalChange" class="qr-container">
          <qriously v-bind:value="showReserves(reserveList.id)" :size="50" />
        </div>
        <div class="menu-btn-container">
          <span>
            <input
              v-if="btnDisplay"
              v-on:click="deleteReserve(reserveList.id)"
              class="menu-btn"
              type="submit"
              value="予約をキャンセルする"
            />
            <input v-else
              v-on:click="cannotBtnClick"
              class="menu-btn"
              type="submit"
              value="予約はキャンセルできません"
            />
          </span>
          <span>
            <input
              v-show="reviewBtnDisplay"
              v-on:click="reviewDisplayChange"
              class="menu-btn"
              type="submit"
              value="レビューを投稿する"/>
          </span>
        </div>
      </div>
    </div>
    <div class="reserve-check-container">
      <validation-observer ref="obs" v-slot="ObserverProps">
        <h2>{{ reserveList.name }}</h2>
        <form
          v-on:submit.prevent="
            updateReserve(
              reserveList.id,
              reserveList.user_id,
              reserveList.shop_id,
              reserveList.date,
              reserveList.time,
              reserveList.number
            )
          "
        >
          <img
            v-show="btnDisplay"
            v-on:click="deleteReserve(reserveList.id)"
            src="/img/cross.png"
            class="reserve-delete-btn"
          />
          <validation-provider
            v-slot="ProviderProps"
            rules="required|max:20"
            class="reserve-input-container"
          >
            <div class="name-input-wrapper">
              <label class="inp">
                <input
                  v-bind:value="reserveList.shop.name"
                  readonly
                  type="text"
                  name="予約名"
                  class="reserve-name-form"
                  placeholder=" "
                />
                <span class="label">Shop_name</span>
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
                  type="date"
                  v-model="reserveList.date"
                  v-bind:style="inputCssVars"
                  v-on:focus="displayDate(reserveList.date)"
                  v-on:blur="displayDate(reserveList.date)"
                  name="来店日"
                />
                <span
                  v-bind:class="{ customLabel: reserveList.date }"
                  class="date-label"
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
                <select v-model="reserveList.time" name="来店時間">
                  <option
                    v-for="time in calReserveTime"
                    v-bind:value="time + ':00'"
                  >
                    {{ time }}
                  </option>
                </select>
                <span
                  v-bind:class="{ customLabel: reserveList.time }"
                  class="time-label"
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
              v-if="reserveList.date && reserveList.time" class="number-input-wrapper"
            >
              <label class="inp">
                <select v-model="reserveList.number" name="予約人数">
                  <option
                    v-for="n in calReserveNumber"
                    v-bind:value="n - 1 + reserveList.shop.min_number"
                  >
                    {{ n - 1 + reserveList.shop.min_number }}人
                  </option>
                </select>
                <span
                  v-bind:class="{ customLabel: reserveList.number }"
                  class="number-label"
                  >Number</span
                >
                <span class="border"></span>
              </label>
              <p class="error">{{ ProviderProps.errors[0] }}</p>
              <p v-show="errors.date" class="error">*{{ errors.number }}</p>
            </div>
            <div v-else class="number-input-wrapper">
            <span class="cannot-select"
              >予約人数の入力は予約日時選択後に実施ください</span
            >
          </div>
          </validation-provider>
          <div class="reserve-btn-container">
            <input
              v-if=" btnDisplay"
              type="submit"
              value="予約内容を変更する"
              class="reserve-btn"
            />
            <input
              v-else
              v-on:click.prevent="cannotBtnClick"
              type="submit"
              value="予約内容は変更できません"
              class="reserve-btn"
            />
          </div>
        </form>
      </validation-observer>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: ["reserveList","sumReserveNumber"],
  data() {
    return {
      reviewDisplay:false,
      qr_modal: false,
      dateState: "visible",
      fixedReserveList:[],
      errors: {
        user_id: "",
        shop_id: "",
        date: "",
        time: "",
        number: "",
      },
    };
  },
  methods: {
    async updateReserve(id, user_id, shop_id, date, time, number) {
      if (this.$auth.loggedIn) {
        try{
          if (window.confirm("予約内容を変更しますか？")) {
            const sendData = {
              login_user: this.$auth.user.id,
              user_id: user_id,
              shop_id: shop_id,
              date: date,
              time: time,
              number: number,
            };
            await this.$axios
              .put("https://resebackend.herokuapp.com/api/reserve/" + id, sendData)
              .then((response) => {
                alert(response.data.message);
                this.$emit("reload");
              });
          } else {
            alert("予約内容は変更されませんでした。");
          }
        } catch (response) {
            if (!this.$auth.loggedIn) {
              this.$router.replace("/login");
            }
            var status = response.response.status;
            if (status == 400) {
              var errors = response.response.data.errors;
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
        this.$router.replace("/login");
      }
    },
    async deleteReserve(id) {
      if(this.reserveList.user_id === this.$auth.user.id){
        if (window.confirm("予約をキャンセルいたしますか？")) {
          await this.$axios.delete("https://resebackend.herokuapp.com/api/reserve/" + id);
          alert('予約をキャンセルしました。');
          this.$emit("reload");
        }
        else{
          alert('予約はキャンセルされませんでした。');
        }
      }
      else{
        alert('ログインユーザーと予約者が異なるので削除できません。');
      }
    },
    cannotBtnClick(){
      if(this.reserveList.deleted_at){
        alert('この予約は削除済みです。');
      }
      else if(this.reserveList.user_id !== this.$auth.user.id){
        alert('予約ユーザーとログインユーザーが異なっております。')
      }
      else if(this.reserveList.date<=moment().add(1, "d").format("YYYY-MM-DD")){
        alert('来店予定日は明日以降の日付を選択してください。');
      }
      else if(this.reserveList.review){
        alert('来店済みなので更新・削除はできません。');
      }
      else if(this.reserveList.date < moment().format("YYYY-MM-DD")){
        alert('来店予定日が過ぎておりますので更新・削除はできません。。');
      }
    },
    showReserves(id) {
      return "http://localhost:3000/reserves/" + id;
    },
    displayDate(date) {
      if (this.dateState === "collapse" || date) {
        this.dateState = "visible";
      } else {
        this.dateState = "collapse";
      }
    },
    reviewDisplayChange(){
      if(this.reviewDisplay===false){
        this.reviewDisplay = true;
      }
      else if(this.reviewDisplay===true){
        this.reviewDisplay = false;
      }
    },
    qrModalChange(){
      if(this.qr_modal===false){
        this.qr_modal = true;
      }
      else if(this.qr_modal===true){
        this.qr_modal = false;
      }
    },
    async getFixedReserveList(){
      if(this.reserveList.deleted_at!==null||this.reserveList.review!==null||this.reserveList.date<moment().format("YYYY-MM-DD")){
        return [];
      }
      else{
        const reserveData = await this.$axios.get(
          "https://resebackend.herokuapp.com/api/reserve/" + this.reserveList.id
        );
        this.fixedReserveList = reserveData.data.data;
      }
    },
  },
  computed: {
    inputCssVars() {
      return {
        "--datetime-display-state": this.dateState,
      };
    },
    calReserveTime() {
      let arrayTime = [];
      for (
        let i = Number(this.reserveList.shop.opening_time.split(":")[0]);
        i <= Number(this.reserveList.shop.closing_time.split(":")[0]);
        i++
      ) {
        arrayTime.push(i.toString() + ":00");
      }
      return arrayTime;
    },
    btnDisplay(){
      if(this.reserveList.deleted_at||this.reserveList.review!==null||moment().add(1, "d").format("YYYY-MM-DD")>=this.reserveList.date||this.reserveList.user_id !== this.$auth.user.id){
        return false;
      }
      else{
        return true;
      }
    },
    reviewBtnDisplay(){
      if(this.reserveList.review!==null){
        if(this.reserveList.review.evaluation!==null){
          return false;
        }
        else{
          return true;
        }
      }
      else{
        return false;
      }
    },
    reserveStatusStyle(){
      let today = moment().format("YYYY-MM-DD");
      if (this.reserveList.status==="予約削除済") {
        return {
          color:'rgb(216, 12, 73)',
          backgroundColor:'rgb(95, 81, 47)',
        };
      }
      if (this.reserveList.status==="予約日超過"||this.reserveList.status==="レビュー投稿済") {
        return {
          color:'white',
          backgroundColor:'rgb(95, 81, 47)',
        };
      }
      if (this.reserveList.status==="本日の予約") {
        return {
          color:'white',
          backgroundColor:'rgb(216, 12, 73)',
        };
      } else if (this.reserveList.status==="予約中"||this.reserveList.status==="レビュー未投稿") {
        return {
          backgroundColor:'rgb(244, 171, 1)',
        };
      }
    },
    calReserveNumber() {
      if(this.fixedReserveList.length===0){
        return this.reserveList.shop.max_number - this.reserveList.shop.min_number+ 1 ;
      }
      else if(this.fixedReserveList.date===this.reserveList.date&&this.fixedReserveList.time===this.reserveList.time){
        return this.reserveList.shop.max_number - this.reserveList.shop.min_number+ 1 - this.sumReserveNumber + this.fixedReserveList.number;
      }
      else{
        return this.reserveList.shop.max_number - this.reserveList.shop.min_number+ 1 - this.sumReserveNumber;
      }
    },
  },
  created() {
    this.getFixedReserveList();
  },
  mounted(){},
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
.qr-container {
  display: inline-block;
  cursor: pointer;
}
.reserve-check-wrapper {
  display: grid;
  grid-template-columns: 50% 50%;
  width:  auto;
  margin: 0;
  padding: 10px;
  box-shadow: 2px 2px 4px gray;
  background-color: white;
}
.reserve-check-menu{

  margin:20px 0;
  width:auto;
}
.reserve-left-container{
  position:relative;
}
.review-wrapper{
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
}
.reserve-check-menu *{
  margin:0 20px 0 0;
}
.reserve-status{
  padding:20px;
  font-size:20px;
  font-weight:bold;
}
.menu-btn-container{
  display:inline-block;
  width:auto;
}
.menu-btn{
  display:inline-block;
  width: auto;
  padding: 5px 10px;
  border-radius: 3px;
  color: white;
  background-color: rgb(0, 108, 255);
  cursor: pointer;
}
.shop-img {
  width: 100%;
}
.reserve-check-container {
  position: relative;
  max-width: 600px;
  width: auto;
  height: auto;
  margin: 0 0 0 30px;
  overflow: hidden;
  box-shadow: 2px 2px 4px gray;
  background-color: white;
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
.reserve-delete-btn {
  position: absolute;
  top: 15px;
  right: 10px;
  cursor:pointer;
}
.reserve-infomation-container {
  margin: 20px 0;
}
.reserve-infomation {
  display: flex;
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
.modal {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}
.reserve-infomation > div > input,
.reserve-infomation > div > select {
  width: 200px;
  padding: 10px 0;
  background-color: rgba(100, 166, 255);
  border-radius: 5px;
  border: none;
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
.error {
  color: red;
}
.qr_modal {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
}
.qr_modal-close-btn {
  position: absolute;
  top: 5%;
  left: 5%;
  height: auto;
  width: 5%;
}
.qrcode {
  position: absolute;
  top: 50%;
  left: 50%;
  width:auto;
  transform: translate(-50%, -50%);
  text-align: center;
  background-color: white;
}
@media screen and (max-width: 768px) {
  .reserve-check-wrapper {
    display: block;
    padding:0;
  }
  .reserve-check-container {
    width: 100%;
    height: auto;
    margin: 0 ;
  }
  .reserve-check-menu{
    align-items:start;
    margin:5px 0;
}
  .menu-btn-container{
    display:flex;
    flex-direction:column;
  }
  .menu-btn{
    display:block;
    width:;
    padding:0;
    margin:0 0 5px 0;
  }
  .reserve-infomation-container {
    margin: 0;
  }
  .reserve-delete-btn {
    position: absolute;
    top: 5px;
    right: 5px;
  }

}
</style>
