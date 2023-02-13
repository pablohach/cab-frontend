<template>
  <q-page class="column items-center justify-center">
    <q-form
      @submit="handleSubmit"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
    >
      <q-card-section>
        <div class="text-h6">Cambio de clave de acceso</div>
        <div class="text-subtitle1">del usuario {{ currentUser?.login }}</div>
      </q-card-section>

      <q-separator inset />
      <q-banner v-show="message" rounded dense class="bg-warning">{{ message }}</q-banner>

      <q-card-section class="column q-gutter-md">
        <ph-input-password
          label="Clave actual"
          v-model="model.password"
        ></ph-input-password>

        <ph-input-password
          label="Nueva clave"
          v-model="model.new_password"
          showPasswordCriteria
        ></ph-input-password>

        <ph-input-password
          label="Confirme nueva clave"
          v-model="model.new_password_repeat"
        ></ph-input-password>
      </q-card-section>

      <q-card-actions vertical align="center">
        <q-btn color="primary" type="submit" class="fit">Cambiar clave</q-btn>
      </q-card-actions>
    </q-form>
  </q-page>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from 'src/services/auth.service';
import useAuth from 'src/composables/useAuth';
import { LoginFormData } from 'src/types/auth';
import PhInputPassword from 'src/components/auth/PhInputPassword.vue';

import { useQuasar } from 'quasar';

const $q = useQuasar();

const { currentUser, logout } = useAuth();
const router = useRouter();
const message = ref('');

const model = ref<LoginFormData>({
  username: '',
  password: '',
  new_password: '',
  new_password_repeat: '',
});

const handleSubmit = () => {
  message.value = '';
  if (!currentUser?.value?.id_usuario) {
    message.value = 'No está definodo el usuario.';
  } else if (model.value.new_password !== model.value.new_password_repeat) {
    message.value = 'Las claves ingresadas no coinciden.';
  } else if (model.value.password === model.value.new_password) {
    message.value = 'La nueva clave es igual a la clave actual.';
  } else {
    $q.loading.show();
    AuthService.changePass(currentUser.value.id_usuario, model.value).then(
      () => {
        $q.loading.hide();
        logout();
        router.push({
          name: 'Login',
          params: { info_message: 'Se ha cambiado la clave de acceso.' },
        });
      },
      (error: any) => {
        $q.loading.hide();
        message.value =
          error.response?.data?.message || error.message || error.toString();
      }
    );
  }
};
</script>
