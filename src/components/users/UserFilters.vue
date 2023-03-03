<template>
  <PhCrudFilterComplex
    ref="filterComplexRef"
    @onFilterApply="onFilterComplexApply"
    @onFilterClear="onFilterComplexClear"
    @onFilterCancel="onFilterComplexCancel"
  >
    <template v-slot:filter-body>
      <q-select
        label="Estado"
        v-model="currentComplexFilter.model.state"
        emit-value
        map-options
        :options="[
          { label: 'Todos', value: '0' },
          { label: 'Activos', value: '1' },
          { label: 'Inactivos', value: '2' },
        ]"
        outlined
        item-aligned
      ></q-select>

      <q-select
        label="Roles"
        clearable
        v-model="currentComplexFilter.model.roles"
        emit-value
        map-options
        multiple
        use-chips
        :options="
          roles.map((item) => ({
            label: item.name,
            value: item.id,
          }))
        "
        outlined
        item-aligned
      ></q-select>
    </template>
  </PhCrudFilterComplex>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import userDataService from 'src/services/user.dataService';
import useUtils from 'src/composables/useUtils';
import { Role } from 'src/models/auth';
import PhCrudFilterComplex from '../crud/PhCrudFilterComplex.vue';

const emit = defineEmits(['onFilterChange']);
const filterComplexRef = ref();
const {
  fetchData,
  fetchStatusCode,
  fetchErrorMessage,
  fetchErrorDetails,
  getRoles,
} = userDataService();

interface Props {
  isActive?: 0 | 1 | null;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: 1,
});

interface CompexFilter {
  isActive: 0 | 1 | null;
  filter_roles: number[] | null;
}

interface ComplexFilterItem {
  state: '0' | '1' | '2';
  roles: number[];
}

const roles = ref<Role[]>([]);

const emptyComplexFilter = {
  model: { state: '0', roles: [] } as ComplexFilterItem, // usado en v-model
  filter: { state: '0', roles: [] } as ComplexFilterItem, // usado para filtrar, se copian aca al aceptar el filtrado
};

const { deepCopy } = useUtils();
const currentComplexFilter = ref(deepCopy(emptyComplexFilter));

onMounted(() => {
  currentComplexFilter.value.model.state = '0';
  if (props.isActive !== null) {
    currentComplexFilter.value.model.state = props.isActive == 1 ? '1' : '2';
  }
  currentComplexFilter.value.filter.state = currentComplexFilter.value.model.state;
});

const setRoles = (data: Role[] | null) => {
  if (!data) loadRoles();
  else roles.value = data;
};

const loadRoles = () => {
  console.log('CARGANDO ROLES');
  getRoles()
    .then(() => {
      setRoles(fetchData.value?.data);
    })
    .catch(() => {
      console.error(
        fetchStatusCode.value,
        fetchErrorMessage.value,
        fetchErrorDetails.value
      );
    });
};

const onFilterComplexApply = () => {
  currentComplexFilter.value.filter = deepCopy(currentComplexFilter.value.model);
  emit('onFilterChange');
};

const onFilterComplexClear = () => {
  let has = hasComplexFilter.value;
  currentComplexFilter.value = deepCopy(emptyComplexFilter);
  if (has) {
    emit('onFilterChange');
  }
};

const onFilterComplexCancel = () => {
  currentComplexFilter.value.model = deepCopy(currentComplexFilter.value.filter);
};

const hasComplexFilter = computed(() => {
  return (
    currentComplexFilter.value.filter.state !== '0' ||
    currentComplexFilter.value.filter.roles?.length
  );
});

const getComplexFilters = (): CompexFilter => {
  let ret: CompexFilter = { isActive: null, filter_roles: null };
  if (currentComplexFilter.value.filter.state !== '0') {
    ret.isActive = currentComplexFilter.value.filter.state === '1' ? 1 : 0;
  }
  if (currentComplexFilter.value.filter.roles?.length) {
    ret.filter_roles = currentComplexFilter.value.filter.roles;
  }

  return ret;
};

const openModal = (open = true) => {
  filterComplexRef.value?.openModal(open);
};

defineExpose({
  openModal,
  getComplexFilters,
  hasComplexFilter,
  setRoles,
});
</script>

<style scoped></style>
