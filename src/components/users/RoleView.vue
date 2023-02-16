<template>
  <PhCrudView
    ref="viewRef"
    :crudMode="crudMode"
    :title="'Rol ' + (model.id ? ' ' + model.id : '')"
    :loading="fetchLoading"
    confirmDeleteText="Desea borrar el rol?"
    :canEdit="
      hasPermission(PermissionsEnum.ROLES_EDIT) &&
      !fetchLoading &&
      (!model.id || model.id > RolesEnum.USER)
    "
    :canDelete="
      hasPermission(PermissionsEnum.ROLES_DELETE) &&
      !fetchLoading &&
      model.id > RolesEnum.USER
    "
    :error="errorRole"
    @onNew="onBtnNew"
    @onSave="onBtnSave"
    @onDelete="onBtnDelete"
    @onEdit="onBtnEdit"
    @onCancel="onBtnCancel"
  >
    <template v-slot:view-body>
      <q-tabs v-model="tabSelected" class="text-grey" active-color="primary">
        <q-tab name="data" label="ROL" />
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
                v-model="model.name"
                :readonly="readOnly"
                :rules="[(val) => (val && val.length > 0) || 'Nombre es requerido!']"
              >
              </q-input>
            </div>
          </q-form>
        </q-tab-panel>
        <q-tab-panel name="permissions">
          <ph-permissions-tree
            ref="treeRef"
            kind="role"
            :kindId="model.id || -1"
            :canEdit="
              crudMode === CrudModeEnum.VIEW &&
              hasPermission(PermissionsEnum.ROLES_PERMISSIONS_EDIT)
            "
          ></ph-permissions-tree>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </PhCrudView>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PhCrudView from '../crud/PhCrudView.vue';
import { CrudModeEnum, PermissionsEnum, RolesEnum } from 'src/enums';
import { Role } from 'src/models/auth';
import useAuth from 'src/composables/useAuth';
import useUtils from 'src/composables/useUtils';
import roleDataService from 'src/services/role.dataService';
import PhPermissionsTree from '../auth/PhPermissionsTree.vue';

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
} = roleDataService();
const { hasPermission } = useAuth();
const { deepCopy } = useUtils();

const model = ref<Role>({} as Role);
const tabSelected = ref<'data' | 'permissions'>('data');

const viewRef = ref();
const crudMode = ref(CrudModeEnum.VIEW);
const formRef = ref();
const errorRole = ref('');

const readOnly = computed(() => {
  return crudMode.value === CrudModeEnum.VIEW;
});

const setCurrent = (data: Role | null) => {
  model.value = data ? deepCopy(data) : ({} as Role);
};

const clearCurrent = () => {
  setCurrent(null);
};

const getData = (id: number) => {
  get(id)
    .then(() => {
      setCurrent(fetchData.value.data);
    })
    .catch(() => {
      errorRole.value = fetchErrorDetails.value || fetchErrorMessage.value;
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
  errorRole.value = '';
  crudMode.value = CrudModeEnum.VIEW;
  getData(model.value.id);
};

const onBtnSave = () => {
  errorRole.value = '';
  formRef.value?.resetValidation();
  formRef.value?.validate().then((success: boolean) => {
    if (success) {
      if (crudMode.value === CrudModeEnum.EDIT) {
        update(model.value.id, model.value)
          .then(() => {
            crudMode.value = CrudModeEnum.VIEW;
            tabSelected.value = 'data';
            emit('onUpdate', fetchData.value.data);
          })
          .catch(() => {
            errorRole.value = fetchErrorDetails.value || fetchErrorMessage.value;
            console.error(errorRole.value);
          });
      } else {
        create(model.value)
          .then(() => {
            crudMode.value = CrudModeEnum.VIEW;
            setCurrent(fetchData.value.data);
            tabSelected.value = 'data';
            emit('onCreate', fetchData.value.data);
          })
          .catch(() => {
            errorRole.value = fetchErrorDetails.value || fetchErrorMessage.value;
            console.error(errorRole.value);
          });
      }
    }
  });
};

const onBtnDelete = () => {
  remove(model.value.id)
    .then(() => {
      crudMode.value = CrudModeEnum.VIEW;
      clearCurrent();
      viewRef.value.openModal(false);
      emit('onDelete', fetchData.value.data.deleted);
    })
    .catch(() => {
      errorRole.value = fetchErrorDetails.value || fetchErrorMessage.value;
      console.error(errorRole.value);
    });
};

const openView = (id: number) => {
  errorRole.value = '';
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
