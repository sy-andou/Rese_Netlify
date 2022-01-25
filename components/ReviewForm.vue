<template>
  <div class="review-form-wrapper">
    <img
      v-on:click="$emit('closeReviewWindow')"
      src="/img/return2.png"
      class="review-delete-btn"
    />
    <form
      v-on:submit.prevent="
        updateReview(reviewList.evaluation, reviewList.comment)
      "
    >
      <div class="evaluation-container">
        <p class="evaluation-ttl">
          ５段階評価
          <span v-show="errors.evaluation" class="error"
            >*{{ errors.evaluation }}
          </span>
        </p>
        <div class="rate-form">
          <label>
            <input
              v-model="reviewList.evaluation"
              type="radio"
              name="rate"
              v-bind:value="5"
            />
            <p v-bind:class="{ checked: reviewList.evaluation >= 5 }">★</p>
          </label>
          <label>
            <input
              v-model="reviewList.evaluation"
              type="radio"
              name="rate"
              v-bind:value="4"
            />
            <p v-bind:class="{ checked: reviewList.evaluation >= 4 }">★</p>
          </label>
          <label>
            <input
              v-model="reviewList.evaluation"
              type="radio"
              name="rate"
              v-bind:value="3"
            />
            <p v-bind:class="{ checked: reviewList.evaluation >= 3 }">★</p>
          </label>
          <label>
            <input
              v-model="reviewList.evaluation"
              type="radio"
              name="rate"
              v-bind:value="2"
            />
            <p v-bind:class="{ checked: reviewList.evaluation >= 2 }">★</p>
          </label>
          <label>
            <input
              v-model="reviewList.evaluation"
              type="radio"
              name="rate"
              v-bind:value="1"
            />
            <p v-bind:class="{ checked: reviewList.evaluation >= 1 }">★</p>
          </label>
        </div>
      </div>
      <div class="comment-container">
        <p class="comment-ttl">
          レビュー内容
          <span v-show="errors.comment" class="error"
            >*{{ errors.comment }}
          </span>
        </p>
        <textarea
          v-model="reviewList.comment"
          placeholder="食事、接客や待ち時間等の気に入った点、気に入らなかった点をご自由にご記入ください。"
        ></textarea>
      </div>
      <div class="review-btn-container">
        <input type="submit" value="レビューを投稿する" class="review-btn" />
      </div>
    </form>
  </div>
</template>
<script>
export default {
  props: ["reviewList"],
  data() {
    return {
      errors: {
        id: "",
        evaluation: "",
        comment: "",
      },
    };
  },
  methods: {
    async updateReview(evaluation, comment) {
      try {
        if (window.confirm("レビューを投稿しますか？")) {
          const sendData = {
            login_user: this.$auth.user.id,
            evaluation: evaluation,
            comment: comment,
          };
          await this.$axios
            .put(
              "https://resebackend.herokuapp.com/api/review/" +
                this.reviewList.id,
              sendData
            )
            .then((response) => {
              alert(response.data.message);
              this.$emit("reload");
            });
        } else {
          alert("レビューは投稿されませんでした。");
        }
      } catch (response) {
        var status = response.response.status;
        if (status == 400) {
          var errors = response.response.data.errors;
          this.errors.evaluation = errors.evaluation
            ? errors.evaluation[0]
            : "";
          this.errors.comment = errors.comment ? errors.comment[0] : "";
          if (status === 404) {
            alert(response.response.data.message);
          }
        }
      }
    },
  },
  created() {},
};
</script>
<style scoped>
.review-form-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.review-delete-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 1;
}
form {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  height: 70%;
  width: 90%;
}
.reserve-ttl {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: white;
}
.evaluation-container {
  height: auto;
  width: 100%;
}
.evaluation-container > p {
  margin: 0 0 10px 0;
}
.rate-form {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
}
.rate-form input[type="radio"] {
  display: none;
}
.rate-form label {
  position: relative;
  padding: 0 5px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 35px;
}
.rate-form label:hover {
  color: #ffcc00;
}
.rate-form label:hover ~ label {
  color: #ffcc00;
}
.checked {
  color: #ffcc00;
}
.comment-container {
  height: auto;
  width: 100%;
  margin: 10px 0;
}
.evaluation-ttl {
  margin: 10px 0;
  color: white;
}
.comment-ttl {
  margin: 10px 0;
  color: white;
}
textarea {
  display: block;
  resize: none;
  height: 150px;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  opacity: 0.6;
}
textarea::placeholder {
  color: black;
}
.review-btn-container {
  display: flex;
  justify-content: flex-end;
}
.review-btn {
  width: auto;
  padding: 5px 20px;
  border-radius: 3px;
  color: white;
  background-color: rgb(0, 108, 255);
  cursor: pointer;
}
@media screen and (max-width: 768px) {
  form {
    width: 100%;
  }
}
</style>
