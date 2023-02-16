<template>
  <div>ACA TREE</div>
</template>

<script setup lang="ts">
const refresh = () => {
  console.log('REFRESH TREE');
  //getData(itemId.value);
};

defineExpose({
  refresh,
});
</script>

<style scoped></style>
