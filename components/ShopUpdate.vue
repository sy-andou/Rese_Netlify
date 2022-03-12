<template>
  <div class="shop-wrapper">
    <div class="shop-updateDetail-container">
      <ShopUpdateDetail
        v-bind:shop-list-name="name"
        v-bind:shop-list-img="imgUrl"
        v-bind:shop-list-img-default="img_pass"
        v-bind:shop-list-summary="summary"
        v-bind:shop-list-area="area"
        v-bind:shop-list-genre="genre"
        v-bind:shop-list-opening-time="opening_time"
        v-bind:shop-list-closing-time="closing_time"
        v-bind:shop-list-min-number="min_number"
        v-bind:shop-list-max-number="max_number"
      />
    </div>
    <div class="shop-container">
      <validation-observer ref="obs" v-slot="ObserverProps">
      <h2>ShopUpdateForm</h2>
      <img
        v-on:click="deleteShop"
        src="/img/cross.png"
        class="shop-delete-btn"
      />
      <form
        v-on:submit.prevent="updateShop(
          id,
          img_pass,
          name,
          area_id,
          genre_id,
          opening_time,
          closing_time,
          min_number,
          max_number,
          summary
        )">
        <validation-provider
          v-slot="ProviderProps"
          rules="required|max:20"
          class="reserve-input-container"
          >
          <div class="name-input-wrapper">
            <label class="inp">
              <input
                v-model="name"
                type="text"
                name="店舗名"
                placeholder=" "
                class="shop-name"
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
          rules=""
          class="reserve-input-container"
          >
          <div class="img-input-wrapper">
            <label class="inp">
              <input
                type="file"
                v-on:change ="multipleHandler"
                v-on:focus="imgBorderStylefocus"
                v-on:blur="imgBorderStyleblur"
                name="file"
                ref="preview"
                class="img-form"
              >
              <input type="hidden" v-model="img_pass">
              <span v-bind:class="{ customLabel: file_name }" class="img-label">Image</span>
              <p class="file-name">{{file_name}}</p>
              <span class="border"></span>
              <span v-if="imgBorderStyle" class="border-solid"></span>
            </label>
            <p class="error">{{ ProviderProps.errors[0] }}</p>
            <p v-show="errors.name" class="error">*{{ errors.file }}</p>
          </div>
        </validation-provider>
        <validation-provider
          v-slot="ProviderProps"
          rules="required|max:120"
          class="reserve-input-container"
        >
          <div class="summary-input-wrapper">
            <label class="inp">
              <textarea
                v-model="summary"
                ref="textarea"
                v-bind:style="textareaStyle"
                name="店舗概要"
                placeholder=" "
              ></textarea>
              <span class="label">Summary</span>
              <span class="border"></span>
            </label>
            <p class="error">{{ ProviderProps.errors[0] }}</p>
            <p v-show="errors.summary" class="error">*{{ errors.summary }}</p>
          </div>
        </validation-provider>
        <validation-provider
          v-slot="ProviderProps"
          rules="required"
          class="reserve-input-container"
          >
          <div class="area-input-wrapper">
            <label class="inp">
              <select
                v-model="area_id"
                name="エリア名"
                >
                <option
                  v-for="areaList in areaLists"
                  v-bind:key="areaList.id"
                  v-bind:value="areaList.id"
                  >
                {{ areaList.area }}
                </option>
              </select>
            </select>
              <span v-bind:class="{ customLabel: shopList.area_id }" class="area-label">Area</span>
              <span class="border"></span>
            </label>
            <p class="error">{{ ProviderProps.errors[0] }}</p>
            <p v-show="errors.area_id" class="error">*{{ errors.area }}</p>
          </div>
        </validation-provider>
        <validation-provider
          v-slot="ProviderProps"
          rules="required"
          class="reserve-input-container"
          >
          <div class="genre-input-wrapper">
            <label class="inp">
              <select
                v-model="genre_id"
                name="ジャンル名"
              >
                <option
                  v-for="genreList in genreLists"
                  v-bind:key="genreList.id"
                  v-bind:value="genreList.id"
                >
                {{ genreList.genre }}
                </option>
              </select>
            <span v-bind:class="{ customLabel: shopList.genre_id }" class="genre-label">Genre</span>
              <span class="border"></span>
            </label>
            <p class="error">{{ ProviderProps.errors[0] }}</p>
            <p v-show="errors.genre_id" class="error">*{{ errors.genre }}</p>
          </div>
        </validation-provider>
        <div class="time-input-container">
          <validation-provider
            v-slot="ProviderProps"
            rules="required"
            class="reserve-input-container"
            >
            <div class="opening_time-input-wrapper">
              <label class="inp">
                <select
                  v-model="opening_time"
                  class="time-select"
                  >
                  <option v-for="n in 24" v-bind:value="digitN(n) + ':00:00'">
                    {{ digitN(n) }}:00
                  </option>
                </select>
                <span v-bind:class="{ customLabel: shopList.opening_time }" class="opening_time-label">Opening_time</span>
                <span class="border"></span>
              </label>
              <p class="error">{{ ProviderProps.errors[0] }}</p>
              <p v-show="errors.opening_time" class="error">*{{ errors.opening_time }}</p>
            </div>
          </validation-provider>
          <div class="space">〜</div>
          <validation-provider
            v-slot="ProviderProps"
            rules="required"
            class="reserve-input-container"
            >
            <div class="closing_time-input-wrapper">
              <label class="inp">
                <select
                  v-model="closing_time"
                  class="time-select"
                  >
                  <option v-for="n in 24" v-bind:value="digitN(n) + ':00:00'">
                    {{ digitN(n) }}:00
                  </option>
                </select>
                <span v-bind:class="{ customLabel: shopList.closing_time }" class="closing_time-label">Closing_time</span>
                <span class="border"></span>
              </label>
              <p class="error">{{ ProviderProps.errors[0] }}</p>
              <p v-show="errors.closing_time" class="error">*{{ errors.closing_time }}</p>
            </div>
          </validation-provider>
        </div>
        <div class="number-input-container">
          <validation-provider
            v-slot="ProviderProps"
            rules="required"
            class="reserve-input-container"
            >
            <div class="min_number-input-wrapper">
              <label class="inp">
                <select
                  v-model="min_number"
                  class="number-select"
                  >
                  <option　v-for="n in 10" v-bind:value="n">{{n}}人</option>
                </select>
                <span v-bind:class="{ customLabel: shopList.min_number }" class="min_number-label">Min_number</span>
                <span class="border"></span>
              </label>
              <p class="error">{{ ProviderProps.errors[0] }}</p>
              <p v-show="errors.closing_time" class="error">*{{ errors.closing_time }}</p>
            </div>
          </validation-provider>
          <div class="space">〜</div>
          <validation-provider
            v-slot="ProviderProps"
            rules="required"
            class="reserve-input-container"
            >
            <div class="max_number-input-wrapper">
              <label class="inp">
                <select
                  v-model="max_number"
                  class="number-select"
                  >
                  <option　v-for="n in 50" v-bind:value="n">{{n}}人</option>
                </select>
                <span v-bind:class="{ customLabel: shopList.max_number }" class="max_number-label">Max_number</span>
                <span class="border"></span>
              </label>
              <p class="error">{{ ProviderProps.errors[0] }}</p>
              <p v-show="errors.max_number" class="error">*{{ errors.max_number }}</p>
            </div>
          </validation-provider>
        </div>
        <div class="update-btn-container">
          <input
            type="submit"
            value="店舗情報を更新する"
            class="shop-update-btn"
            />
        </div>
      </form>
      </validation-observer>
    </div>
  </div>
