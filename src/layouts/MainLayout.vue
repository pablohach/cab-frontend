<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="../assets/logo_cab.png" />
          </q-avatar>
          <span class="xs"> C.A.B. </span>
          <span class="gt-xs"> Club Andino Bariloche </span>
          <span class="gt-xs text-caption q-ml-md">{{ `v. ${version}` }}</span>
        </q-toolbar-title>

        <div class="q-gutter-x-sm">
          <q-btn-group push>
            <!-- Settings button -->
            <q-btn push icon="settings_suggest">
              <q-tooltip :delay="400"> Configuración del equipo. </q-tooltip>
            </q-btn>

            <!-- Theme button-->
            <q-btn
              push
              :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'"
              @click="toggleDarkMode"
            >
              <q-tooltip :delay="400">
                Cambiar a modo {{ $q.dark.isActive ? 'claro' : 'oscuro' }}
              </q-tooltip>
            </q-btn>

            <!-- Login button -->
            <q-btn
              push
              no-caps
              dark
              :label="!currentUser ? 'Login' : currentUser.login"
              :icon="!currentUser ? 'login' : 'person'"
              @click="onLoginLogoutClick"
            >
              <q-tooltip v-if="currentUser" :delay="400"> Ir al perfil. </q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered side="left">
      <MenuMain></MenuMain>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { version } from '../../package.json';
import { useQuasar } from 'quasar';
import useLocalStorage from 'src/composables/useLocalStorage';
import useAuth from 'src/composables/useAuth';
import MenuMain from 'src/components/menu/MenuMain.vue';

import { useRouter } from 'vue-router';

console.log(`INIT APP v.${version}`);

const { isDarkMode, setDarkMode } = useLocalStorage();
const $q = useQuasar();

const { currentUser } = useAuth();
const router = useRouter();

const setCurrentTheme = () => {
  let isDark = isDarkMode();
  // Si esta indefinido, uso configuración global del equipo
  if (isDark === undefined && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark = true;
  }
  $q.dark.set(!!isDark);
};

const toggleDarkMode = () => {
  $q.dark.toggle();
  setDarkMode($q.dark.isActive);
};

onMounted(() => {
  setCurrentTheme();
});

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const onLoginLogoutClick = () => {
  router.push({ name: !currentUser.value ? 'Login' : 'Profile' });
};
</script>
