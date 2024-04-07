<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getUserById, url } from "../composable/fetchAPI.js";
import LeftMenu from "./LeftMenu.vue";

const { params } = useRoute();
const router = useRouter();

const CreatedOnTime = ref();
const UpdatedOnTime = ref();
const Role = ref(["announcer", "admin"]);
const editDetail = ref();
const checkTime = ref(params.id);

const editselectedUser = ref({
  username: "",
  name: "",
  email: "",
  role: "announcer",
});
const annStatus = ref('');

const BackHomePage = () => {
  router.push("/admin/user");
};

onMounted(async () => {
  if (checkTime.value !== undefined) {
    editDetail.value = await getUserById(parseInt(params.id));

    if (editDetail.value) {
      CreatedOnTime.value = formatDate(editDetail.value.createdOn);
      UpdatedOnTime.value = formatDate(editDetail.value.updatedOn);

      editselectedUser.value = {
        username: editDetail.value.username,
        name: editDetail.value.name,
        email: editDetail.value.email,
        role: editDetail.value.role,
      };
    }
  }
});

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-UK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

const editUsers = async () => {
  if (!editselectedUser.value.username || !editselectedUser.value.name || !editselectedUser.value.email) {
    annStatus.value = 'Please fill out all fields';
  } else {
    annStatus.value = '';

    try {
      const res = await fetch(`${url}/api/users/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          username: editselectedUser.value.username,
          name: editselectedUser.value.name,
          email: editselectedUser.value.email,
          role: editselectedUser.value.role,
          createdOn: editselectedUser.value.createdOn,
          updatedOn: editselectedUser.value.updatedOn,
        }),
      });

      if (res.status === 200) {
        console.log('Update successful');
        router.go(-1);
      } else if (res.status === 400) {
        annStatus.value = 'Username or email is not unique';
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-row" style="background-color:#288a5e;"
  >
    <LeftMenu />
    <div class="w-3/4 h-min m-auto ">
      <form @submit.prevent="editUsers">
        <div style="padding: 20px; padding-top: 0;">
          <h1 class="font-bold text-2xl mb-3 mt-3">User Detail:</h1>
          <p>Username</p>
          <input v-model="editselectedUser.username" class="ann-username"
            style="border: 1px solid #cacaca; border-radius: 0.2rem; width: 100%; margin-bottom: 1rem;" maxlength="45"
            type="text" required @keydown="preventSpacebar($event)"/>
          <div v-if="annStatus" class="text-red-500">
            <div class="ann-error-username">{{ annStatus }}</div>
          </div>

          <p>Name</p>
          <input class="ann-name" v-model="editselectedUser.name"
            style="border: 1px solid #cacaca; border-radius: 0.2rem; width: 100%; margin-bottom: 1rem;" maxlength="100"
            type="text" required @keydown="preventSpacebar($event)"/>
          <div v-if="annStatus" class=" text-red-500">
            <div class="ann-error-name">{{ annStatus }}</div>
          </div>

          <p>Email</p>
          <input class="ann-email" v-model="editselectedUser.email"
            style="border: 1px solid #cacaca; border-radius: 0.2rem; width: 100%; margin-bottom: 1rem;" maxlength="150"
            type="text" required @keydown="preventSpacebar($event)"/>
          <div v-if="annStatus" class=" text-red-500">
            <div class="ann-error-email">{{ annStatus }}</div>
          </div>

          <div>
            <p>Role</p>
            <select class="borderstyleRole ann-role" v-model="editselectedUser.role">
              <option v-for="(role, index) in Role" :key="index">
                {{ role }}
              </option>
            </select>
          </div>
          <div class="flex flex-row" v-if="checkTime != undefined">
            <h1 class="text-lg font-bold mt-6 ml-2">CreatedOn</h1>
            <h1 class="ann-created-on text-lg mt-6 ml-4">{{ CreatedOnTime }}</h1>
            <h1 class="text-lg font-bold mt-6 ml-12">UpdatedOn</h1>
            <h1 class="ann-updated-on text-lg mt-6 ml-4">{{ UpdatedOnTime }}</h1>
          </div>
          <div class="mt-5">
            <button class="SaveBtn ann-button" type="submit">Save</button>
            <button class="CancelBtn ann-button" @click="BackHomePage">Cancel</button>
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
}</style>
