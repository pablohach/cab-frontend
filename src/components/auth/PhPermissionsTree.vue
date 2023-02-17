<template>
  <q-page>
    <q-banner v-show="errorPermissions" rounded dense class="alert-warning q-ma-sm">{{
      errorPermissions
    }}</q-banner>

    <q-inner-loading :showing="fetchLoading" color="primary" />
    <div v-show="!fetchLoading" class="row items-center justify-end q-mb-sm">
      <!-- Filtro roles -->
      <template v-if="kind === 'role' && !itemId">
        <div v-show="roles.length" class="col">
          <q-select
            label="Rol"
            v-model="currentRole"
            emit-value
            map-options
            :options="roleOptions"
            outlined
            item-aligned
            @update:model-value="crudPermissionsMode = CrudModeEnum.VIEW"
          ></q-select>
        </div>
      </template>
      <!-- Botones edición -->
      <template v-if="kind !== 'perm'">
        <q-btn-group
          push
          class="q-mr-sm"
          v-show="
            loadedPermissions?.length > 0 &&
            canEdit &&
            !fetchLoading &&
            !errorPermissions &&
            !isRoleAdmin
          "
        >
          <q-btn
            outline
            dense
            label="Modificar permisos"
            v-show="crudPermissionsMode === CrudModeEnum.VIEW"
            @click="btnEditClick"
          />

          <q-btn
            outline
            label="Cancelar"
            v-show="[CrudModeEnum.NEW, CrudModeEnum.EDIT].includes(crudPermissionsMode)"
            @click="btnCancelClick"
          />

          <q-btn
            outline
            label="Grabar"
            v-show="[CrudModeEnum.NEW, CrudModeEnum.EDIT].includes(crudPermissionsMode)"
            @click="btnSaveClick"
          />
        </q-btn-group>
      </template>
    </div>

    <q-banner
      v-show="isRoleAdmin && !errorPermissions"
      rounded
      dense
      class="alert-info q-ma-sm"
      >Los administradores tienen todos los permisos.</q-banner
    >

    <q-tree
      :nodes="treeData"
      :ticked="checkedKeys"
      node-key="key"
      tick-strategy="leaf"
      default-expand-all
      @update:ticked="onTicked"
    ></q-tree>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import userDataService from 'src/services/user.dataService';
import useUtils from 'src/composables/useUtils';
import { CrudModeEnum, RolesEnum } from '../../enums';
import { Role } from 'src/models/auth';

interface Permission {
  id: number;
  code: string;
  name: string;
  orden: number;
  parent: string;
  kind?: string;
  checked?: boolean;
}

interface Props {
  canEdit?: boolean;
  kind: 'perm' | 'role' | 'user';
  kindId?: number;
  isUserAdmin?: boolean;
  vRoles?: Role[];
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: false,
  kind: 'perm',
  kindId: 0,
  isUserAdmin: false,
  vRoles: () => [],
});

const roleOptions = computed(() => {
  let ret: any[] = [];
  roles.value.forEach((opt) => {
    ret.push({
      label: opt.name,
      value: opt.id,
    });
  });

  return ret;
});

const crudPermissionsMode = ref(CrudModeEnum.VIEW);
const treeData = ref<any[]>([]);
const checkedKeys = ref<Array<string | number>>([]);

const {
  fetchData,
  fetchLoading,
  fetchErrorMessage,
  fetchErrorDetails,
  getRoles,
  getPermissions,
  getUserPermissions,
  getRolePermissions,
  saveUserPermissions,
  saveRolePermissions,
} = userDataService();
const { deepCopy } = useUtils();

const roles = ref<Role[]>([]);
//let permissions: Permission[] = []; // Todos los permisos existentes
const permissions = ref<Permission[]>([]); // Todos los permisos existentes
const errorPermissions = ref('');

const loadedPermissions = ref<Permission[]>([]);

const currentRole = ref(0);

const itemId = computed(() => {
  return ['user', 'role'].includes(props.kind) ? props.kindId : 0;
});

const isRoleAdmin = computed(() => {
  return (
    props.isUserAdmin ||
    (props.kind == 'role' && props.kindId == RolesEnum.ADMIN) ||
    (props.kind == 'role' && !itemId.value && currentRole.value == RolesEnum.ADMIN) ||
    (props.kind == 'perm' && currentRole.value == RolesEnum.ADMIN)
  );
});

const loadPermissions = () => {
  getPermissions()
    .then(() => {
      permissions.value = fetchData.value?.data;
      if (props.kind === 'perm') {
        loadedPermissions.value = mergePermissions(fetchData.value.data);
        setTreeData(loadedPermissions.value);
      }
    })
    .catch(() => {
      errorPermissions.value = fetchErrorDetails.value || fetchErrorMessage.value;
      console.error(errorPermissions.value);
    })
    .finally(() => {
      if (props.vRoles.length) {
        roles.value = props.vRoles;
        currentRole.value = roles.value[0].id;
      } else if (props.kind === 'role' && !itemId.value) {
        loadRoles();
      }
      refresh();
    });
};

