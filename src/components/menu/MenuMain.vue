<template>
  <q-list>
    <q-item-label header> Menú </q-item-label>

    <MenuItem v-for="item in menuItems" :key="item.title" v-bind="item" />
  </q-list>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MenuItem, { MenuItemProps } from './MenuItem.vue';
import useSubMenuConfig from './useMenuConfig';
import useSubMenuUser from './useMenuUser';
import useAuth from 'src/composables/useAuth';

const { subMenuConfig } = useSubMenuConfig();
const { subMenuUser } = useSubMenuUser();

/*********************************************************
 *************   MENU PRINCIPAL   *************************
 **********************************************************/
const menuItems = computed((): MenuItemProps[] => {
  const { currentUser } = useAuth();

  let items: MenuItemProps[] = [];

  items.push({
    title: 'Home',
    caption: 'Hogar dulce hogar',
    icon: 'home',
    router_link: { name: 'Home' },
  } as MenuItemProps);

  if (subMenuConfig.value) {
    items.push(subMenuConfig.value);
  }

  if (currentUser.value?.id_usuario == 1) {
    items.push({
      title: '-',
    } as MenuItemProps);

    items.push({
      title: 'Test',
      caption: 'Pruebas varias',
      icon: 'home',
      router_link: { name: 'TestPage' },
    } as MenuItemProps);
  }

  if (subMenuUser.value) {
    items.push({
      title: '-',
    } as MenuItemProps);

    items.push(subMenuUser.value);
  }

  return items;
});
</script>