</template>
<script>
export default {
  props: ["shopList","areaLists","genreLists"],
  data() {
    return {
      selected_file: null,
      file_name: "",
      id:this.shopList.id,
      img_pass:this.shopList.img_pass,
      name:this.shopList.name,
      summary:this.shopList.summary,
      area_id:this.shopList.area_id,
      genre_id:this.shopList.genre_id,
      opening_time:this.shopList.opening_time,
      closing_time:this.shopList.closing_time,
      min_number:this.shopList.min_number,
      max_number:this.shopList.max_number,
      area:this.shopList.area.area,
      genre:this.shopList.genre.genre,
      imgUrl: "",
      textareaHeight: "",
      imgBorderStyle: true,
      errors: {
        id: "",
        name: "",
        img_pass: "",
        summary: "",
        opening_time: "",
        closing_time: "",
        min_number: "",
        max_number: "",
        user_id: "",
        area_id: "",
        genre_id: "",
      },
    };
  },
  methods: {
    /*ULファイルを選択したらそのファイル情報を取得*/
    fileSelect(event) {
      if(event.target.files[0]){
        this.selected_file = event.target.files[0];
        this.file_name = event.target.files[0].name;
        this.img_pass="https://reseimgbucket.s3.ap-northeast-3.amazonaws.com/"+this.file_name;
        this.imgUrl = URL.createObjectURL(this.$refs.preview.files[0])
      }
    },
    multipleHandler () {
      this.fileSelect(event);
    },
    async updateShop(id,img_pass,name,area,genre,opening_time,closing_time,min_number,max_number,summary) {
      try{
        if (window.confirm("店舗情報を更新いたしますか？")) {
          if(!this.file_name){
            const sendData = {
              name: name,
              img_pass: img_pass,
              summary: summary,
              opening_time: opening_time,
              closing_time: closing_time,
              min_number: min_number,
              max_number: max_number,
              user_id: this.$auth.user.id,
              area_id: area,
              genre_id: genre,
            };
            this.$nuxt.$emit("setLoading");
            await this.$axios.put("https://resebackend.herokuapp.com/api/shop/" +id, sendData)
              .then((response)=>{
                this.$nuxt.$emit("setLoading");
                alert(response.data.message);
              });
          }
          else if(this.file_name){
            const sendData = {
              name: name,
              img_pass: this.img_pass,
              summary: summary,
              opening_time: opening_time,
              closing_time: closing_time,
              min_number: min_number,
              max_number: max_number,
              user_id: this.$auth.user.id,
              area_id: area,
              genre_id: genre,
            };
            this.$nuxt.$emit("setLoading");
            await this.$axios.put("https://resebackend.herokuapp.com/api/shop/" +id, sendData)
              .then((response)=>{
                this.$nuxt.$emit("setLoading");
                let formData = new FormData();
                formData.append("file", this.selected_file);
                this.$axios.post("https://resebackend.herokuapp.com/api/storage", formData);
                alert(response.data.message);
              });
          }
          this.$emit("reload");
        }
        else{
          alert("店舗情報は更新されませんでした。");
        }
      }
      catch(response) {
          this.$nuxt.$emit("setLoading");
          var status = response.response.status;
          if (status == 400) {
            var errors = response.response.data.errors;
            this.errors.id = id;
            this.errors.name = errors.name ? errors.name[0] : "";
            this.errors.img_pass = errors.img_pass ? errors.img_pass[0] : "";
            this.errors.summary = errors.summary ? errors.summary[0] : "";
            this.errors.opening_time = errors.opening_time ? errors.opening_time[0] : "";
            this.errors.closing_time = errors.closing_time ? errors.closing_time[0] : "";
            this.errors.min_number = errors.min_number ? errors.min_number[0] : "";
            this.errors.max_number = errors.max_number ? errors.max_number[0] : "";
            this.errors.user_id = errors.user_id ? errors.user_id[0] : "";
            this.errors.area_id = errors.area_id ? errors.area_id[0] : "";
            this.errors.genre_id = errors.genre_id ? errors.genre_id[0] : "";
          }
          if (status === 404) {
            alert(response.response.data.message);
          }
        };
    },
    async deleteShop(id) {
      if (window.confirm("店舗情報を削除いたしますか？")) {
        this.$nuxt.$emit("setLoading");
        await this.$axios.delete("https://resebackend.herokuapp.com/api/shop/" + this.shopList.id);
        this.$nuxt.$emit("setLoading");
        alert("店舗情報を削除しました。");
        this.$emit("reload");
      }
      else{
        alert("削除は実行されませんでした。");
      }
    },
    resize(){
      this.textareaHeight = "auto";
      this.$nextTick(()=>{
        this.textareaHeight = this.$refs.textarea.scrollHeight + 'px';
      })
    },
    findArea(){
      const areaList = this.areaLists.find((areaList)=>{
        return areaList.id===this.area_id;
      });
      this.area = areaList.area;
    },
    findGenre(){
      const genreList = this.genreLists.find((genreList)=>{
        return genreList.id===this.genre_id;
      });
      this.genre = genreList.genre;
    },
    imgBorderStylefocus(){
      this.imgBorderStyle=false;
    },
    imgBorderStyleblur(){
      this.imgBorderStyle=true;
    },
  },
  computed: {
    digitN(){
      return function(n){
        return ( '0' + n ).slice( -2 );
      }
    },
    textareaStyle(){
        if(this.summary){
          return {
            "height": this.textareaHeight,
          }
        }
    },
    nameCheck(){
      return this.name;
    },
    summaryCheck(){
      return this.summary;
    },
    openingTimeCheck(){
      return this.opening_time;
    },
    closingTimeCheck(){
      return this.closing_time;
    },
    minNumberCheck(){
      return this.min_number;
    },
    minNumberCheck(){
      return this.max_number;
    },
  },
  created() {
  },
  watch:{
    summary(){
      this.resize();
    },
    area_id(){
      this.findArea();
    },
    genre_id(){
      this.findGenre();
    },
  },
  mounted(){
    this.resize();
  },
};
</script>
<style scoped>

