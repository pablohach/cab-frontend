<template>
  <q-page>
    <h6>Permisos</h6>
    <ph-permissions-tree kind="role" :canEdit="true"></ph-permissions-tree>
  </q-page>
</template>

<script setup lang="ts">
import PhPermissionsTree from '../auth/PhPermissionsTree.vue';
</script>
