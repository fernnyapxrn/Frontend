<script setup>
import { ref, onMounted } from "vue";

import { useRouter, useRoute } from "vue-router";
import { getAllUser, url } from "../composable/fetchAPI.js";
import LeftMenu from "./LeftMenu.vue";

const router = useRouter();

const usernamedetails = ref('');
const passworddetails = ref('');
const AllUsers = ref([]);
const annStatus = ref('');

const checkMatchPassword = async () => {

  const username = usernamedetails.value;
  const password = passworddetails.value;

  try {
    const res = await fetch(`${url}/api/users/match`, {
      method: 'POST', // เปลี่ยนเป็น POST
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    if (res.status === 200) {
      // สำเร็จ (password ตรงกัน)
      annStatus.value = 'Password Matched';
    } else if (res.status === 404) {
      // ไม่พบ username
      annStatus.value = 'The specified username DOES NOT exist';
    } else {
      // password ไม่ตรงกันหรือเกิดข้อผิดพลาดอื่น ๆ
      annStatus.value = 'Password NOT Matched';
    }
  } catch (error) {
    console.error('Error checking password:', error);
  }
}

  onMounted(async () => {
    AllUsers.value = await getAllUser();
  });

  async function ClearData() {
    usernamedetails.value = "";
    passworddetails.value = "";
  }


</script>

<template>
  <div class="min-h-screen flex flex-row " style="background-color:#288a5e;">

    <!-- 1 -->
    <LeftMenu />

    <!--2-->
    <div class="w-3/4 h-min m-auto ">

      <div v-if="annStatus" class="ann-status ShowStatus" :class=" {
        PasswordMatch: annStatus === 'Password Matched',
        PasswordDoNotMatch: annStatus === 'The specified username DOES NOT exist' || annStatus === 'Password NOT Matched'
      } ">

        <div class="ann-message StatusMessage">{{ annStatus }}</div>
      </div>

      <div class="PageBorder">

        <h1 class="Title">Match Password</h1>

        <p>Username</p>
        <input v-model="usernamedetails" maxlength="45" class="ann-username"
          style="border: 1px solid #cacaca; border-radius: 0.2rem; width: 100%; margin: 1rem 0rem 1rem 0rem; padding: 5px;"
          placeholder="Please enter username" />

        <p>Password</p>
        <input v-model="passworddetails" maxlength="100" class="ann-password" type="password"
          style="border: 1px solid #cacaca; border-radius: 0.2rem; width: 100%; margin: 1rem 0rem 1rem 0rem; padding: 5px;"
          placeholder="Please enter password" />

        <div class="mt-5">
          <button class="MatchPasswordBtn ann-button" @click="checkMatchPassword(), ClearData()">Match Password</button>

        </div>
      </div>
    </div>
  </div>
</template>
   
<style scoped>
p {
  font-weight: bold;
  font-size: 17px;
}

.Title {
  font-weight: bold;
  font-size: 30px;
  line-height: 36px;
  padding-bottom: 30px;
}

.MatchPasswordBtn {
  width: 10rem;
  background-color: #cacaca;
  border-radius: 0.5rem;
  border: 1px solid #cacaca;
  padding: 6px;
  transition: background-color 0.3s ease-out, border-color 0.3s ease-out;
  
}

.MatchPasswordBtn:hover {
  background-color: #a8a8a8;
  border-color: #a8a8a8;
  color: #ffffff;
}

::placeholder {
  color: rgb(200, 200, 200);
  padding: 2px;
}

.PageBorder {
  border-radius: 1rem;
  border: 1px solid #cacaca;
  padding: 40px;
  width: 60%;
  margin: 0 auto;
  background-color: white;
  border-collapse: separate;
}

.PasswordMatch {
  background-color: #6EE7B7;
  border-color: #047857;
  color: #047857;
}

.PasswordDoNotMatch {
  background-color: #ffadad;
  border: 1px solid #ec4545;
  color: #ec4545;
}

.ShowStatus {
  border-radius: 0.7rem;
  width: 60%;
  height: 3.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-bottom: 15px;
}

.StatusMessage {
  font-size: 1rem;
  font-weight: 400;
}
</style>