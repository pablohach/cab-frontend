<template>
  <!-- <q-item clickable tag="a" :to="{ name: to }" :href="link" :target="target">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item> -->

  <div v-if="children.length == 0">
    <!-- Nodo con link o separator (- | -item) -->
    <q-item
      v-if="!['-', '-item'].includes(title)"
      :clickable="!!link || !!router_link"
      exact
      tag="a"
      :to="router_link"
      :href="link"
      :target="target"
      :inset-level="level + (icon ? 0 : 1)"
    >
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>{{ caption }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-separator v-else :inset="title === '-' ? true : 'item'" />
  </div>
  <div v-else>
    <!-- {{children}} -->
    <q-expansion-item
      expand-separator
      :icon="icon"
      :label="title"
      :caption="caption"
      :header-inset-level="level + (icon ? 0 : 1)"
      default-closed
    >
      <MenuItem v-for="child in children" :key="child.title" v-bind="child"> </MenuItem>
    </q-expansion-item>
  </div>
</template>

<script setup lang="ts">
export interface RouterLink {
  name: string;
}

export interface MenuItemProps {
  title: string;
  caption?: string;
  link?: string;
  router_link?: RouterLink | string;
  target?: '_self' | '_blank';
  icon?: string;
  level?: number;
  children?: MenuItemProps[];
}
withDefaults(defineProps<MenuItemProps>(), {
  caption: '',
  icon: '',
  router_link: '',
  link: undefined,
  target: '_self',
  level: 0,
  children: () => [],
});
</script>
