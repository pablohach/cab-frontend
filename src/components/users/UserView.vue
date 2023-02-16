<template>
  <PhCrudView
    ref="viewRef"
    maximized
    :crudMode="crudMode"
    :title="'Usuario ' + (model.id_usuario ? ' ' + model.id_usuario : '')"
    :loading="fetchLoading"
    confirmDeleteText="Desea borrar el usuario?"
    :canEdit="hasPermission(PermissionsEnum.USERS_EDIT) && !fetchLoading"
    :canDelete="hasPermission(PermissionsEnum.USERS_DELETE) && !fetchLoading"
    :error="errorUser"
    @onNew="onBtnNew"
    @onSave="onBtnSave"
    @onDelete="onBtnDelete"
    @onEdit="onBtnEdit"
    @onCancel="onBtnCancel"
  >
    <template v-slot:view-body>
      <q-tabs v-model="tabSelected" class="text-grey" active-color="primary">
        <q-tab name="data" label="USUARIO" />
        <q-tab name="roles" label="ROLES" />
        <q-tab name="permissions" label="PERMISOS" />
      </q-tabs>
      <q-tab-panels
        v-model="tabSelected"
        animated
        swipeable
        infinite
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel name="data">
          <q-form
            ref="formRef"
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
          >
            <div class="row items-center">
              <!-- <label class="form-label text-right col-3 col-md-2">Nombre: </label> -->
              <q-input
                label="Nombre *"
                class="col"
                outlined
                autofocus
                v-model="model.nombre"
                maxlength="100"
                :readonly="readOnly"
                :rules="[(val) => (val && val.length > 0) || 'Nombre es requerido!']"
              >
              </q-input>

              <q-input
                label="Usuario *"
                class="col-4 col-md-3"
                outlined
                v-model="model.login"
                maxlength="30"
                :readonly="readOnly"
                :rules="[(val) => (val && val.length > 0) || 'Usuario es requerido!']"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>

            <div class="row items-center">
              <q-input
                label="Email"
                class="col"
                type="email"
                v-model="model.email"
                maxlength="100"
                :readonly="readOnly"
                outlined
                :rules="[
                  (val, rules) =>
                    rules.email(val) || 'Ingrese una dirección de mail válida',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
              </q-input>
            </div>

            <div class="row items-center">
              <q-checkbox
                label="Habilitado"
                v-model="model.habilitado"
                :true-value="1"
                :false-value="0"
                :disable="readOnly"
              ></q-checkbox>
            </div>
          </q-form>

          <div class="row items-top" v-show="crudMode == CrudModeEnum.NEW">
            <ph-input-password
              ref="passwordRef"
              label="Clave"
              class="col q-pa-xs"
              v-model="passwords.password"
              showPasswordCriteria
            ></ph-input-password>

            <ph-input-password
              ref="passwordRepeatRef"
              label="Confirme clave"
              class="col q-pa-xs"
              v-model="passwords.password_repeat"
              :rules="[
                (val) => (val && val.length > 0) || 'Dato requerido.',
                (val) => passwords.password == val || 'No coincide.',
              ]"
            ></ph-input-password>
          </div>
        </q-tab-panel>

        <q-tab-panel name="roles">
          <q-option-group
            v-model="selectedRoles"
            :disable="readOnly"
            :options="
              vRoles.map((item) => ({
                label: item.name,
                value: item.id,
              }))
            "
            color="green"
            type="checkbox"
            inline
            size="lg"
          />
        </q-tab-panel>
        <q-tab-panel name="permissions">
          <ph-permissions-tree
            ref="permissionsTreeRef"
            kind="user"
            :itemId="model.id_usuario"
            :isUserAdmin="isAdmin"
            :vRoles="vRoles"
            :canEdit="
              crudMode === CrudModeEnum.VIEW &&
              hasPermission(PermissionsEnum.USERS_PERMISSIONS_EDIT)
            "
          ></ph-permissions-tree>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </PhCrudView>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import PhCrudView from '../crud/PhCrudView.vue';
import { CrudModeEnum, PermissionsEnum, RolesEnum } from 'src/enums';
import { Role, User } from 'src/models/auth';
import useAuth from 'src/composables/useAuth';
import useUtils from 'src/composables/useUtils';
import userDataService from 'src/services/user.dataService';
import { QForm, QInput, useQuasar } from 'quasar';
import PhInputPassword from '../auth/PhInputPassword.vue';
import PhPermissionsTree from '../auth/PhPermissionsTree.vue';

interface Password {
  password: string;
  password_repeat: string;
}
const passwords = ref<Password>({ password: '', password_repeat: '' } as Password);

interface Props {
  vRoles?: Role[];
}

withDefaults(defineProps<Props>(), {
  vRoles: () => [],
});

const emit = defineEmits(['onUpdate', 'onCreate', 'onDelete']);
const {
  fetchData,
  fetchStatusCode,
  fetchLoading,
  fetchErrorMessage,
  fetchErrorDetails,
  get,
  update,
  create,
  remove,
} = userDataService();
const { hasPermission } = useAuth();
const { deepCopy } = useUtils();

const model = ref<User>({} as User);
const tabSelected = ref<'data' | 'roles' | 'permissions'>('data');

const viewRef = ref();
const permissionsTreeRef = ref();
const crudMode = ref(CrudModeEnum.VIEW);
const formRef = ref<QForm | null>(null);
const passwordRef = ref();
const passwordRepeatRef = ref();

