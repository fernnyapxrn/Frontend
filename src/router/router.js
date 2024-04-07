import { createRouter, createWebHistory } from 'vue-router'
import UserHomePage from "../components/UserHomePage.vue"
import UserDetailAdd from "../components/UserDetailAdd.vue"
import UserDetailEdit from "../components/UserDetailEdit.vue"
import MatchPassword from "../components/MatchPassword.vue"
import LoginUser from "../components/LoginUser.vue"
import HomePage from "../components/HomePage.vue"
import AddNewAnnounce from "../components/AddNewAnnounce.vue"
import UpdateAnnouncement from "../components/UpdateAnnounce.vue"
import ViewerList from "../components/ViewerList.vue"
import Informations from "../components/Informations.vue"
import ViewerDetail from "../components/ViewerDetail.vue"

import { useAuth } from '../stores/authen.js';
import { getToken, getIdAnnouncement } from '../composable/fetchAPI.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin/user',
      name: 'UserHomePage',
      component: UserHomePage
    },
    {
      path: '/admin/user/add',
      name: 'UserDetailAdd',
      component: UserDetailAdd
    },
    {
      path: "/admin/user/:id/edit",
      name: "UserDetailEdit",
      component: UserDetailEdit
    },
    {
      path: "/admin/user/match",
      name: "MatchPassword",
      component: MatchPassword
    },
    
    {
      path: "/login",
      name: "LoginUser",
      component: LoginUser
    },
    {
      path: "/admin/announcement",
      name: "HomePage",
      component: HomePage
    },
    {
      path: '/admin/announcement/:id',
      name: 'Informations',
      component: Informations,
      props: true,
      beforeEnter: async (to, from, next) => {
        const id = Number(to.params.id);
        if (!Number.isInteger(id)) {
          alert('The request page is not available');
          next('/admin/announcement');
        } else {
          try {
            const announcement = await getIdAnnouncement(id);
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
      component: AddNewAnnounce,
    },
    {
      path: '/admin/announcement/:id/edit',
      name: 'EditAnnouncement',
      component: UpdateAnnouncement,
    },
    {
      path: '/announcement',
      name: 'ViewerList',
      component: ViewerList
    },
    {
      path : '/announcement/:id',
      name : 'ViewerDetail',
      component :ViewerDetail
  },
  ]
});


router.beforeEach(async (to, from, next) => {
  const auth = useAuth();
  const { isTokenExpired, isRefreshTokenExpired, isLoggedIn } = auth;

  if (to.name !== 'LoginUser' && isTokenExpired() && isLoggedIn()) {
    if (isRefreshTokenExpired()) {
      next({ name: 'LoginUser' });
    } else {
      try {
        await getToken();
        next({ name: to.name });
      } catch (error) {
        console.error('Error refreshing token:', error);
        next({ name: 'LoginUser' });
      }
    }
  } else {
    next();
  }
});

export default router;