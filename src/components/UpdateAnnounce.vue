<script setup>
import { updateAnnouncement, getIdAnnouncement, getCategory } from '../composable/fetchAPI.js'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from "vue-router";

const { params } = useRoute();
const announcementId = params.id;
const router = useRouter();
const Announcement = ref();

const selectedAnnouncement = ref({
  announcementTitle: "",
  categoryId: "",
  announcementDescription: "",
  publishDate: "",
  closeDate: "",
  announcementDisplay: ""
});

const BackHomePage = () => {
  router.push("/admin/announcement");
}

onMounted(async () => {
  Announcement.value = await getIdAnnouncement(announcementId);
  if (Announcement.value) {
    selectedAnnouncement.value = {
      id: Announcement.value.id,
      announcementTitle: Announcement.value.announcementTitle,
      categoryId: Announcement.value.categoryId,
      announcementDescription: Announcement.value.announcementDescription,
      publishDate: Announcement.value.publishDate,
      closeDate: Announcement.value.closeDate,
      announcementDisplay: Announcement.value.announcementDisplay,
      announcementCategory: Announcement.value.announcementCategory
    };
    console.log("fetched successfully");
    console.log(Announcement.value);
    console.log(selectedAnnouncement.value);
  }
});

const categoryValue = ref([])
onMounted(async () => {
  categoryValue.value = await getCategory()
  console.log(categoryValue.value)

})

function convertToDatabaseTime(dateString) {
  const date = new Date(dateString);
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

  return formattedDate;
}

async function updateAnnouncements() {
  const matchedCategory = categoryValue.value.find(category => category.categoryName === Announcement.value.announcementCategory)
  console.log(selectedAnnouncement.value)
  if (matchedCategory) {
    Announcement.value.categoryId = matchedCategory.id
  }
  try {
    if (announcementId !== null) {
      selectedAnnouncement.value.publishDate = convertToDatabaseTime(selectedAnnouncement.value.publishDate);
      selectedAnnouncement.value.closeDate = convertToDatabaseTime(selectedAnnouncement.value.closeDate);
      await updateAnnouncement(selectedAnnouncement.value, announcementId);
    }
  } catch (error) {
    console.log("Failed to update announcement:", error);
  }
}



</script>
 
<template>
      <div class="min-h-screen" style="background-color:#288a5e;">
  <div class="page">
    <div class="Announcements">
      <h1>Announcement Detail:</h1>
    </div>
    <div class="data">
      <p class="fontbold">Title</p>
      <input type="text" class="ann-title" v-model="selectedAnnouncement.announcementTitle">
      <div>
        <p class="fontbold">Category</p>
        <select class="ann-category" v-model="selectedAnnouncement.announcementCategory">
          <option v-for="category in categoryValue" :key="category.categoryId" :value="category.categoryName">
            {{ category.categoryName }}</option>
        </select>
      </div>
      <p class="fontbold">Description</p>
      <input type="text" class=" ann-description" v-model="selectedAnnouncement.announcementDescription">

      <p class="fontbold">Publish Date</p>
      <input type="datetime-local" class=" borderstyle " v-model="selectedAnnouncement.publishDate">

      <p class="fontbold">Close Date</p>
      <input type="datetime-local" class=" borderstyle" v-model="selectedAnnouncement.closeDate">

      <p class="fontbold">Display</p>

      <div class="ann-radio-display">
        <input type="radio" id="Y" class=" ann-display" value="Y" v-model="selectedAnnouncement.announcementDisplay">
        <label for="Y">Y</label>

        <input type="radio" id="N" class="ann-display" value="N" v-model="selectedAnnouncement.announcementDisplay">
        <label for="N">N</label>
      </div>

    </div>
    <div class="Btn">
      <button class="ann-button-done" @click="() => {
        updateAnnouncements()
        $router.go(-1)
      }">done</button>
      <button class="ann-button-cancel" @click="$router.go(-1)">cancel</button>
    </div>
  </div>
</div>
</template>

<style scoped>
input[type=text],
select {
  border: 1px solid #cacaca;
  border-radius: 0.4rem;
  width: 60%;
  padding: 6px;
}

.data {
  border: 1px solid #cacaca; 
  border-radius: 0.5rem;
  padding: 5px;
  width: 90%;
  padding: 20px;
  margin: 10px;
  background-color: white;
}

.fontbold {
  font-weight: bold;
  padding: 5px 20px;

}

.page {
  padding-top: 50px;
  padding-left: 70px;
}

h1 {
  text-align: left;
  font-size: 30px;
  font-weight: bold;
  padding-bottom: 10px;
  color: white;
}

.ann-category {
  border: 1px solid #cacaca;
  border-radius: 0.4rem;
  align-items: center;
  width: 30%;
}

.Btn {
  padding: 5px 20px;
}

.ann-button-done {
  margin: 0 auto;
  margin-bottom: 5px;
  width: fit-content;
  background-color: #75dc81;
  border-radius: 0.5rem;
  border: 10px solid #75dc81;
  transition: background-color 0.3s ease-out, border-color 0.3s ease-out;
}

.ann-button-done:hover {
  background-color: rgb(92, 160, 52);
  border-color: rgb(92, 160, 52);
  color: #ffffff;
}

.ann-button-cancel {
  margin: 0 auto;
  margin-bottom: 5px;
  width: fit-content;
  background-color: #ffa0a0;
  border-radius: 0.5rem;
  border: 10px solid #ffa0a0;
  transition: background-color 0.3s ease-out, border-color 0.3s ease-out;
  margin-left: 20px;
}

.ann-button-cancel:hover {
  background-color: #ff5858;
  border-color: #ff5858;
  color: #ffffff;
}

.ann-display {
  margin: 0px 10px;
}

.borderstyle {
  border: 1px solid #cacaca;
  border-radius: 0.3rem;
  padding: 5px;
}
</style>
