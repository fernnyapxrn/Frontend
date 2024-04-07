<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../stores/auth';

const username = ref('');
const auth = useAuth();
const isAdmin = computed(() => auth.isLoggedIn() && auth.parseJwt(localStorage.getItem('token')).role === 'admin');
const isAnnouncer = computed(() => auth.isLoggedIn() && auth.parseJwt(localStorage.getItem('token')).role === 'announcer');



onMounted(() => {
    // ดึงข้อมูล username จาก localStorage 
    username.value = localStorage.getItem('username');
});

const router = useRouter()

const goToListAllUser = () => {
    router.push({ name: 'ListAllUser' })
}

const goToListAnnouncements = () => {
    router.push({ name: 'ListAllAnnouncement' })

}

const goToListMatchUser = () => {
    router.push({ name: 'MatchUser' })
}

const goToUserView = () => {
    router.push({ name: 'UserViewListAnnouncement' })
}

const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        router.push({ name: 'Login' });
    }
}
</script>
 
<template>
      <div class="flex flex-col w-2/12 h-full bg-blue-800 ">
        <div class="ann-app-title text-3xl font-bold text-white pt-2 pb-5 pl-3">SAS</div>
        <button class="ann-menu flex text-xl items-start space-x-3 text-white pt-1 pl-2 pb-4 border-b-2 border-gray-200">
          <img src="../components//icons/user.png" class="w-8 h-8"/>
          <p>{{ username }}</p>
        </button>
        
        <button class="ann-menu flex items-start space-x-1 text-white pt-1 pl-3 pb-1 border-b-2  border-gray-200"
          :class="{ 'bg-blue-600': $route.name === 'UserViewListAnnouncement' }" @click="goToUserView()">
          
          <p>Announcement (Viewer)</p>
        </button>
        <button class="ann-menu flex items-start space-x-1 text-white pt-1 pl-3 pb-1 border-b-2  border-gray-200"
          :class="{ 'bg-blue-600': $route.name === 'ListAllAnnouncement' }" @click="goToListAnnouncements()">
          
          <p>Announcement</p>
        </button>
        <button v-if="isAdmin" class="ann-menu flex items-start space-x-1 text-white pt-1 pl-3 pb-1 border-b-2 border-gray-200"
          :class="{ 'bg-blue-600': $route.name === 'ListAllUser'|| $route.name === 'AddNewUser'|| $route.name === 'EditUser' }" @click="goToListAllUser()">

          <p>User</p>
        </button>
        <button v-if="isAdmin" class="ann-menu flex items-start space-x-1 text-white pt-1 pl-3 pb-1 border-b-2 border-gray-200"
          :class="{ 'bg-blue-600': $route.name === 'MatchUser' }" @click="goToListMatchUser()">

          <p>Match Password</p>
        </button>
        <button class="ann-menu flex items-start space-x-1 text-white pt-1 pl-3 pb-1 border-b-2 border-gray-200"
           @click="logout()">

          <p>Logout</p>
        </button>
      </div>
</template>
 
<style scoped>

</style>