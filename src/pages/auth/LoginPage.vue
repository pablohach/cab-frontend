<template>
  <q-page class="column items-center justify-center">
    <q-banner v-if="info_message" rounded dense class="bg-secondary">{{
      info_message
    }}</q-banner>

    <q-form @submit="handleLogin">
      <q-card-section>
        <div class="text-h6">Acceso al sistema</div>
        <div class="text-subtitle1">Ingrese las credenciales para autenticarse.</div>
      </q-card-section>

      <q-separator inset />
      <q-banner v-show="message" rounded dense class="bg-warning">{{ message }}</q-banner>

      <q-card-section class="column q-gutter-md">
        <q-input
          label="Usuario *"
          outlined
          autofocus
          v-model="model.username"
          :rules="[(val) => (val && val.length > 0) || 'Usuario es requerido!']"
          @keydown.enter.prevent="passRef?.focus()"
        ></q-input>

        <!-- <q-input
          ref="passRef"
          label="Clave acceso *"
          :type="isPwd ? 'password' : 'text'"
          outlined
          v-model="model.password"
          :rules="[(val) => (val && val.length > 0) || 'Clave es requerida!']"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input> -->
        <ph-input-password ref="passRef" v-model="model.password"></ph-input-password>
      </q-card-section>

      <q-card-actions vertical align="center">
        <q-btn color="primary" type="submit" class="fit">Ingresar</q-btn>
        <q-item :to="{ name: 'ForgotPass' }" exact dense clickable class="q-mt-md"
          >Olvid&oacute; su clave?</q-item
        >
      </q-card-actions>
    </q-form>
  </q-page>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useAuth from 'src/composables/useAuth';
import { LoginFormData } from 'src/types/auth';
import PhInputPassword from 'src/components/auth/PhInputPassword.vue';

import { useQuasar } from 'quasar';

defineProps<{ info_message?: string }>();

const $q = useQuasar();

const { login } = useAuth();
const router = useRouter();
const route = useRoute();
const message = ref('');
const passRef = ref<typeof PhInputPassword | null>(null);

const model = ref<LoginFormData>({
  username: '',
  password: '',
});

const handleLogin = () => {
  console.log('Submit', model.value.username, model.value.password);
  $q.loading.show();
  message.value = '';

  login(model.value).then(
    () => {
      $q.loading.hide();
      let redir: any = route.query.redirect;
      router.push(redir || { name: 'Profile' });
    },
    (error: any) => {
      $q.loading.hide();
      message.value = error;
    }
  );
};
</script>
