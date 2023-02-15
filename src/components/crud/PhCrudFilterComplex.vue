<template>
  <q-dialog v-model="showModal">
    <q-card :style="cardStyle">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6" v-if="title">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup v-if="showCloseButton" />
      </q-card-section>

      <q-card-section>
        <slot name="filter-body"></slot>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn-group push>
          <q-btn
            :label="btnApply"
            no-caps
            outline
            @click="onClickButton('onFilterApply')"
          />
          <q-btn
            :label="btnClear"
            no-caps
            outline
            @click="onClickButton('onFilterClear')"
          />
          <q-btn
            :label="btnCancel"
            no-caps
            outline
            @click="onClickButton('onFilterCancel')"
          />
        </q-btn-group>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['onFilterApply', 'onFilterClear', 'onFilterCancel']);
interface Props {
  title?: string;
  showCloseButton?: boolean;
  cardStyle?: string;
  btnApply?: string;
  btnClear?: string;
  btnCancel?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Filtros',
  showCloseButton: true,
  cardStyle: 'width: 500px; max-width: 80vw',
  btnApply: 'Filtrar',
  btnClear: 'Limpiar filtros',
  btnCancel: 'Cancelar',
});

const showModal = ref(false);

const onClickButton = (emitkey: any) => {
  emit(emitkey);
  showModal.value = false;
};

const openModal = (open = true) => {
  showModal.value = open;
};

defineExpose({
  openModal,
});
</script>

<style scoped></style>
