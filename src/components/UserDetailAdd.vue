<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { url } from "../composable/fetchAPI.js";
import LeftMenu from "./LeftMenu.vue";

const router = useRouter();

const backHomePage = () => {
  router.push("/admin/user");
};

const updatedUser = ref([]);
onMounted(async () => {
  updatedUser.value = {
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
    email: "",
    role: "announcer"
  };
});

const Role = ref(["announcer", "admin"]);
const data = ref([]);
const annStatus = ref('');

const addUserError = ref('');

const isFieldAdd = ref(false)
watch(updatedUser, () => {
  if (updatedUser.value.username !== '' && updatedUser.value.name !== '' && updatedUser.value.email !== '') {
    isFieldAdd.value = true;
  } else {
    console.log('no add')
    isFieldAdd.value = false;
  }
}, { deep: true })

const addNewUser = async (newUser) => {
  newUser.username = newUser.username.replace(/\s+/g, '');
  newUser.password = newUser.password.replace(/\s+/g, '');
  newUser.confirmPassword = newUser.confirmPassword.replace(/\s+/g, '');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newUser.email)) {
    annStatus.value = "Invalid email format";
    return;
  }

  try {
    const res = await fetch(url + `/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(newUser),
    });
    if (res.status === 200) {
      const addedUser = await res.json();
      data.value.push(addedUser);
      router.push({ name: "UserHomePage" });
    } else if (res.status === 400) {
      annStatus.value = 'does not unique';
    } else {
      const errorData = await res.json();
      annStatus.value = errorData.message;
    }
  } catch (error) {
    console.log(error);
    annStatus.value = error.message;
  }
};

const isPasswordMatching = computed(() => {
  return updatedUser.value.password === updatedUser.value.confirmPassword;
});

const isPasswordValid = computed(() => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^#&*()_+{}\[\]:;<>,.?/~\\|-])[\S]{8,14}$/
  return passwordRegex.test(updatedUser.value.password);
});

watch(() => updatedUser.value.password, (newPassword) => {
  isPasswordValid.value = validatePassword(newPassword);
});

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,14}$/;
  return passwordRegex.test(password);
};

const handleSpaceBar = (event) => {

  if (event.key === " ") {
    event.preventDefault();
    updatedUser.username = updatedUser.username.replace(/\s+/g, '');
  }
};

const isEmailWellFormed = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(updatedUser.value.email);
});


</script>

<template>
  <div class="min-h-screen flex flex-row" style="background-color:#288a5e;">
    <LeftMenu />

    <div class="w-3/4 h-min m-auto ">
      <form @submit.prevent="submitForm">
        <div style="padding: 20px; padding-top: 0;">
          <h1 class="font-bold text-2xl mb-3 mt-3">User Detail:</h1>

          <p>Username</p>
          <input class="ann-username" v-model.trim="updatedUser.username" maxlength="45" type="text"
            style="border: 1px solid #cacaca; border-radius: 0.2rem; width: 100%; margin-bottom: 1rem;"
            placeholder="Please enter username" required />
          <div v-if="annStatus" class=" text-red-500">
            <div class="ann-error-username">{{ annStatus }}</div>
          </div>

          <p>Password</p>
          <input class="ann-password" v-model="updatedUser.password" maxlength="14" type="password"
            style="border: 1px solid #cacaca; border-radius: 0.2rem; width: 100%; margin-bottom: 1rem;"
            placeholder="Please enter password" required />

          <div v-if="!isPasswordValid && updatedUser.password !== ''" class="text-red-500 ann-error-password">
            must be 8-14 characters long, at least 1 of uppercase, lowercase, number and special characters
          </div>
          <div v-if="updatedUser.password && updatedUser.password.length < 8" class="text-red-500 ann-error-password">
            Password size must be between 8 and 14
          </div>

          <p>Confirm Password</p>
          <input class="ann-confirm-password" v-model="updatedUser.confirmPassword" maxlength="14" type="password"
            style="border: 1px solid #cacaca; border-radius: 0.2rem; width: 100%; margin-bottom: 1rem;"
            placeholder="Please re-enter password" required />
          <div v-if="updatedUser.confirmPassword !== '' && !isPasswordMatching" class="text-red-500 ann-error-password">
            The password DOES NOT match
          </div>


          <p>Name</p>
          <input class="ann-name" v-model.trim="updatedUser.name" maxlength="100"
            style="border: 1px solid #cacaca; border-radius: 0.2rem; width: 100%; margin-bottom: 1rem;"
            placeholder="Please enter Name" required />
          <div v-if="annStatus" class=" text-red-500">
            <div class="ann-error-name">{{ annStatus }}</div>
          </div>

          <p>Email</p>
          <input class="ann-email" v-model.trim="updatedUser.email" maxlength="150"
            style="border: 1px solid #cacaca; border-radius: 0.2rem; width: 100%; margin-bottom: 1rem;"
            placeholder="Please enter Email" required type="email" />
          <div v-if="updatedUser.email !== '' && !isEmailWellFormed" class="text-red-500">Email must be well-formed</div>
          <div v-if="annStatus" class=" text-red-500">
            <div class="ann-error-email">{{ annStatus }}</div>
          </div>

          <div>
            <p>Role</p>
            <select class="borderstyleRole ann-role" v-model="updatedUser.role">
              <option v-for="(role, index) in Role" :key="index">
                {{ role }}
              </option>
            </select>
          </div>

          <div class="mt-5">
            <button class="SaveBtn ann-button" @click="addNewUser(updatedUser)">Add</button>

            <button class="CancelBtn ann-button" @click="backHomePage()">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
p {
  font-weight: bold;
}

form {
  border-collapse: collapse;
  border: 1px solid #cacaca;
  border-radius: 0.5rem;
  width: 90%;
  background-color: white;
}

.SaveBtn {
  width: 6rem;
  background-color: #75dc81;
  border-radius: 0.5rem;
  border: 10px solid #75dc81;
  transition: background-color 0.3s ease-out, border-color 0.3s ease-out;
}

.SaveBtn:hover {
  background-color: rgb(92, 160, 52);
  border-color: rgb(92, 160, 52);
  color: #ffffff;
}

.CancelBtn {
  width: 6rem;
  background-color: #ffa0a0;
  border-radius: 0.5rem;
  border: 10px solid #ffa0a0;
  transition: background-color 0.3s ease-out, border-color 0.3s ease-out;
  margin-left: 20px;
}

.CancelBtn:hover {
  background-color: #ff5858;
  border-color: #ff5858;
  color: #ffffff;
}

.borderstyle {
  border: 1px solid #cacaca;
  border-radius: 0.3rem;
  padding: 5px;
}

.borderstyleRole {
  border: 1px solid #cacaca;
  border-radius: 0.5rem;
  padding: 2px;
}

.exceeded-limit {
  border-color: red;
}

.character-limit {
  color: red;
  font-size: 12px;
}

.LeftNavBar {
  min-height: 100vh;
  display: flex;
  border-right: 2px solid;
}
</style>