const errorUser = ref('');

const selectedRoles = ref<number[]>([]);
const $q = useQuasar();

const isAdmin = computed(() => {
  return !!model.value?.roles?.find((role: Role) => role.id == RolesEnum.ADMIN);
});

const readOnly = computed(() => {
  return crudMode.value === CrudModeEnum.VIEW;
});

const setCurrent = (data: User | null) => {
  model.value = data ? deepCopy(data) : ({} as User);
};

const clearCurrent = () => {
  selectedRoles.value = [];
  passwords.value = { password: '', password_repeat: '' } as Password;
  setCurrent(null);
  model.value.habilitado = 1;
};

const setSelectedRoles = (roles: Role[]) => {
  selectedRoles.value = [];
  roles.forEach((role: Role) => {
    selectedRoles.value.push(role.id);
  });
};

const getData = (id: number) => {
  get(id)
    .then(() => {
      setCurrent(fetchData.value.data);
      setSelectedRoles(model.value.roles);
    })
    .catch(() => {
      errorUser.value = fetchErrorDetails.value || fetchErrorMessage.value;
      console.error(
        fetchStatusCode.value,
        fetchErrorMessage.value,
        fetchErrorDetails.value
      );
    });
};

const onBtnNew = () => {
  tabSelected.value = 'data';
  clearCurrent();
  crudMode.value = CrudModeEnum.NEW;
};

const onBtnEdit = () => {
  crudMode.value = CrudModeEnum.EDIT;
  tabSelected.value = 'data';
};

const onBtnCancel = () => {
  errorUser.value = '';
  crudMode.value = CrudModeEnum.VIEW;
  getData(model.value.id_usuario);
};

const okRoles = () => {
  if (!selectedRoles.value.length) {
    errorUser.value = 'Debe seleccionar al menos un rol.';
    return false;
  }
  return true;
};

const onBtnSave = () => {
  errorUser.value = '';
  tabSelected.value = 'data';
  formRef.value?.resetValidation();
  nextTick(() => {
    formRef.value?.validate().then((success: boolean) => {
      // Si estoy grabando password ...
      if (success && (passwords.value.password || passwords.value.password_repeat)) {
        success = passwordRef.value?.validate() && passwordRepeatRef.value?.validate();
      }

      if (success) {
        success = okRoles();
        if (!success) {
          tabSelected.value = 'roles';
        }
      }

      if (success) {
        doConfirmSave();
      }
    });
  });
};

const doConfirmSave = () => {
  // Si es alta y no ingresaro passwords, avisar y ver si confirmar
  if (
    crudMode.value === CrudModeEnum.NEW &&
    (!passwords.value.password || !passwords.value.password_repeat)
  ) {
    $q.dialog({
      title: 'Atención',
      ok: 'Si',
      cancel: 'No',
      html: true,
      message:
        'No ha ingresado claves de acceso,<br>se le enviará un email al usuario para que genere su clave.<br>Desea grabar sin clave de acceso?',
      persistent: true,
    }).onOk(() => {
      doSave();
    });
  } else {
    doSave();
  }
};

const doSave = () => {
  // Le agrego los roles seleccionados
  // y si cargaron password, la agrego
  let password = {};
  if (passwords.value.password) {
    password = { password: passwords.value.password };
  }
  let userData = {
    ...model.value,
    ...{ role_codes: selectedRoles.value },
    ...password,
  };

  if (crudMode.value === CrudModeEnum.EDIT) {
    update(model.value.id_usuario, userData)
      .then(() => {
        permissionsTreeRef.value?.refresh();
        crudMode.value = CrudModeEnum.VIEW;
        tabSelected.value = 'data';
        emit('onUpdate', fetchData.value.data);
        showMessage(fetchData.value.message);
      })
      .catch(() => {
        errorUser.value = fetchErrorDetails.value || fetchErrorMessage.value;
        console.error(errorUser.value);
      });
  } else {
    create(userData)
      .then(() => {
        crudMode.value = CrudModeEnum.VIEW;
        setCurrent(fetchData.value.data);
        setSelectedRoles(model.value.roles);
        tabSelected.value = 'data';
        emit('onCreate', fetchData.value.data);
        showMessage(fetchData.value.message);
      })
      .catch(() => {
        errorUser.value = fetchErrorDetails.value || fetchErrorMessage.value;
        console.error(errorUser.value);
      });
  }
};

const showMessage = (texto: string) => {
  if (texto) {
    $q.dialog({
      title: 'Atención',
      message: texto,
      persistent: true,
    });
  }
};

const onBtnDelete = () => {
  remove(model.value.id_usuario)
    .then(() => {
      crudMode.value = CrudModeEnum.VIEW;
      clearCurrent();
      viewRef.value.openModal(false);
      emit('onDelete', fetchData.value.data.deleted);
    })
    .catch(() => {
      errorUser.value = fetchErrorDetails.value || fetchErrorMessage.value;
      console.error(errorUser.value);
    });
};

const openView = (id: number) => {
  errorUser.value = '';
  crudMode.value = id ? CrudModeEnum.VIEW : CrudModeEnum.NEW;
  // Limpio datos
  clearCurrent();
  formRef.value?.resetValidation();
  tabSelected.value = 'data';
  viewRef.value.openModal();
  if (id) {
    getData(id);
  }
};

defineExpose({
  openView,
});
</script>
