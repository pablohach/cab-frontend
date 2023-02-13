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
        <div class="text-h6">Recuperaci&oacute;n de clave de acceso</div>
      </q-card-section>

      <q-separator inset />
      <q-banner
        v-show="message"
        rounded
        dense
        :class="success ? 'bg-info' : 'bg-warning'"
        >{{ message }}</q-banner
      >

      <q-card-section class="column q-gutter-md">
        <q-input
          v-model="model.email"
          type="email"
          label="Email"
          outlined
          autofocus
          :rules="[
            (val, rules) => rules.email(val) || 'Ingrese una dirección de mail válida',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="mail" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions vertical align="center">
        <q-btn color="primary" type="submit" class="fit">Enviar</q-btn>
      </q-card-actions>
    </q-form>
  </q-page>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import AuthService from 'src/services/auth.service';

import { useQuasar } from 'quasar';

const $q = useQuasar();
const success = ref(false);
const message = ref('');
const model = ref({ email: '' });

const handleSubmit = () => {
  $q.loading.show();
  message.value = '';
  AuthService.forgotPass(model.value.email).then(
    (response) => {
      $q.loading.hide();
      message.value = response?.data?.message;
      success.value = true;
    },
    (error: any) => {
      $q.loading.hide();
      message.value = error.response?.data?.message || error.message || error.toString();
    }
  );
};
</script>
