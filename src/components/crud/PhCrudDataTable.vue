<template>
  <q-table
    ref="tableRef"
    :row-key="rowKey"
    :columns="columns"
    :rows="rows"
    :rows-per-page-options="rowsPerPageOptions"
    v-model:pagination="pagination"
    @row-click="onRowClick"
    @row-dblclick="onRowDblClick"
    @request="onRequest"
    bordered
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template v-slot:body-cell-isActive="props">
      <q-td :props="props">
        <q-icon :name="!!props.value ? 'done' : ''"></q-icon>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { PaginationData } from 'src/models/crud';

interface Props {
  columns: any[] | undefined;
  rows: any[];
  rowKey?: string | ((row: any) => any) | undefined;
  paginationData?: PaginationData;
  rowsPerPageOptions?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  paginationData: undefined,
  rowsPerPageOptions: () => [5, 10, 15, 20, 25, 50, 100],
});

const emit = defineEmits(['onRowSelect', 'onRowDblClick', 'onRequest']);
const tableRef = ref();

const pagination = ref({
  sortBy: '',
  descending: false,
  page: 0,
  rowsPerPage: 0,
  rowsNumber: 0,
});

watch(props, () => {
  setPaginationData();
});

const setPaginationData = () => {
  if (props.paginationData) {
    pagination.value.rowsNumber = props.paginationData.total;
    pagination.value.page = props.paginationData.page;
    pagination.value.rowsPerPage = props.paginationData.per_page;
  }
};

const onRowClick = (evt: Event, row: any, index: number) => {
  emit('onRowSelect', index, row);
};

const onRowDblClick = (evt: Event, row: any, index: number) => {
  emit('onRowDblClick', index, row);
};

const onRequest = (props: any) => {
  pagination.value.sortBy = props.pagination.sortBy;
  pagination.value.descending = props.pagination.descending;
  emit('onRequest', props.pagination);
};
</script>

<style scoped></style>
