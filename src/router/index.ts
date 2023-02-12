import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import useLocalStorage from '../composables/useLocalStorage';



/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });


  Router.beforeEach((to, from, next) => {
    // Saco permisos y roles de LocalStorage, ya que acá no puedo injectar auth para obtener urrentUser
    const { loggedIn, hasRole, hasPermission } = useLocalStorage();
    if (to.meta.requiresPermission || to.meta.requiresRole) {
      to.meta.requiresAuth = true;
    }

    // No está logeado y es una ruta protegida...
    if (to.meta.requiresAuth && !loggedIn())
      next({ name: 'Login', query: { redirect: to.path } });
    // Está logeado en una ruta de autenticación..
    else if ((to.name == 'Login' || to.name == 'ResetPass') && loggedIn())
      next({ name: 'Profile' });
    else if (
      to.meta.requiresPermission &&
      !hasPermission(to.meta.requiresPermission)
    )
      next({ name: 'Unauthorized' });
    else if (to.meta.requiresRole && !hasRole(to.meta.requiresRole))
      next({ name: 'Unauthorized' });
    // Continuamos..
    else next();
  });


  return Router;
});