onMounted(() => {
  loadPermissions();
});

const loadRoles = () => {
  errorPermissions.value = '';
  getRoles()
    .then(() => {
      roles.value = fetchData.value.data;
      currentRole.value = roles.value[0].id;
    })
    .catch(() => {
      errorPermissions.value = fetchErrorDetails.value || fetchErrorMessage.value;
      console.error(errorPermissions.value);
    });
};

watch(itemId, (value) => {
  console.log('watch itemId');
  if (props.kind == 'role') {
    currentRole.value = itemId.value;
  }
  getData(value);
});

watch(currentRole, (value) => {
  console.log('watch currentRole', value);
  // si pasaron un rol se dispara en el watch de itemId, ya que ahi seteo currentRole
  if (!itemId.value) {
    treeData.value = [];
    checkedKeys.value = [];
    // Si es administrador no se buscan
    getData(value);
  }
});

const getData = (id = 0) => {
  let fnGetPermissions = null;
  errorPermissions.value = '';
  loadedPermissions.value = [];
  // busco datos segun props.kind
  if (id > 0) {
    fnGetPermissions =
      props.kind === 'user'
        ? getUserPermissions
        : props.kind === 'role'
        ? getRolePermissions
        : null; // para props.kind === "role" nada para hacer
  } else {
    setTreeData(loadedPermissions.value);
  }
  if (id > 0 && !!fnGetPermissions) {
    fnGetPermissions(id)
      .then(() => {
        loadedPermissions.value = mergePermissions(fetchData.value.data);
        setTreeData(loadedPermissions.value);
      })
      .catch((err) => {
        errorPermissions.value =
          fetchErrorDetails.value || fetchErrorMessage.value || err.message;
        console.error(errorPermissions.value);
      });
  }
};

const idxPermission = (data: Permission[], code: string) => {
  let ret = -1;
  for (let i = 0; i < data.length; i++) {
    if (data[i].code === code) {
      ret = i;
      break;
    }
  }
  return ret;
};

const mergePermissions = (data: Permission[]): Permission[] => {
  // recorro data y marco en permissions los que vienen (agrego property checked y kind)
  let ret = deepCopy(permissions.value);
  let idx = -1;
  for (let i = 0; i < data.length; i++) {
    idx = idxPermission(ret, data[i].code);
    if (idx != -1) {
      ret[idx]['checked'] = true;
      if (!!data[i].kind) {
        ret[idx]['kind'] = data[i].kind;
      }
    }
  }
  return ret;
};

const getNodeByCode = (nodes: any, code: string) => {
  // nodes es objeto, no array
  let ret: any = null;
  nodes.some((node: any) => {
    if (node.data_code === code) {
      ret = node;
    } else if (node.children.length) {
      ret = getNodeByCode(node.children, code);
    }
    return !!ret;
  });
  return ret;
};

const setTreeData = (data: Permission[]) => {
  // clear Tree data
  checkedKeys.value = [];
  treeData.value = [];
  let nodes: any = [];
  let isAdmin = isRoleAdmin.value;

  data.forEach((per) => {
    let node = {
      key: per.id,
      data_code: per.code,
      label: per.name + (per.kind ? ` (${per.kind})` : ''),
      children: [],
      disabled: per.kind === 'R', // Si viene el permiso de usuario por parte del rol, no dejo cambiarlo
      parent_id: null,
    };

    if (per.checked || isAdmin) {
      checkedKeys.value.push(per.id);
    }

    if (per.parent) {
      // busco el padre, y agrego este nodo como children
      const n = getNodeByCode(nodes, per.parent);
      if (n) {
        node.parent_id = n.key;
        n.children.push(node);
      }
    } else {
      nodes.push(node);
    }
  });
  treeData.value = nodes;
};

const onTicked = (nodes: Array<string | number>) => {
  if (crudPermissionsMode.value === CrudModeEnum.VIEW || isRoleAdmin.value) {
    // No dejo seleccionar
    return undefined;
  }

  checkedKeys.value = nodes;
};

const btnEditClick = () => {
  crudPermissionsMode.value = CrudModeEnum.EDIT;
};

const btnCancelClick = () => {
  crudPermissionsMode.value = CrudModeEnum.VIEW;
  setTreeData(loadedPermissions.value);
};

const btnSaveClick = () => {
  let fnSave = null;
  let id = null;
  if (props.kind === 'user' && itemId.value > 0) {
    fnSave = saveUserPermissions;
    id = itemId.value;
  } else if (props.kind === 'role' && currentRole.value > 0) {
    fnSave = saveRolePermissions;
    id = currentRole.value;
  }

  if (fnSave && id) {
    fnSave(id, { permissions: checkedKeys.value })
      .then(() => {
        crudPermissionsMode.value = CrudModeEnum.VIEW;
      })
      .catch((err) => {
        errorPermissions.value =
          fetchErrorDetails.value || fetchErrorMessage.value || err.message;
        console.error(errorPermissions.value);
      });
  }
};

const refresh = () => {
  getData(itemId.value);
};

defineExpose({
  refresh,
});
</script>

<style scoped></style>
