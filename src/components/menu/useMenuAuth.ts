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
          icon: 'lock_person',
          level: 2,
          router_link: { name: 'PermissionList' },
        }
      );

    }

    if (hasPermission(PermissionsEnum.ROLES_VIEW)) {
      childrens.push(
        {
          title: 'Roles',
          icon: 'manage_accounts',
          level: 2,
          router_link: { name: 'RoleList' },
        }
      );
    }

    if (hasPermission(PermissionsEnum.USERS_VIEW)) {
      childrens.push(
        {
          title: 'Usuarios',
          icon: 'person',
          level: 2,
          router_link: { name: 'UserList' },
        }
      );
    }


    return childrens.length
      ? {
        title: 'Autenticación',
        icon: 'groups',
        level: 1,
        children: childrens
      }
      : null;


  });

  return { subMenuAuth };
}
