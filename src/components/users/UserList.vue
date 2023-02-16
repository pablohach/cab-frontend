<template>
  <q-page>
    <q-banner
      v-show="fetchErrorMessage || fetchErrorDetails"
      rounded
      dense
      class="alert-danger q-ma-sm"
      >{{ fetchErrorMessage || fetchErrorDetails }}</q-banner
    >
    <h6>Usuarios</h6>

    <div class="row items-center">
      <!-- Filter Simple -->
      <ph-crud-filter-simple
        :filters="simpleFilters"
        @change="onChangeFilter"
        class="col-xs-6 col-sm-6 col-md-5 col-lg-3 q-mr-xs"
      ></ph-crud-filter-simple>

      <!-- Botones -->
      <q-btn
        icon="add"
        outline
        v-if="hasPermission('ROLES_ADD')"
        @click="addRole"
      ></q-btn>

      <q-btn
        icon="filter_alt"
        outline
        v-if="hasPermission('ROLES_ADD')"
        @click="openFilterModal"
        class="q-ml-sm"
        :color="hasComplexFilter ? 'red' : ''"
      ></q-btn>
    </div>

    <ph-crud-data-table
      class="row q-mt-xs"
      row-key="id_usuario"
      :columns="(columns as any)"
      :rows="(users as any)"
      :loading="fetchLoading"
      @onRequest="onRequest"
      @onRowSelect="setCurrent"
      :grid="$q.screen.lt.sm"
      :paginationData="paginationInfo"
    >
    </ph-crud-data-table>

    <!-- User Filter -->
    <user-filters ref="userFilterRef" @onFilterChange="getData"></user-filters>

    <user-view
      ref="userViewRef"
      @onUpdate="onUpdate"
      @onCreate="onCreate"
      @onDelete="onDelete"
      :vRoles="roles"
    >
    </user-view>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import useAuth from 'src/composables/useAuth';
import useUtils from 'src/composables/useUtils';

import userDataService from 'src/services/user.dataService';
import { PaginationData, SimpleFilter } from 'src/models/crud';
import { User, Role } from 'src/models/auth';
import PhCrudFilterSimple from 'src/components/crud/PhCrudFilterSimple.vue';
import PhCrudDataTable from 'src/components/crud/PhCrudDataTable.vue';

import UserFilters from './UserFilters.vue';
import UserView from './UserView.vue';

const { hasPermission } = useAuth();
const { getPaginationQueryString } = useUtils();
const {
  fetchData,
  fetchStatusCode,
  fetchLoading,
  fetchErrorMessage,
  fetchErrorDetails,
  getAll,
  getRoles,
} = userDataService();

const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const currentIndex = ref<number | null>(null);
const userFilterRef = ref();
const userViewRef = ref();
const paginationInfo = ref<PaginationData>({
  sortBy: 'id_usuario',
  descending: false,
} as PaginationData);
const currentSimpleFilter = ref<SimpleFilter>();

const simpleFilters: SimpleFilter[] = [
  { field: 'nombre', caption: 'Nombre', op: 'contains' },
  { field: 'login', caption: 'Usuario', op: 'contains' },
  { field: 'email', caption: 'Email', op: 'contains' },
];

const columns = [
  {
    name: 'id_usuario',
    field: 'id_usuario',
    label: '',
    sortable: true,
    style: 'width: 50px',
  },
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
    sortable: true,
  },
  {
    name: 'login',
    field: 'login',
    label: 'Usuario',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    field: 'email',
    label: 'Email',
    align: 'left',
  },

  {
    name: 'isActive',
    field: 'habilitado',
    label: 'Activo',
    align: 'center',
    sortable: true,
    // format: (val: string) => {
    //   return val ? 'Si' : 'No';
    // },
  },
];

const setCurrent = (index: number, user: User) => {
  setCurrentIndex(index);
  userViewRef.value?.openView(user.id_usuario);
};

const addRole = () => {
  setCurrentIndex(null);
  userViewRef.value?.openView(0);
};

const loadRoles = () => {
  getRoles()
    .then(() => {
      roles.value = fetchData.value.data;
      userFilterRef.value?.setRoles(roles.value);
    })
    .catch(() => {
      console.error(
        fetchStatusCode.value,
        fetchErrorMessage.value,
        fetchErrorDetails.value
      );
    });
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
    filters,
    userFilterRef.value.getComplexFilters()
  );

  getAll(queryString)
    .then(() => {
      setCurrentIndex(null);
      users.value = fetchData.value.data;
      paginationInfo.value = fetchData.value.pagination;
    })
    .catch(() => {
      console.error(
        fetchStatusCode.value,
        fetchErrorMessage.value,
        fetchErrorDetails.value
      );
    })
    .finally(() => {
      if (!roles.value.length) {
        loadRoles();
      }
    });
};

onMounted(() => {
  getData();
});

const onRequest = (pagination: any) => {
  paginationInfo.value.sortBy = pagination.sortBy;

  // esto es para poder usar el slot de phCrudaDataTable que se llama isActive
  if (paginationInfo.value.sortBy == 'isActive') {
    paginationInfo.value.sortBy = 'habilitado';
  }
  paginationInfo.value.descending = pagination.descending;
  getData(pagination.page, pagination.rowsPerPage);
};

const onChangeFilter = (filter: SimpleFilter) => {
  currentSimpleFilter.value = filter;
  getData();
};

const openFilterModal = () => {
  userFilterRef.value?.openModal();
};

const hasComplexFilter = computed((): boolean => {
  return userFilterRef.value?.hasComplexFilter;
});

const onUpdate = (user: User) => {
  if (currentIndex.value !== null) users.value[currentIndex.value] = user;
};

const onCreate = (user: User) => {
  users.value.push(user);
  setCurrentIndex(users.value.length - 1);
  if (paginationInfo.value) {
    paginationInfo.value.total += 1;
  }
};

const onDelete = (id: number) => {
  if (currentIndex.value !== null && users.value[currentIndex.value].id_usuario == id)
    users.value.splice(currentIndex.value, 1);
  setCurrentIndex(null);
  if (paginationInfo.value) {
    paginationInfo.value.total -= 1;
  }
};

const setCurrentIndex = (index: number | null) => {
  currentIndex.value = index;
};
</script>
