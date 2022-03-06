<template>
  <div class="shop-create-wrapper">
  <validation-observer ref="obs" v-slot="ObserverProps">
    <h2>ShopCreateForm</h2>
    <form v-on:submit.prevent="createShop">
      <validation-provider
        v-slot="ProviderProps"
        rules="required|max:20"
        class="reserve-input-container"
      >
        <div class="name-input-wrapper">
          <label class="inp">
            <input v-model="name"
            type="text" name="店舗名"
            placeholder=" "
            v-on:change="previewData"
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
        <div class="img-input-wrapper">
          <label class="inp">
            <input　
              v-on:change ="multipleHandler"
              v-on:focus="imgBorderStylefocus"
              v-on:blur="imgBorderStyleblur"
              ref="preview"
              type="file"
              name="file"
              class="img-form"
            />
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
              v-on:change="previewData"
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
                v-on:change="previewData"
              >
                <option
                  v-for="areaList in areaLists"
                  v-bind:key="areaList.id"
                  v-bind:value="areaList.id"
                >
                {{ areaList.area }}
                </option>
              </select>
              <span v-bind:class="{ customLabel: area_id }" class="area-label">Area</span>
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
                v-on:change="previewData"
              >
                <option
                  v-for="genreList in genreLists"
                  v-bind:key="genreList.id"
                  v-bind:value="genreList.id"
                >
                  {{ genreList.genre }}
                </option>
              </select>
              <span v-bind:class="{ customLabel: genre_id }" class="genre-label">Genre</span>
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
                <select v-model="opening_time" name="営業開始時刻" v-on:change="previewData">
                  <option v-for="n in 24" v-bind:value="n+':00:00'">{{n}}:00</option>
                </select>
                <span v-bind:class="{ customLabel: opening_time }" class="opening_time-label">Opening_time</span>
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
                <select v-model="closing_time" name="営業終了時刻" v-on:change="previewData">
                  <option v-for="n in 24" v-bind:value="n+':00:00'">{{n}}:00</option>
                </select>
                <span v-bind:class="{ customLabel: closing_time }" class="closing_time-label">Closing_time</span>
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
                <select v-model="min_number" name="予約可能最小人数" v-on:change="previewData">
                  <option　v-for="n in 10" v-bind:value="n">{{n}}人</option>
                </select>
                <span v-bind:class="{ customLabel: min_number }" class="min_number-label">Min_number</span>
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
                <select v-model="max_number" name="予約可能最大人数" v-on:change="previewData">
                  <option　v-for="n in 50" v-bind:value="n">{{n}}人</option>
                </select>
                <span v-bind:class="{ customLabel: max_number }" class="max_number-label">Max_number</span>
                <span class="border"></span>
              </label>
              <p class="error">{{ ProviderProps.errors[0] }}</p>
              <p v-show="errors.max_number" class="error">*{{ errors.max_number }}</p>
            </div>
          </validation-provider>
        </div>
        <div class="shop-create-btn-wrapper">
          <input
            type="submit"
            value="店舗を追加する"
            class="shop-create-btn"
          />
        </div>
    </form>
    </validation-observer>
  </div>
</template>
<script>
export default {
  props:["areaLists","genreLists"],
  data() {
    return {
      name: "",
      img_pass: "",
      summary: "",
      opening_time: "",
      closing_time: "",
      min_number: "",
      max_number: "",
      area_id: "",
      genre_id: "",
      selected_file: null,
      file_name: "",
      imgUrl: "",
      textareaHeight: "",
      imgBorderStyle: true,
      errors: {
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
    multipleHandler () {
      this.fileSelect(event);
      this.previewData();
    },
    fileSelect(event) {
      if(event.target.files[0]){
        this.selected_file = event.target.files[0];
        this.file_name = event.target.files[0].name;
        this.img_pass="https://reseimgbucket.s3.ap-northeast-3.amazonaws.com/" +this.file_name;
        this.imgUrl = URL.createObjectURL(this.$refs.preview.files[0]);
      }
    },
    previewData(){
      const previewData = {
        id:this.id,
        name: this.name,
        imgUrl: this.imgUrl,
        summary: this.summary,
        area: this.findArea,
        genre: this.findGenre,
        opening_time: this.opening_time,
        closing_time: this.closing_time,
        min_number: this.min_number,
        max_number: this.max_number,
      };
      this.$emit('receivePreviewData',previewData);
    },
    /*店舗情報を作成する*/
    async createShop() {
      try{
        if (window.confirm("店舗情報を作成いたしますか？")) {
          const sendData = {
            name: this.name,
            img_pass: this.img_pass,
            summary: this.summary,
            opening_time: this.opening_time,
            closing_time: this.closing_time,
            min_number: this.min_number,
            max_number: this.max_number,
            user_id: this.$auth.user.id,
            area_id: this.area_id,
            genre_id: this.genre_id,
          };
          await this.$axios.post("https://resebackend.herokuapp.com/api/shop", sendData)
          .then((response) => {
            let formData = new FormData();
            formData.append("file", this.selected_file);
            this.$axios.post("https://resebackend.herokuapp.com/api/storage", formData);
            alert(response.data.message);
            this.$emit("reload");
          })
        } else {
          alert("店舗情報を作成しました。");
        }
      } catch (response) {
          var status = response.response.status;
          if (status == 400) {
            var errors = response.response.data.errors;
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
    resize(){
      this.textareaHeight = "auto";
      this.$nextTick(()=>{
        this.textareaHeight = this.$refs.textarea.scrollHeight + 'px';
      })
    },
    imgBorderStylefocus(){
      this.imgBorderStyle=false;
    },
    imgBorderStyleblur(){
      this.imgBorderStyle=true;
    },
  },
  computed:{
    findArea(){
      if(this.area_id){
        const areaList = this.areaLists.find((areaList)=>{
          return areaList.id===this.area_id;
        });
        return areaList.area;
      }
    },
    findGenre(){
      if(this.genre_id){
        const genreList = this.genreLists.find((genreList)=>{
          return genreList.id===this.genre_id;
        });
        return genreList.genre;
      }
    },
    textareaStyle(){
      if(this.summary){
        return {
          "height": this.textareaHeight,
        }
      }
    },
  },
  watch:{
    summary(){
      this.resize();
    },
  },
  created() {
  },
  mounted(){
    this.previewData();
    this.resize();
  },
};
</script>
<style scoped>

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
.shop-create-wrapper{
  width:500px;
  height:auto;
  margin:15px 0;
  overflow: hidden;
  box-shadow: 2px 2px 4px gray;
  background-color: white;
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
  vertical-align: bottom;
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
.shop-create-btn-wrapper{
  width: 80%;
  margin: 0 0 0 40px;
  text-align: right;
}
.shop-create-btn{
  width: 40%;
  padding: 5px;
  border-radius: 3px;
  color: white;
  background-color: rgb(0, 108, 255);
  cursor: pointer;
}
</style>
