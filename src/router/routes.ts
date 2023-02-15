import { RouteRecordRaw } from 'vue-router';
import { RolesEnum, PermissionsEnum } from '../enums';

const routes: RouteRecordRaw[] = [

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('../pages/IndexPage.vue') },
      {
        path: '/auth/login/:info_message?',
        name: 'Login',
        component: () => import('../pages/auth/LoginPage.vue'),
        props: true,
      },
      {
        path: '/auth/change-pass',
        name: 'ChangePass',
        component: () => import('../pages/auth/ChangePassword.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/auth/forgot-pass',
        name: 'ForgotPass',
        component: () => import('../pages/auth/ForgotPassword.vue'),
      },
      {
        path: '/auth/reset-pass/:reset_token',
        name: 'ResetPass',
        component: () => import('../pages/auth/ResetPassword.vue'),
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('../pages/auth/ProfilePage.vue'),
        meta: { requiresAuth: true },
      },


      // AUTHORIZATION
      {
        path: '/users',
        name: 'UserList',
        component: () => import('../pages/users/UsersPage.vue'),
        meta: { requiresPermission: PermissionsEnum.USERS_VIEW },
      },
      {
        path: '/permissions',
        name: 'PermissionList',
        component: () => import('../pages/users/PermissionsPage.vue'),
        meta: {
          requiresPermission: [
            PermissionsEnum.USERS_PERMISSIONS_VIEW,
            PermissionsEnum.ROLES_PERMISSIONS_VIEW,
          ],
        },
      },
      {
        path: '/roles',
        name: 'RoleList',
        component: () => import('../pages/users/RolesPage.vue'),
        meta: { requiresPermission: PermissionsEnum.ROLES_VIEW },
      },



    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'Notfound',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
