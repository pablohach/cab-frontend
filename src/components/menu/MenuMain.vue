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

const { subMenuConfig } = useSubMenuConfig();

/*********************************************************
 *************   MENU PRINCIPAL   *************************
 **********************************************************/
const menuItems = computed((): MenuItemProps[] => {
  let items: MenuItemProps[] = [];

  if (subMenuConfig.value) {
    items.push(subMenuConfig.value);
  }

  items.push({
    title: 'Home',
    caption: 'Hogar dulce hogar',
    icon: 'home',
    router_link: { name: 'Home' },
  } as MenuItemProps);

  items.push({
    title: 'Menu #1',
    caption: 'menu 1',
    icon: 'school',

    children: [
      {
        title: 'Profile',
        caption: 'Perfil del usuario',
        icon: 'person',
        level: 1,
        router_link: { name: 'Profile' },
      },
      { title: 'Sub menu 2', caption: 'SM2', level: 1, router_link: { name: 'Login' } },
      {
        title: 'Sub menu 3',
        caption: 'SM3',
        level: 1,
        children: [
          {
            title: 'Sub menu 3-1',
            caption: 'SM3-1',
            level: 2,
            router_link: { name: 'Login' },
          },
        ],
      },
    ],
  } as MenuItemProps);

  items.push({
    title: '-item',
  } as MenuItemProps);

  items.push({
    title: 'Not found',
    caption: 'erro page',
    icon: 'error',
    router_link: 'Notfound',
  } as MenuItemProps);

  return items;
});
</script>
