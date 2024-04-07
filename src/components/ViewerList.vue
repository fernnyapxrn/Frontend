<script setup >

import { getCategory, getViewerAnnouncements } from "../composable/fetchAPI.js";
import { onMounted, ref, computed, watchEffect } from "vue";
import { useRouter, RouterLink } from 'vue-router';

const router = useRouter();
const announcements = ref([]);
const currentDateTime = ref(new Date());
const showClosedAnnouncement = ref(false);
const announcementCategory = ref("");
const switchMode = ref(true)
const categoryNameSelect = ref()
const categoryValue = ref([])


onMounted(async () => {
    const data = await getViewerAnnouncements(switchMode.value ? 'active' : 'closed');
    console.log(data)
    announcements.value = data;
    categoryValue.value = await getCategory()
    categoryNameSelect.value = ""
});

watchEffect(async () => {
    const data = await getViewerAnnouncements(switchMode.value ? 'active' : 'closed');
    announcements.value = data;
});


//check date close->current
const isAnnouncementInProgress = (announcement) => {
    const closeDateTime = new Date(announcement.closeDate);
    const publishDateTime = new Date(announcement.publishDate);

    return (
        currentDateTime.value < closeDateTime &&
        (!announcement.publishDate || publishDateTime <= currentDateTime.value)
    );
};

const filteredAnnouncements = computed(() => { //กรองไปแสดง
    const selectedCategory = announcementCategory.value; // กรองจากที่เลือก

    // Active
    const announcementsNullCloseDate = announcements.value.filter(
        (announcement) =>
            announcement.closeDate === null &&
            announcement.announcementDisplay !== "N" &&
            (!announcement.publishDate || new Date(announcement.publishDate) <= currentDateTime.value) && //เงื่อนไขวันที่ยังไม่ถึงไม่แสดง
            (!selectedCategory || announcement.announcementCategory === selectedCategory) // เลือกตามหมวดหมู่
    );

    const announcementsInProgress = announcements.value
        .filter(isAnnouncementInProgress)
        .filter(
            (announcement) =>
                announcement.closeDate !== null &&
                announcement.announcementDisplay !== "N" &&
                currentDateTime.value < new Date(announcement.closeDate) &&
                (!announcement.publishDate || new Date(announcement.publishDate) <= currentDateTime.value) &&
                (!selectedCategory || announcement.announcementCategory === selectedCategory)
        );

    // Closed Date
    const announcementsClosed = announcements.value
        .filter(
            (announcement) =>
                announcement.closeDate !== null &&
                announcement.announcementDisplay !== "N" &&
                currentDateTime.value >= new Date(announcement.closeDate) &&
                (!announcement.publishDate || new Date(announcement.publishDate) <= currentDateTime.value) &&
                (!selectedCategory || announcement.announcementCategory === selectedCategory)
        )
        .filter(
            (announcement) =>
                announcement.closeDate !== null
        );

    return showClosedAnnouncement.value
        ? [...announcementsClosed]
        : [...announcementsNullCloseDate, ...announcementsInProgress];
});


//Toggle
const togglebtn = () => {
    showClosedAnnouncement.value = !showClosedAnnouncement.value;
};

//ShowTimeZone
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

//ทำ pagination
const pageSize = 5;
const currentPage = ref(1);

const paginatedAnnouncements = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const sortedAnnouncements = filteredAnnouncements.value
        .slice()
        .sort((a, b) => b.id - a.id); // Sort by ID in descending order
    return sortedAnnouncements.slice(startIndex, endIndex);
});

// ...

const totalPages = computed(() => {
    return Math.ceil(filteredAnnouncements.value.length / pageSize);
});

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const goToPreviousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value -= 1;
    }
};

const goToNextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
    }
};

const goToLogin = () => {
  router.push("/login")
}

const goToDetail = (announceId) => {
    console.log(announceId)
    router.push({
        name: 'ViewerDetail',
        params: { id: announceId }
    })
}

</script>

