<template>
  <q-dialog v-model="showModal" no-backdrop-dismiss>
    <q-card :style="cardStyle">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6" v-if="title">{{ title }}</div>
        <q-space />

        <q-btn-group push class="q-mr-sm">
          <!-- Add Btn -->
          <q-btn
            outline
            icon="add"
            v-if="canAdd"
            v-show="crudMode === CrudModeEnum.VIEW"
            @click="$emit('onNew')"
          />
          <!-- Edit Btn -->
          <q-btn
            outline
            icon="edit"
            v-if="canEdit"
            v-show="crudMode === CrudModeEnum.VIEW"
            @click="$emit('onEdit')"
          />

          <!-- Undo Btn -->
          <q-btn
            outline
            icon="undo"
            v-if="canAdd || canEdit"
            v-show="[CrudModeEnum.NEW, CrudModeEnum.EDIT].includes(crudMode)"
            @click="btnCancelClick"
          />

          <!-- Save Btn -->
          <q-btn
            outline
            icon="save"
            v-if="canAdd || canEdit"
            v-show="[CrudModeEnum.NEW, CrudModeEnum.EDIT].includes(crudMode)"
            @click="$emit('onSave')"
          />

          <!-- Delete Btn -->
          <q-btn
            outline
            icon="delete"
            text-color="warning"
            v-if="canDelete"
            v-show="crudMode === CrudModeEnum.VIEW"
            @click="btnDeleteClick"
          />
        </q-btn-group>

        <q-btn icon="close" flat round dense v-close-popup v-if="showCloseButton" />
      </q-card-section>
      <q-banner v-show="error" rounded dense class="alert-danger q-ma-sm">{{
        error
      }}</q-banner>

      <q-card-section>
        <slot name="view-body"></slot>
      </q-card-section>

      <q-inner-loading :showing="loading">
        <q-spinner-ball size="50px" color="primary" />
      </q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CrudModeEnum } from 'src/enums';
import { useQuasar } from 'quasar';

interface Props {
  crudMode: CrudModeEnum;
  loading?: boolean;
  title?: string;
  error?: string;
  showCloseButton?: boolean;
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  confirmDelete?: boolean;
  confirmDeleteText?: string;
  cardStyle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  title: '',
  error: '',
  showCloseButton: true,
  canAdd: false,
  canEdit: true,
  canDelete: true,
  confirmDelete: true,
  confirmDeleteText: 'Desea borrar el item?',
  cardStyle: 'width: 700px; max-width: 80vw',
});

const emit = defineEmits(['onNew', 'onSave', 'onDelete', 'onEdit', 'onCancel']);
const showModal = ref(false);
const $q = useQuasar();

const btnCancelClick = () => {
  if (props.crudMode === CrudModeEnum.NEW) {
    // cierro ventana
    showModal.value = false;
  }
  emit('onCancel');
};

const btnDeleteClick = () => {
  if (!!props.confirmDelete) {
    $q.dialog({
      title: 'Confirme',
      ok: 'Si',
      cancel: 'No',
      message: props.confirmDeleteText,
      persistent: true,
    }).onOk(() => {
      doDelete();
    });
  } else {
    doDelete();
  }
};

const doDelete = () => {
  emit('onDelete');
};

const openModal = (open = true) => {
  showModal.value = open;
};

defineExpose({
  openModal,
});
</script>
