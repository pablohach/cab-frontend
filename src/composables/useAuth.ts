import { computed, inject } from 'vue';
import { RolesEnum } from '../enums';
import {
  AuthStateKey,
  AuthLoginKey,
  AuthLogoutKey,
  AuthAuthorizeKey,
} from '../types/symbols';
import { LoginFormData, SystemConfig } from '../types/auth';

export default function () {
  const authState = inject(AuthStateKey);
  const authLogin = inject(AuthLoginKey);
  const authLogout = inject(AuthLogoutKey);
  const authAuthorize = inject(AuthAuthorizeKey);

  const getSystemConfig = (id: number | null = null) => {
    // Retorna todas las configuraciones si id == null, sino la especificada
    if (!authState?.value?.config) {
      return null;
    }
    if (id) {
      const idx = authState?.value?.config.findIndex(
        (conf: any) => conf.id == id
      );
      return idx != -1 ? authState?.value?.config[idx] : null;
    } else {
      return authState?.value.config;
    }
  };

  const setSystemConfig = (value: SystemConfig | SystemConfig[]): boolean => {
    if (!authState) return false;

    if (value instanceof Array) {
      authState.value.config = value;
    } else {
      // busco idx de ese id y reemplazo
      const idx = authState?.value?.config.findIndex(
        (conf: SystemConfig) => conf.id == value.id
      );
      if (idx == -1) return false;
      authState.value.config[idx] = value;
    }
    return true;
  };

  const currentUser = computed(() => {
    return authState ? authState.value.user : null;
  });

  const loggedIn = computed(() => {
    return authState?.value.status.loggedIn;
  });

  const isAdmin = () => {
    return hasRole(RolesEnum.ADMIN);
  };

  const hasRole = (roles: number[] | number) => {
    let has = false;
    if (roles && currentUser?.value?.roles_code) {
      if (!Array.isArray(roles)) {
        roles = [roles];
      }
      roles.forEach((role) => {
        if (currentUser?.value?.roles_code.includes(role)) {
          has = true;
          return false;
        }
      });
    }

    return has;
  };

  const hasPermission = (permissions: string[] | string) => {
    // Si es admin, todos
    let has = isAdmin();
    //if (!has && permissions && currentUser?.value && currentUser.value["permissions_code"]) {
    if (!has && permissions && currentUser?.value?.permissions_code) {
      if (!Array.isArray(permissions)) {
        permissions = [permissions];
      }
      permissions.forEach((per) => {
        if (currentUser?.value?.permissions_code.includes(per)) {
          has = true;
          return false;
        }
      });
    }
    return has;
  };

  const login = (user: LoginFormData) => {
    return authLogin ? authLogin(user) : null;
  };

  const logout = () => {
    return authLogout ? authLogout() : null;
  };

  const authorize = (user: LoginFormData) => {
    return authAuthorize ? authAuthorize(user) : null;
  };


  return {
    currentUser,
    loggedIn,
    isAdmin,
    hasRole,
    hasPermission,
    login,
    logout,
    authorize,
    getSystemConfig,
    setSystemConfig,
  };
}
