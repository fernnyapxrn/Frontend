<script setup>
import { ref, onMounted } from 'vue';
import { getAnnouncements, url } from '../composable/fetchAPI.js';
import { useRouter } from 'vue-router';
import { useAuth } from '../stores/authen';
import LeftMenu from '../components/LeftMenu.vue';




const localTime = (date) => {
  if (date === null) {
    return '-';
  } else {
    const datetimeString = date;
    const datetimeUTC = new Date(datetimeString);
    const datetimelocal = datetimeUTC.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: timeZone,
    });
    return datetimelocal;
  }
};
const announcement = ref([]);
const auth = useAuth();
const currentUserRole = auth.parseJwt(localStorage.getItem('token')).role;
onMounted(async () => {
  if (currentUserRole === 'admin') {
    announcement.value = await getAnnouncements();
  } else if (currentUserRole === 'announcer') {
    // เฉพาะ "announcer" ที่มีบทบาทเป็น 'Owner' เท่านั้นที่เห็นข้อมูล
    announcement.value = (await getAnnouncements()).filter((ann) => {
      return ann.announcementOwner === localStorage.getItem('username');
    });
  }
});

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const router = useRouter();

const goToDetail = (announceId) => {
  console.log(announceId);
  router.push({
    name: 'Informations',
    params: { id: announceId },
  });
};

const goToAddAnnounce = () => {
  router.push({ name: 'AddNewAnnouncement' });
};

const deleteAnnounce = async (id) => {
  try {
    {
      const res = await fetch(`${url}/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
       });
      if (res.ok) {
        announcement.value = announcement.value.filter((use) => {
          return use.id !== id
        })
      }
      else throw new Error('Oops, sorry cannot delete')
    }
  }
  catch (err) {
    console.log(err)
  }
}



</script>
 
<template>
   <div class="min-h-screen flex flex-row" style="background-color:#288a5e;">

    <!-- 1 -->
    <LeftMenu />

    <!--2-->
<div class="BORDER">
    <div class="Page">


      <h1 class="Title ann-title">Announcement Management</h1>
      <div style="display: flex;">

        <p class="TimeZone"><span style="font-weight: 700;">Date/Time shown in Timezone :&nbsp;</span>{{ timeZone }}</p>

        <div class="AddBtn ann-button">
          <router-link to="/admin/announcement/add">
            <button>Add Announcement</button>
          </router-link>
        </div>

      </div>
      <table class="table-auto justify-center ">
        <thead>
          <tr>
            <th>No.</th>
            <th style=" text-align: left;">Title</th>
            <th style=" text-align: left;">Category</th>
            <th style=" text-align: left;">Publish Date</th>
            <th style=" text-align: left;">Close Date</th>
            <th style=" text-align: left;">Display</th>
            <th v-if="currentUserRole === 'admin'" style=" text-align: left;">Owner</th>
            <th colspan="2">Action</th>
          </tr>

          <tr v-for="(announ, index) in announcement" :key="announ.id" class="ann-item">

            <td style="text-align: left; padding-left: 15px;" >{{ index + 1 }}</td>
            <td style="text-align: left; padding-left: 15px;" class="font-mitr">{{ announ?.announcementTitle }}</td>
            <td style="text-align: left; padding-left: 15px;">{{ announ.announcementCategory }}</td>
            <td style="text-align: left; padding-left: 15px;">{{ localTime(announ.publishDate) }}</td>
            <td style="text-align: left; padding-left: 15px;">{{ localTime(announ.closeDate) }}</td>
            <td style="text-align: left; padding-left: 15px;">{{ announ.announcementDisplay }}</td>

            <td v-if="currentUserRole === 'admin'">
              {{ announ.announcementOwner }}</td>

            <td>
              <div class="flex flex-row w-full space-x-2 justify-center">
                <button @click="goToDetail(announ.id)" class="EditBtn ">view</button>
                <button class="DeleteBtn" @click="deleteAnnounce(announ.id)">delete
                </button>
              </div>
            </td>
          </tr>
        </thead>

        <div v-if="announcement && announcement.length === 0">
          <p class="NoAnnouncement">No Announcement</p>
        </div>

      </table>

       </div>
      </div>
    </div>

</template>

<style scoped>
.BORDER{
    margin: 0 auto;
    margin-top: 50px;
    margin-bottom: 50px;
    background-color:#ffffff;
    border-collapse: separate;
    border-radius: 15px;
    border-spacing: 0;
    border: 1px solid #ffffff;
    padding: 20px;
    width: 82.5%;
}
 table{
    border-collapse: collapse;
    background-color: white;

  }
  th {
    background-color: #4ba470;
    padding: 15px;
    color: rgb(255, 255, 255);
    border-bottom: 2px solid #a0d49c;
    font-weight: bold;
    
  }
  td{
    text-align: center;
    padding: 15px;
  }
  .LeftAnnounce{
    height: 2.5rem;
    padding-top: 0.5rem;
  }
  .LeftNavBar{
    min-height: 100vh;
    display: flex;
    border-right: 2px solid;
  }
  .Page{
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }
  .Title{
    display: flex;
    flex-direction: column;
    text-align: center;
    font-weight: bold;
    font-size: 2rem;
    padding: 20px 0px 0px 0px;
  }

.NoAnnouncement {
  text-align: center;
  font-weight: bold;
  font-size: 2rem;
  padding: 20px 0px 100px 20px;
}

.TimeZone {
  padding-top: 25px;
  justify-content: center;
}

.AddBtn {
  color: #ffffff;
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: #288a5e;
  border-radius: 0.5rem;
  border: 10px solid #288a5e;
  transition: background-color 0.3s ease-out, border-color 0.3s ease-out;
  margin-left: auto;
}

.AddBtn:hover {
  background-color: #18623f;
  border-color: #18623f;
  color: #ffffff;
}

.EditBtn {
  background-color: #cacaca;
  border-radius: 0.5rem;
  border: 5px solid #cacaca;
  padding: 0.1rem 1.0rem;
  transition: background-color 0.3s ease-out, border-color 0.3s ease-out;
}

.EditBtn:hover {
  background-color: #555555;
  border-color: #555555;
  color: #ffffff;
}

.DeleteBtn {
  background-color: #ffa0a0;
  border-radius: 0.5rem;
  border: 5px solid #ffa0a0;
  padding: 0.1rem 1.0rem;
  transition: background-color 0.3s ease-out, border-color 0.3s ease-out;
}

.DeleteBtn:hover {
  background-color: #ff5858;
  border-color: #ff5858;
  color: #ffffff;
}

.CancelBtn {
  margin: 0.5rem;
  background-color: #cacaca;
  border-radius: 0.5rem;
  border: 10px solid #cacaca;
  padding: 0.1rem 1.0rem;
  transition: background-color 0.3s ease-out, border-color 0.3s ease-out;
}

.CancelBtn:hover {
  background-color: #555555;
  border-color: #555555;
  color: #ffffff;
}

.Modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 5rem;
  border-radius: 0.5rem;
  border: 1px solid #cacaca;
}

</style>
