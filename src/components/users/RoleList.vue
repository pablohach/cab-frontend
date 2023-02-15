<template>
  <q-page>
    <q-banner
      v-show="fetchErrorMessage || fetchErrorDetails"
      rounded
      dense
      class="alert-danger q-ma-sm"
      >{{ fetchErrorMessage || fetchErrorDetails }}</q-banner
    >
    <h6>Roles</h6>

    <div class="row items-center">
      <!-- Filter Simple -->
      <ph-filter-simple
        :filters="simpleFilters"
        @change="onChangeFilter"
        class="col-xs-6 col-sm-6 col-md-5 col-lg-3 q-mr-xs"
      ></ph-filter-simple>

      <!-- Botones -->
      <q-btn
        icon="add"
        outline
        v-if="hasPermission('ROLES_ADD')"
        @click="addRole"
      ></q-btn>
    </div>

    <ph-data-table
      class="row q-mt-xs"
      :columns="(columns as any)"
      :rows="(roles as any)"
      :loading="fetchLoading"
      @onRequest="onRequest"
      @onRowSelect="setCurrentRole"
      :grid="$q.screen.lt.sm"
      :paginationData="paginationInfo"
    ></ph-data-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useAuth from 'src/composables/useAuth';
import useUtils from 'src/composables/useUtils';

import roleDataService from 'src/services/role.dataService';
import { PaginationData, SimpleFilter } from 'src/models/crud';
import { Role } from 'src/models/auth';
import PhFilterSimple from 'src/components/crud/PhFilterSimple.vue';
import PhDataTable from 'src/components/crud/PhDataTable.vue';

const { hasPermission } = useAuth();
const { getPaginationQueryString } = useUtils();
const {
  fetchData,
  fetchStatusCode,
  fetchLoading,
  fetchErrorMessage,
  fetchErrorDetails,
  getAll,
} = roleDataService();

const roles = ref<Role[]>([]);
const currentIndex = ref<number | null>(null);
const paginationInfo = ref<PaginationData>({
  sortBy: 'id',
  descending: false,
} as PaginationData);
const currentSimpleFilter = ref<SimpleFilter>();

const simpleFilters: SimpleFilter[] = [
  { field: 'name', caption: 'Nombre', op: 'contains' },
];

const columns = [
  {
    name: 'id',
    field: 'id',
    label: '',
    sortable: true,
    style: 'width: 50px',
  },
  {
    name: 'name',
    field: 'name',
    label: 'Nombre',
    align: 'left',
    sortable: true,
  },
];

const setCurrentRole = (index: number, role: Role) => {
  console.log(index, role);
  setCurrentIndex(index);
  //  roleViewRef.value?.doShowRoleView(role.id);
};

const addRole = () => {
  setCurrentIndex(null);
  //roleViewRef.value?.doShowRoleView(0);
};

const getFilters = () => {
  let filters = [];
  if (currentSimpleFilter.value?.value) {
    filters.push(currentSimpleFilter.value);
  }
  return filters;
};

const getData = (page = 1, pageSize: number | null = null) => {
  if (fetchLoading.value) {
    return;
  }

  let filters = getFilters();
  let order = paginationInfo.value.sortBy
    ? paginationInfo.value.sortBy + (paginationInfo.value.descending ? ' desc' : '')
    : '';

  const queryString = getPaginationQueryString(
    page,
    pageSize || paginationInfo.value?.per_page || 0,
    order,
    filters
  );

  getAll(queryString)
    .then(() => {
      setCurrentIndex(null);
      roles.value = fetchData.value.data;
      paginationInfo.value = fetchData.value.pagination;
    })
    .catch(() => {
      console.error(
        fetchStatusCode.value,
        fetchErrorMessage.value,
        fetchErrorDetails.value
      );
    });
};

onMounted(() => {
  getData();
});

const onRequest = (pagination: any) => {
  paginationInfo.value.sortBy = pagination.sortBy;
  paginationInfo.value.descending = pagination.descending;
  getData(pagination.page, pagination.rowsPerPage);
};

const onChangeFilter = (filter: SimpleFilter) => {
  currentSimpleFilter.value = filter;
  getData();
};

const onUpdate = (role: Role) => {
  if (currentIndex.value !== null) roles.value[currentIndex.value] = role;
};

const onCreate = (role: Role) => {
  roles.value.push(role);
  setCurrentIndex(roles.value.length - 1);
};

const onDelete = (id: number) => {
  if (currentIndex.value !== null) roles.value.splice(currentIndex.value, 1);
  setCurrentIndex(null);
};

const setCurrentIndex = (index: number | null) => {
  currentIndex.value = index;
};
</script>
