<template>
  <div>
    <q-input
      ref="passRef"
      :label="label"
      :type="isPwd ? 'password' : 'text'"
      outlined
      :modelValue="modelValue"
      :value="modelValue"
      @update:modelValue="(newValue) => $emit('update:modelValue', newValue)"
      :rules="[
        showPasswordCriteria
          ? (val) => validatePassword(val) || 'La clave debe cumplir todos los criterios.'
          : (val) => (val && val.length > 0) || 'Clave es requerida!',
      ]"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <div v-if="showPasswordCriteria" class="q-pl-md">
      <div class="text-subtitle2 q-mb-sm">La clave debe contener por lo menos:</div>

      <div>
        <q-icon
          :name="validPassword.length ? 'check_circle' : 'cancel'"
          :color="validPassword.length ? 'positive' : 'negative'"
        ></q-icon>
        {{ minPasswordLength }} caracteres.
      </div>
      <div>
        <q-icon
          :name="validPassword.capital ? 'check_circle' : 'cancel'"
          :color="validPassword.capital ? 'positive' : 'negative'"
        ></q-icon>
        una letra mayúscula.
      </div>
      <div>
        <q-icon
          :name="validPassword.number ? 'check_circle' : 'cancel'"
          :color="validPassword.number ? 'positive' : 'negative'"
        ></q-icon>
        un número.
      </div>
      <div>
        <q-icon
          :name="validPassword.symbol ? 'check_circle' : 'cancel'"
          :color="validPassword.symbol ? 'positive' : 'negative'"
        ></q-icon>
        un caracter especial: !@#$%^&*()-_+=
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { QInput } from 'quasar';

defineEmits(['update:modelValue']);

interface Props {
  modelValue: string;
  label?: string;
  showPasswordCriteria?: boolean;
  minPasswordLength?: number;
}

const prop = withDefaults(defineProps<Props>(), {
  label: 'Clave acceso *',
  showPasswordCriteria: false,
  minPasswordLength: 8,
});

const isPwd = ref(true);
const passRef = ref<QInput | null>(null);

type PasswordValidator = {
  length: boolean;
  capital: boolean;
  number: boolean;
  symbol: boolean;
};

const validPassword = reactive(<PasswordValidator>{
  length: false,
  capital: false,
  number: false,
  symbol: false,
});

function validatePassword(password: string): boolean {
  // Test length
  validPassword.length = password.length >= prop.minPasswordLength;

  // Test capital
  validPassword.capital = /^(?=.*[A-Z])/.test(password);

  // Test number
  validPassword.number = /^(?=.*[0-9])/.test(password);

  // Test symbol
  validPassword.symbol = /^(?=.*[!@#\$%\^&\*_\-=+])/.test(password);

  return (
    validPassword.length &&
    validPassword.capital &&
    validPassword.number &&
    validPassword.symbol
  );
}

const focus = () => {
  passRef.value?.focus();
};

defineExpose({
  focus,
});
</script>
