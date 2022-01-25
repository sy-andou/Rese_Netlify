<template>
  <div class="mail-form-wrapper">
    <validation-observer ref="obs" v-slot="ObserverProps">
      <h2>MailSendForm</h2>
      <form v-on:submit.prevent="sendMail">
        <validation-provider
          v-slot="ProviderProps"
          rules="required"
          class="reserve-input-container"
        >
          <div class="address-input-wrapper">
            <label class="inp">
              <select id="address" v-model="address" multiple>
                <option
                  v-for="userList in userLists"
                  v-bind:key="userList.id"
                  v-bind:value="userList.email"
                >
                  {{ userList.name }}({{ userList.permission.name }})
                </option>
              </select>
              <span
                v-bind:class="{ customLabel: address }"
                class="address-label"
                >Address</span
              >
              <span class="border"></span>
            </label>
            <p class="error">{{ ProviderProps.errors[0] }}</p>
          </div>
        </validation-provider>
        <div class="user-select-btn">
          <input
            v-on:click.prevent="selectUser(1)"
            type="submit"
            value="利用者全員を選択"
          />
          <input
            v-on:click.prevent="selectUser(2)"
            type="submit"
            value="店舗代表者全員を選択"
          />
          <input
            v-on:click.prevent="selectUser(3)"
            type="submit"
            value="管理者全員を選択"
          />
        </div>
        <validation-provider
          v-slot="ProviderProps"
          rules="required"
          class="reserve-input-container"
        >
          <div class="subject-input-wrapper">
            <label class="inp">
              <input
                v-model="subject"
                type="text"
                id="subject"
                placeholder=" "
              />
              <span class="label">Subject</span>
              <span class="border"></span>
            </label>
            <p class="error">{{ ProviderProps.errors[0] }}</p>
          </div>
        </validation-provider>
        <validation-provider
          v-slot="ProviderProps"
          rules="required"
          class="reserve-input-container"
        >
          <div class="text-input-wrapper">
            <label class="inp">
              <textarea v-model="text" id="text" placeholder=" "></textarea>
              <span class="label">Text</span>
              <span class="border"></span>
            </label>
            <p class="error">{{ ProviderProps.errors[0] }}</p>
          </div>
        </validation-provider>
        <div class="mail-send-btn-container">
          <input type="submit" value="メールを送信する" class="mail-send-btn" />
        </div>
      </form>
    </validation-observer>
  </div>
</template>
<script>
export default {
  props: ["userLists"],
  data() {
    return {
      address: [],
      subject: "",
      text: "",
    };
  },
  methods: {
    async sendMail() {
      const sendData = {
        address: this.address,
        subject: this.subject,
        text: this.text,
      };
      this.$axios
        .post("https://resebackend.herokuapp.com/api/mail", sendData)
        .then(() => {
          alert("メールを送信しました");
        });
    },
    selectUser(permissionId) {
      this.address = this.userLists
        .filter((userList) => {
          return userList.permission_id === permissionId;
        })
        .map((userList) => {
          return userList.email;
        });
    },
  },
};
</script>
<style scoped>
.error {
  display: inline-block;
  margin: 5px 0 5px 5px;
  white-space: nowrap;
}
h2 {
  padding: 20px;
  font-size: 20px;
  background-color: rgb(244, 171, 1);
}
.customLabel {
  color: #5a667f;
  transform: translateY(-26px) scale(0.75);
}
.mail-form-wrapper {
  width: auto;
  max-width: 1000px;
  height: auto;
  overflow: hidden;
  box-shadow: 2px 2px 4px gray;
  background-color: white;
}
form {
  margin: 40px auto;
  width: 90%;
}
.address-input-wrapper,
.subject-input-wrapper,
.text-input-wrapper {
  min-height: 90px;
  width: 100%;
  margin: 0 auto;
}
.address-input-wrapper,
.text-input-wrapper {
  min-height: 150px;
}
.inp {
  display: inline-block;
  position: relative;
  margin: auto 5px;
  width: 100%;
}
.inp .label,
.address-label {
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
  background: ;
  border-radius: 0;
  color: #223254;
  transition: all 0.15s ease;
}
select,
textarea {
  height: 100px;
  margin: 0 auto;
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
.user-select-btn {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin: 0 0 20px 0;
}
.user-select-btn > input {
  width: 20%;
  margin: 0 0 0 1%;
  padding: 5px;
  border-radius: 3px;
  overflow: hidden;
  border: none;
  background-color: rgb(0, 108, 255);
  color: white;
  cursor: pointer;
}
.mail-send-btn-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
.mail-send-btn {
  width: 62%;
  text-align: center;
  padding: 5px;
  border-radius: 3px;
  background-color: rgb(0, 108, 255);
  border: none;
  color: white;
  cursor: pointer;
}
@media screen and (max-width: 768px) {
  .mail-form-wrapper {
    height: auto;
  }
  form {
    margin: 20px 0;
    width: 100%;
  }
  .address-input-wrapper {
    min-height: 50px;
  }
  .user-select-btn {
    flex-direction: column;
  }
  .user-select-btn > input {
    width: 100%;
  }
  .user-select-btn > input {
    margin: 5px 0;
  }
  .mail-send-btn {
    width: 100%;
  }
}
</style>
