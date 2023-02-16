<template>
  <h6>Permisos</h6>
  <ph-permissions-tree kind="role" :canEdit="true"></ph-permissions-tree>
</template>

<script setup lang="ts">
import PhPermissionsTree from '../auth/PhPermissionsTree.vue';
</script>
