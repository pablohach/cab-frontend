<template>
  <q-input
    type="text"
    v-model="model.field_value"
    debounce="500"
    outlined
    dense
    clearable
    :bottom-slots="false"
    :placeholder="placeholder"
  >
    <template v-slot:after v-if="filters?.length > 1">
      <q-select
        v-model="model.field_name"
        option-value="field"
        option-label="caption"
        emit-value
        map-options
        :options="filters"
        dense
        outlined
        item-aligned
      ></q-select>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { SimpleFilter } from 'src/models/crud';

interface CrudSimpleFilterProps {
  placeholder?: string;
  filters?: SimpleFilter[];
  selectedFieldName?: string;
}

const props = withDefaults(defineProps<CrudSimpleFilterProps>(), {
  placeholder: 'Texto a buscar',
  filters: () => [],
  selectedFieldName: '',
});

interface Model {
  field_value: string | null;
  field_name: string;
}

const emit = defineEmits(['change']);
const model = ref<Model>({ field_value: null, field_name: '' });
const watch_enable = ref(false);

onMounted(() => {
  // Para que aparezca el select con el filtro actual
  model.value.field_name =
    props.selectedFieldName || (props.filters?.length > 0 ? props.filters[0].field : '');

  nextTick(() => {
    watch_enable.value = true;
  });
});

watch(model.value, () => {
  if (watch_enable.value) {
    applyFilter();
  }
});

const indexOfFilter = (field: string) => {
  let ret = -1;
  for (let index = 0; index < props.filters.length; index++) {
    if (props.filters[index].field === field) {
      ret = index;
      break;
    }
  }
  return ret;
};

const applyFilter = () => {
  let op = 'contains';
  const idx = indexOfFilter(model.value.field_name);
  if (idx != -1) {
    op = props.filters[idx].op;
  }

  // armo filtro definitivo
  model.value.field_value = model.value.field_value?.toLowerCase() || null;
  let condition = model.value.field_value?.trim() || null;
  if (condition) {
    if (op === 'contains') {
      op = 'like';
      condition = `%${condition}%`;
    } else if (op === 'startWith') {
      op = 'like';
      condition = `${condition}%`;
    } else if (op === 'endWith') {
      op = 'like';
      condition = `%${condition}`;
    }
    condition = condition ? encodeURI(condition) : '';
  }

  emit('change', { field: model.value.field_name, op: op, value: condition });
};
</script>
