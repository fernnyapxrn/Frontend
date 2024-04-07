import { createRouter, createWebHistory } from 'vue-router';
import ListsAnnouncement from '../views/ListsAnnouncement.vue';
import OneAnnounce from '../views/OneAnnounce.vue';
import AddAnnounce from '../components/AddAnnounce.vue';
import { getAnnouncementById } from '../composable/getAnnouncement';
import EditAnnounce from '../components/EditAnnounce.vue';
import UserViewListAnnounce from '../views/UserViewListAnnounce.vue';
import UserViewOneAnnounce from '../views/UserViewOneAnnounce.vue';
import ListUser from '../views/ListUser.vue'
import AddNewUser from '../views/AddNewUser.vue'
import EditUser from '../views/EditUser.vue'
import MatchUser from '../views/MatchUser.vue'
import Login from '../views/Login.vue'
import { useAuth } from '../stores/auth';
import { getToken } from '../composable/getAnnouncement';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin/announcement',
      name: 'ListAllAnnouncement',
      component: ListsAnnouncement,
    },
    {
      path: '/admin/announcement/:id',
      name: 'OneAnnouncement',
      component: OneAnnounce,
      props: true,
      beforeEnter: async (to, from, next) => {
        const id = Number(to.params.id);
        if (!Number.isInteger(id)) {
          alert('The request page is not available');
          next('/admin/announcement');
        } else {
          try {
            const announcement = await getAnnouncementById(id);
            if (!announcement) {
              alert('The request page is not available');
              next('/admin/announcement');
            } else {
              next();
            }
          } catch (error) {
            alert('The request page is not available');
            console.log(error);
            next('/admin/announcement');
          }
        }
      },
    },
    {
      path: '/admin/announcement/add',
      name: 'AddNewAnnouncement',
      component: AddAnnounce,
    },
    {
      path: '/admin/announcement/:id/edit',
      name: 'EditAnnouncement',
      component: EditAnnounce,
    },
    {
      path: '/announcement',
      name: 'UserViewListAnnouncement',
      component: UserViewListAnnounce
      
    },
    {
      path: '/announcement/:id',
      name: 'UserViewOneAnnouncement',
      component: UserViewOneAnnounce,
      props: true,
      beforeEnter: async (to, from, next) => {
        const id = Number(to.params.id);
        if (!Number.isInteger(id)) {
          alert('The request page is not available');
          next('/announcement');
        } else {
          try {
            const announcement = await getAnnouncementById(id);
            if (!announcement) {
              alert('The request page is not available');
              next('/announcement');
            } else {
              next();
            }
          } catch (error) {
            alert('The request page is not available');
            console.log(error);
            next('/announcement');
          }
        }
      },
    },
    {
      path: '/admin/user',
      name: 'ListAllUser',
      component: ListUser     
    },
    {
      path: '/admin/user/add',
      name: 'AddNewUser',
      component: AddNewUser
      
    },
    {
      path: '/admin/user/:id/edit',
      name: 'EditUser',
      component: EditUser,
    },
    {
      path: '/admin/user/match',
      name: 'MatchUser',
      component: MatchUser,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    }
  ]
});

router.beforeEach((to, from, next) => {
  const auth = useAuth();
  const { isTokenExpired, isRefreshTokenExpired, isLoggedIn } = auth;

  if (to.name === 'UserViewListAnnouncement' || to.name === 'UserViewOneAnnouncement' ||  to.name === 'Login') {
    next();
  } else if (!isLoggedIn() && to.name !== 'Login') {
    next({ name: 'Login' });
  } else if (to.name !== 'Login' && isTokenExpired()) {
    if (isRefreshTokenExpired()) {
      next({ name: 'Login' });
    } else {
      getToken()
        .then(() => {
          next({ name: to.name });
        })
        .catch(() => {
          next({ name: 'Login' });
        });
    }
  } else {
    next();
  }
});
export default router;