<template>
    <div class='page' style="background-color:#4ba470;">

        <div class="login-container">
            <div class="login-btn font-bold">
                <button @click="goToLogin()">Login</button>
            </div>
        </div>

        <div class="BORDER">
        <h1>SIT Announcement System (SAS)</h1>
        <p class="TimeZone "><span style="font-weight: bold; ">Date/Time shown in Timezone :&nbsp;</span> {{ timeZone }}</p>
        <!-- Edit Later -->

        <div class="CategoryandButton">
            <div class="selectedCategory">
                <p>Choose Category :</p>
                <select class="borderstyleCategory" v-model="announcementCategory">
                    <option value="">ทั้งหมด</option>
                    <option value="ทั่วไป">ทั่วไป</option>
                    <option value="ทุนการศึกษา">ทุนการศึกษา</option>
                    <option value="หางาน">หางาน</option>
                    <option value="ฝึกงาน">ฝึกงาน</option>
                </select>
            </div>

            <div class="Btn">
                <button @click="togglebtn">
                    {{ showClosedAnnouncement ? "Active Announcement" : "Closed Announcement" }}
                </button>
            </div>
        </div>

        <table class="table-auto justify-center ">
            <thead>
                <tr>
                    <th>No.</th>
                    <th style="text-align: left; padding-left: 50px;">Title</th>
                    <th style="text-align: center; padding-left: 20px;">Category</th>
                </tr>

                <tr v-for="(announcement, index) in paginatedAnnouncements" :key="announcement.announcementId">

                    <td>
                        {{ index + 1 }}
                    </td>
                    <td style="text-align: left; padding-left: 50px;">
                        <button class= "btn-view" @click="goToDetail(announcement.id)"> {{ announcement.announcementTitle }} </button>
                    </td>
                    <td style="text-align: center; padding-left: 20px;">
                        {{ announcement.announcementCategory }}
                    </td>
                </tr>

            </thead>
        </table>

        <div v-if="filteredAnnouncements.length === 0">
            <h2>No Announcement</h2>
        </div>

    <div class="pagination">
        <button :disabled="currentPage === 1" @click="goToPreviousPage">Previous</button>
        <button v-for="page in Math.min(15, totalPages)" :key="page" :class="{ active: currentPage === page }"
            @click="goToPage(page)">{{ page }}</button>
        <button :disabled="currentPage === totalPages" @click="goToNextPage">Next</button>
    </div>
</div>
</div>
</template>

<style scoped>
.BORDER{
    margin: 0 auto;
    background-color:#ffffff;
    border-collapse: separate;
    border-radius: 15px;
    border-spacing: 0;
    border: 1px solid #ffffff;
    width: 80%;
    padding-bottom: 50px;
    padding-top: 50px;
}
h1 {
    text-align: center;
    font-size: 45px;
    font-weight: bold;
    font-family: 'Montserrat', sans-serif;
    padding-top: 10px;
}

h2 {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
}

table {
    width: 80%;
    margin: auto;
    margin-bottom: 20px;
    border-collapse: separate;
    border-radius: 3px;
    border-spacing: 0;
    border: 1px solid #ddd;

}

th {
    background-color:#4ba470;
    padding: 10px;
    color: #ffffff;
    border-bottom: 2px solid #a0d49c;
    font-weight: bold;

}

tr:hover {
    background-color: #f1f1f1;
    border-color: #f1f1f1;
}

td {
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.TimeZone {
    display: flex;
    padding-top: 5px;
    padding-bottom: 10px;
    justify-content: center;
}

.page {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    min-height: 100vh;
}

.Btn {
    color: #ffffff;
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: #898989;
  border-radius: 0.5rem;
  border: 10px solid #898989;
  transition: background-color 0.3s ease-out, border-color 0.3s ease-out;
  margin-left: auto;
}

.Btn:hover {
    background-color: #515151;
    border-color: #515151;
    color: #ffffff;
}

.selectedCategory {
    display: flex;
    align-items: center;
}

.borderstyleCategory {
    border-radius: 5px;
    border: 1px solid #b1b1b1;
    margin-left: 10px;
}

.CategoryandButton {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    margin-right: 10%;
    margin-left: 10%;
}

.pagination {
    margin-top: 20px;
    margin-left: 10%;
}

.pagination button {
    margin-right: 5px;
    padding: 5px 10px;
    border-radius: 5px;
    border: none;
    background-color: #f0f0f0;
    cursor: pointer;
}

.pagination button.active {
    font-weight: bold;
    background-color: #ccc;
}

.pagination button:hover {
    background-color: #ccc;
}

.login-container {
  display: flex;
  justify-content: flex-end;
  text-align: center;
  margin-right: 10%;
  margin-bottom: 10px;
  border-radius: 0.5rem;
  padding: 10px; 
}

/* Login button styles */
.login-btn {
  background-color: #ffe69b;
  border-radius: 0.5rem;
  width: 100px;
  border: 10px solid #ffe69b;
  transition: background-color 0.3s ease-out, border-color 0.3s ease-out;
  margin-top: 20px;
}

.login-btn:hover {
  background-color: #fdcd3c;
  border-color: #fdcd3c;
  color: #000000;
}

.btn-view {
    font-style: inherit;
    text-decoration: underline;
}
</style>
