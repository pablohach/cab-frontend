import { computed } from 'vue';
import useAuth from '../../composables/useAuth';
import { useRouter } from 'vue-router';
import { MenuItemProps } from './MenuItem.vue';


export default function () {
  const { currentUser, logout } = useAuth();
  const router = useRouter();


  const subMenuUser = computed((): MenuItemProps | null => {

    if (!currentUser.value)
      return {
        title: 'Login',
        caption: 'Autenticarse',
        icon: 'login',
        router_link: { name: 'Login' },
      };
    else
      return {
        title: currentUser.value?.login,
        caption: 'Usuario activo',
        icon: 'account_circle',
        children: [
          {
            title: 'Perfil',
            caption: 'Perfil del usuario',
            icon: 'person',
            level: 1,
            router_link: { name: 'Profile' },
          },
          {
            title: 'Cambiar clave',
            icon: 'password',
            level: 1,
            router_link: { name: 'ChangePass' },
          },
          {
            title: 'Cerrar sesión',
            icon: 'logout',
            level: 1,
            onClick: () => {
              logout();
              router.push({ name: 'Login' });
            }
          }
        ]
      };



  });

  return { subMenuUser };
}
