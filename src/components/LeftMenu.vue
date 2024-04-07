<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../stores/authen';

const router = useRouter();
const username = ref('');
const authen = useAuth();
const isAdmin = computed(() => authen.isLoggedIn() && authen.parseJwt(localStorage.getItem('token')).role === 'admin');

const GoToUserPage = () => {
  router.push("/admin/user");
};

const GoToPasswordPage = () => {
  router.push("/admin/user/match");
};

const GoToAnnouncementPage = () => {
  router.push("/admin/announcement")
}

const GoToViewer = () => {
  router.push("/announcement")
}

onMounted(() => {
    username.value = localStorage.getItem('username');
});

const logout = () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    router.push({ name: 'LoginUser' });
  }
}
</script>

<template>
  <div class=" Menu">

  <div class="UserBorder">

    <h1 class="SAS"><span class="SASLogoIconContainer">
        <img src="../icons/SASLogo.png" class="SASLogoIcon">SAS</span>
  </h1>

    <h1 class="user">User: {{ username }}</h1>
  </div>

    <div class="BorderMenu">

    <h3 class="LeftAnnounce" @click="GoToViewer()">
    <span class="ViewerIconContainer">
        <img src="../icons/viewer.png" class="ViewerIcon">Viewer</span>
    </h3>

    <h3 class="LeftAnnounce" @click="GoToAnnouncementPage()">
    <span class="AnnounceIconContainer">
        <img src="../icons/announcement.png" class="AnnounceIcon">Announcement</span>
    </h3>

    <h3 v-if="isAdmin" class="LeftAnnounce" style="padding-top: 7px;" @click="GoToUserPage()">
      <span class="userIconContainer">
        <img src="../icons/user.png" class="userIcon">User</span>
    </h3>

    <h3 v-if="isAdmin" class="LeftAnnounce" @click="GoToPasswordPage()">
      <span class="passwordIconContainer">
        <img src="../icons/password.png" class="passwordIcon">Match Password</span>
    </h3>

    <h3 class="LeftAnnounce logout-button" @click="logout()">
      Logout
    </h3>
  </div>
  </div>
</template>

<style scoped>
.Menu {
  background-color:#4ba470;
  flex-direction: column;
  text-align: center;
  width: 13.5rem;
  color: white;
}

.BorderMenu{
  background-color: #1f6f4b;
  padding: 15px;
  margin: 15px;
  border-radius: 15px;
}
.UserBorder{
  background-color: #ffffff;
  width: 85%;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom:20px;
  border-radius: 15px;
}

.user {
  font-weight: bold;
  font-size: 25px;
  height: 3rem;
  color: #1f6f4b;
  background-color: #ffe69b;
  border-radius: 15px;
}

.SAS {
  padding-top: 10px;
  font-weight: bold;
  font-size: 2rem;
  color: black;
}
.SASLogoIcon {
  padding-bottom: 5px;
  width:50px;
  padding-right: 5px;
}

.SASLogoIconContainer {
  display: flex;
  padding-bottom: 10px;
  justify-content: center;
}

.LeftAnnounce {
  height: 3.5rem;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 10px;
  transition: background-color 0.3s ease-out, border-color 0.15s ease-out;
}

.LeftAnnounce:hover {
  cursor: pointer;
  background-color: #ffffff;
  color: #288a5e;
  border-radius: 10px;
}

.LeftAnnounce:hover .userIcon {
  content: url("../icons/userhover.png");
  width: 20px;
  padding-bottom: 5px;
}

.userIcon {
  padding-bottom: 5px;
}

.userIconContainer {
  display: flex;
  width: 20px;
  padding-bottom: 5px;
  justify-content: center;
}

.LeftAnnounce:hover .passwordIcon {
  content: url("../icons/passwordhover.png");
  width: 20px;
  padding-bottom: 5px;
}

.passwordIcon {
  padding-bottom: 5px;
  margin-right: 2px;
}

.passwordIconContainer {
  display: flex;
  width: 20px;
  justify-content: center;
}

.LeftAnnounce:hover .AnnounceIcon {
  content: url("../icons/announcement hover.png");
  width: 20px;
  padding-bottom: 5px;
}

.AnnounceIcon {
  padding-bottom: 5px;
}

.AnnounceIconContainer {
  display: flex;
  width: 22px;
  justify-content: center;
}

.LeftAnnounce:hover .ViewerIcon {
  content: url("../icons/viewer hover.png");
  width: 20px;
  padding-bottom: 5px;
}

.ViewerIcon {
  padding-right: 2px;
  padding-bottom: 5px;
}

.ViewerIconContainer {
  display: flex;
  width: 22px;
  justify-content: center;
}

.logout-button {
  background-color: #429565;
  color: white;
  cursor: pointer;
}

.logout-button:hover {
  cursor: pointer;
  background-color: #cacaca;
  color: #288a5e;
}
</style>