import { computed } from 'vue';
import useAuth from '../../composables/useAuth';
import { RolesEnum } from '../../enums';

import { MenuItemProps } from './MenuItem.vue';
import useSubMenuAuth from './useMenuAuth';


export default function () {
  const { hasRole } = useAuth();
  const { subMenuAuth } = useSubMenuAuth();


  const subMenuConfig = computed((): MenuItemProps | null => {
    const childrens: MenuItemProps[] = [];

    if (hasRole(RolesEnum.ADMIN)) {
      childrens.push(
        {
          title: 'Configuración sistema',
          caption: '',
          icon: 'engineering',
          level: 1,
          router_link: { name: 'GlobalSettings' },
        }
      );
    }

    if (subMenuAuth.value) {
      if (childrens.length) {
        childrens.push({ title: '-' });
      }
      childrens.push(subMenuAuth.value);
    }


    return childrens.length
      ? {
        title: 'Configuración',
        caption: '',
        icon: 'settings',
      }
      : null;


  });

  return { subMenuConfig };
}
