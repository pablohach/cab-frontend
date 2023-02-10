import { computed } from 'vue';
import useAuth from '../../composables/useAuth';
import { PermissionsEnum } from '../../enums';

import { MenuItemProps } from './MenuItem.vue';


export default function () {
  const { hasPermission } = useAuth();


  const subMenuAuth = computed((): MenuItemProps | null => {
    const childrens: MenuItemProps[] = [];

    if (
      hasPermission([
        PermissionsEnum.USERS_PERMISSIONS_VIEW,
        PermissionsEnum.ROLES_PERMISSIONS_VIEW,
      ])
    ) {

      childrens.push(
        {
          title: 'Permisos',
          caption: 'Permisos del usuario',
          icon: 'lock_person',
          level: 1,
          router_link: { name: 'PermissionList' },
        }
      );

    }

    if (hasPermission(PermissionsEnum.ROLES_VIEW)) {
      childrens.push(
        {
          title: 'Roles',
          caption: 'Roles del usuario',
          icon: 'manage_accounts',
          level: 1,
          router_link: { name: 'RoleList' },
        }
      );
    }

    if (hasPermission(PermissionsEnum.USERS_VIEW)) {
      childrens.push(
        {
          title: 'Usuarios',
          caption: 'Usuarios del sistema',
          icon: 'person',
          level: 1,
          router_link: { name: 'UserList' },
        }
      );
    }


    return childrens.length
      ? {
        title: 'Autenticación',
        caption: 'Usuarios del sistema',
        icon: 'groups',
      }
      : null;


  });

  return { subMenuAuth };
}
