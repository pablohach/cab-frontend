import CryptoAES from 'crypto-js/aes';
import CryptoEncUTF8 from 'crypto-js/enc-utf8';
import EncUTF8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';

import { RolesEnum } from '../enums';

export default function () {
  const getItem = (key: string, decrypt = false) => {
    let data = window.localStorage.getItem(key);
    try {
      if (data && decrypt) {
        data = CryptoAES.decrypt(
          data,
          process.env.ENCRYPT_SECRET_KEY || ''
        ).toString(CryptoEncUTF8);
      }
      if (data) {
        data = JSON.parse(data);
      }
    } catch (error) {
      data = null;
    }
    return data;
  };

  const setItem = (key: string, data: any, encrypt = false) => {
    data = JSON.stringify(data);
    if (data && encrypt) {
      data = CryptoAES.encrypt(
        data,
        process.env.ENCRYPT_SECRET_KEY || ''
      ).toString();
    }
    try {
      window.localStorage.setItem(key, data);
    } catch (error) {
      return false;
    }
    return true;
  };

  const removeItem = (key: string) => {
    return window.localStorage.removeItem(key);
  };

  const getApiUrl = (use_default_if_not_exists = true) => {
    const url =
      getItem(process.env.STORAGE_KEY_API_URL || '') ||
      (use_default_if_not_exists ? process.env.API_URL : '');
    return (url || '') + (url && !url.endsWith('/') ? '/' : '');
  };

  const setApiUrl = (url: string) => {
    return setItem(process.env.STORAGE_KEY_API_URL || '', url);
  };
  const removeApiUrl = () => {
    return removeItem(process.env.STORAGE_KEY_API_URL || '');
  };

  const getToken = () => {
    return getItem(process.env.STORAGE_KEY_AUTH_TOKEN || '', true);
  };

  const setToken = (token: string) => {
    return setItem(process.env.STORAGE_KEY_AUTH_TOKEN || '', token, true);
  };

  const removeToken = () => {
    return removeItem(process.env.STORAGE_KEY_AUTH_TOKEN || '');
  };

  const isDarkMode = (): boolean | undefined => {
    const value = getItem(process.env.STORAGE_KEY_DARK_THEME || '');
    return value ? value === 'true' : undefined;
  };

  const setDarkMode = (value: boolean) => {
    return setItem(process.env.STORAGE_KEY_DARK_THEME || '', value ? 'true' : 'false');
  };

  const removeDarkMode = () => {
    return removeItem(process.env.STORAGE_KEY_DARK_THEME || '');
  };


  const getTokenDecoded = () => {
    const token = getToken();
    if (token) {
      try {
        const payload = token.split('.')[1]; // 0: header, 1: payload, 2:signature
        return JSON.parse(EncUTF8.stringify(Base64.parse(payload)));
      } catch (error) { }
    }
    return null;
  };

  const getPermissions = () => {
    let permissions = null;
    const token = getTokenDecoded();
    if (token?.exp) {
      if (token.exp < Date.now()) {
        permissions = {
          roles: token.user_roles,
          permissions: token.user_permissions,
        };
      }
    }
    return permissions;
  };

  const loggedIn = () => {
    // Retorna true si hay token y no expiró
    const token = getTokenDecoded();
    if (token?.exp) {
      return token.exp < Date.now();
    }
    return false;
  };

  const hasRole = (roles: number | number[] | unknown) => {
    let has = false;
    let roles_array = [];
    if (typeof roles === 'number') {
      roles_array = [roles];
    }
    if (Array.isArray(roles)) {
      roles_array = roles;
    }
    if (roles_array.length) {
      const p = getPermissions();
      if (p?.roles) {
        roles_array.forEach((role) => {
          if (p.roles.includes(role)) {
            has = true;
            return false;
          }
        });
      }
    }
    return has;
  };

  const isAdmin = () => {
    return hasRole(RolesEnum.ADMIN);
  };

  const hasPermission = (permissions: string | string[] | unknown) => {
    // Si es admin, todos
    let has = isAdmin();
    if (!has) {
      let permissions_array = [];
      if (typeof permissions === 'string') {
        permissions_array = [permissions];
      }
      if (Array.isArray(permissions)) {
        permissions_array = permissions;
      }
      if (permissions_array.length) {
        const p = getPermissions();
        if (p?.permissions) {
          if (!Array.isArray(permissions)) {
            permissions = [permissions];
          }
          permissions_array.forEach((per) => {
            if (p.permissions.includes(per)) {
              has = true;
              return false;
            }
          });
        }
      }
    }
    return has;
  };

  return {
    getItem,
    setItem,
    removeItem,
    getApiUrl,
    setApiUrl,
    removeApiUrl,
    getToken,
    setToken,
    removeToken,
    isDarkMode,
    setDarkMode,
    removeDarkMode,
    getTokenDecoded,
    getPermissions,
    loggedIn,
    hasRole,
    hasPermission,
  };
}
