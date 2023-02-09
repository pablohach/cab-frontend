<template>
  <router-view />
</template>

<script setup lang="ts">
import { provide } from 'vue';
import { state, login, logout, authenticate, authorize } from './store/auth.store';
import { api } from './boot/axios';
import { useRouter } from 'vue-router';
import {
  AuthStateKey,
  AuthLoginKey,
  AuthLogoutKey,
  AuthAuthorizeKey,
} from './types/symbols';

console.log(api.defaults.baseURL);

const router = useRouter();

provide(AuthStateKey, state);
provide(AuthLoginKey, login);
provide(AuthLogoutKey, logout);
provide(AuthAuthorizeKey, authorize);

// Al arrancar la App, me autentico (si hay un token), para obtener los datos del user
authenticate()?.then(
  () => {
    console.log('authenticated');
  },
  (error) => {
    if (error.response.data?.data?.token_expired) {
      console.log('token expired');
      logout();
      router.push({ name: 'Login' });
    }
  }
);
</script>
