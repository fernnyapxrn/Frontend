<script setup>
 import { getAllUser, url, getToken } from "../composable/fetchAPI.js";
 import { useRouter, RouterLink, useRoute } from 'vue-router';
 import { onMounted,ref } from "vue";
 import LeftMenu from "./LeftMenu.vue";

 const data = ref([]);
 const { params } = useRoute();
 const showModal = ref(false);
 const selectedId = ref(null);

const router = useRouter();

 onMounted( async()=>{
  data.value = await getAllUser();
});

const options = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false,
    };

    //ShowTimeZone
 const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

 //show Delete Modal
 const showDeleteModal = (id) => {
    selectedId.value = id;
    showModal.value = true;
  };

  //delete selected id
  const deleteUser = async (id) => {
  try {
    {
      const res = await fetch(`${url}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
       });
      if (res.ok) {
        data.value = data.value.filter((use) => {
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



const Edituser = (id) => {
  router.push({ name: "UserDetailEdit", params: { id: id } });
};



</script>

<template>
   <div class="min-h-screen flex flex-row" style="background-color:#288a5e;">

  <!-- 1 -->
<LeftMenu />

  <!--2-->   
  <div class="BORDER">
<div class="Page">


<h1  class="Title ann-title">User Management</h1>
<div style="display: flex;">

  <p class="TimeZone"><span style="font-weight: 700;">Date/Time shown in Timezone :&nbsp;</span>{{ timeZone }}</p>
  
  <div class="AddBtn ann-button">
    <router-link to="/admin/user/add">
      <button>Add User</button>
    </router-link>
  </div>

</div>       
        <table class="table-auto justify-center ">
      <thead>
        <tr>
          <th>No.</th>
          <th style=" text-align: left;">Username</th>
          <th style=" text-align: left;">Name</th>
          <th style=" text-align: left;">Email</th>
          <th style=" text-align: left;">Role</th>
          <th style=" text-align: left;">Created On</th>
          <th style=" text-align: left;">Updated On</th>
          <th colspan="2">Action</th>
        </tr>
        <tr v-for="(user, index) of data" :key="index" class="ann-item">
            <td>
              {{ index + 1 }}
            </td>
            <td class="ann-username" style="text-align: left; padding-left: 20px;">
              {{ user.username }}
            </td>
            <td class="ann-name" style=" text-align: left; padding-left: 18px;">
              {{ user.name }}
            </td>
            <td class="ann-email" style=" text-align: left; padding-left: 18px;">
              {{ user.email }}
            </td>
            <td class="ann-role" style=" text-align: left; padding-left: 18px;">
              {{ user.role }}
            </td>
            <td class="ann-created-on" style=" text-align: left; padding-left: 18px;">
              {{ user.createdOn ? new Date(user.createdOn).toLocaleString("en-GB", options) : '-'  }}
            </td>
            <td class="ann-updated-on" style=" text-align: left; padding-left: 15px;">
              {{ user.updatedOn ? new Date(user.updatedOn).toLocaleString("en-GB", options) : '-'  }}
            </td>
            
            <td>
                <button class="EditBtn ann-button" @click="Edituser(user.id)">
                  edit
                </button>
            </td>

            <td>
    <button class="DeleteBtn ann-button" @click="showDeleteModal(user.id)">delete</button>
    <div v-show="showModal && selectedId === user.id" class="Modal">
      <p>Are you sure you want to delete this announcement?</p>
      <button class="CancelBtn" @click="showModal = false">Cancel</button>
      <button class="DeleteBtn" @click="deleteUser(user.id)">Delete</button>
    </div>
  </td>

          </tr>
      </thead>

      <div v-if="data && data.length === 0">
      <p class="NoUserMeesage">No User</p>
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
}
 table{
    border-collapse: collapse;
    background-color: rgb(255, 255, 255);
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
  .NoUserMeesage{
  text-align: center;
  font-weight: bold;
  font-size: 2rem;
  padding: 20px 0px 100px 20px;
  }
  .TimeZone{
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
  .EditBtn{
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

  .DeleteBtn{
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