.shop-wrapper {
  display: grid;
  grid-template-columns: 50% 50%;
  width: 100%;
  height:auto;
  margin:0 0 30px 0;
  padding:20px;
  background-color:white;
  box-shadow: 2px 2px 4px gray;
}
.shop-container {
  position: relative;
  width:100%;
  height:auto;
  background-color:white;
  box-shadow: 2px 2px 4px gray;
}
.error {
  margin: 5px 0 5px 10%;
  white-space: nowrap
}
input[type="file"]{
  opacity:0;
}
.border-solid{
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  border-bottom: 2px solid #c8ccd4;
}
.customLabel {
  color: #5a667f;
  transform: translateY(-26px) scale(0.75);
}
.file-name{
  position: absolute;
  top: 15px;
  left: 5px;
  width: 100%;
  font-size: 16px;
}
h2 {
  padding: 20px;
  font-size: 20px;
  background-color: rgb(244, 171, 1);
}
.shop-delete-btn{
position: absolute;
  top: 15px;
  right: 10px;
  cursor:pointer;
}
form {
  margin: 40px auto;
  width: 90%;
}
.name-input-wrapper,
.img-input-wrapper,
.summary-input-wrapper,
.area-input-wrapper,
.genre-input-wrapper,
.opening_time-input-wrapper,
.closing_time-input-wrapper,
.min_number-input-wrapper,
.max_number-input-wrapper {
  min-height: 90px;
  width: 100%;
  margin: 0 auto;
}
.summary-input-wrapper{
  margin:0 0 50px 0;
}
.time-input-container,
.number-input-container{
  display:grid;
  grid-template-columns:10% 35% 10% 40%;
  width:100%;
}
.space{
  margin:40% 0 0 0;
}
.name-input-wrapper::before{
  content: "";
  background: url(./static/img/title.png);
  background-size: cover;
  vertical-align: bottom;
  width: 40px;
  height: 40px;
  display: inline-block;
}
.img-input-wrapper::before{
  content: "";
  background: url(./static/img/img.png);
  background-size: cover;
  vertical-align: bottom;
  width: 40px;
  height: 40px;
  display: inline-block;
}
.summary-input-wrapper::before{
  content: "";
  background: url(./static/img/summary.png);
  background-size: cover;
  vertical-align:top;
  width: 40px;
  height: 40px;
  display: inline-block;
}
.area-input-wrapper::before{
  content: "";
  background: url(./static/img/area.png);
  background-size: cover;
  vertical-align: bottom;
  width: 40px;
  height: 40px;
  display: inline-block;
}
.genre-input-wrapper::before{
  content: "";
  background: url(./static/img/genre.png);
  background-size: cover;
  vertical-align: bottom;
  width: 40px;
  height: 40px;
  display: inline-block;
}
.time-input-container::before{
  content: "";
  background: url(./static/img/time.png);
  background-size: cover;
  vertical-align: bottom;
  width: 40px;
  height: 40px;
  display: inline-block;
}
.number-input-container::before{
  content: "";
  background: url(./static/img/number.png);
  background-size: cover;
  vertical-align: bottom;
  width: 40px;
  height: 40px;
  display: inline-block;
}
.img-form{
  color:white;
}
.input-check-wrapper{
  margin:20px 0;
  padding: 10px;
  border-radius: 5px;
  overflow: hidden;
  background-color:rgba(100, 166, 255);
}
.input-check {
  display: flex;
}
.index-ttl{
  width:50%;
  margin:5px;
  color:white;
}
.inp {
  display: inline-block;
  position: relative;
  margin: auto 5px;
  width: 80%;
}
.inp .label,
.img-label,
.area-label,
.genre-label,
.opening_time-label,
.closing_time-label,
.min_number-label,
.max_number-label {
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
select,
textarea {
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
select:hover,
textarea:hover {
  background: rgba(34, 50, 84, 0.03);
}
.inp input:not(:placeholder-shown) + .label {
  color: #5a667f;
  transform: translateY(-26px) scale(0.75);
}
.inp textarea:not(:placeholder-shown) + .label {
  color: #5a667f;
  transform: translateY(-26px) scale(0.75);
}
.inp input:focus,
select:focus,
textarea:focus {
  background: none;
  outline: none;
}
.inp input:focus + span,
select:focus + span,
textarea:focus + span {
  color: #07f;
  transform: translateY(-26px) scale(0.75);
}
.inp input:focus + span + .border,
select:focus + span + .border,
textarea:focus + span + .border {
  transform: scaleX(1);
}
.index-data{
  display:flex;
  justify-content:start;
  width:50%;
  margin:5px;
  color:white;
}
.update-btn-container{
  width: 80%;
  margin: 0 0 0 40px;
  text-align: right;
}
.shop-update-btn{
  width: 50%;
  padding: 5px;
  border-radius: 3px;
  color: white;
  background-color: rgb(0, 108, 255);
  cursor: pointer;
}
@media screen and (max-width: 768px) {
  .shop-wrapper {
    display: block;
    padding:20px 0;
  }
  .shop-updateDetail-container{
    display:none;
  }
}
</style>
