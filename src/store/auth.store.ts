//  auth.store
//  globales para manejo de login de usuario
//

import { computed, ref } from 'vue';
import AuthService from '../services/auth.service';
import useLocalStorage from '../composables/useLocalStorage';
import { LoginFormData, LoginResponse, AuthStateStore } from '../models/auth';

const { getToken, setToken, removeToken } = useLocalStorage();

const token = getToken();

export const state = ref<AuthStateStore>({
  status: { loggedIn: false },
  user: null,
  config: [],
});

export const login = function (user: LoginFormData) {
  return AuthService.login(user).then(
    (response) => {
      loginSuccess(response.data.data);
      return Promise.resolve(response.data.data);
    },
    (error) => {
      loginFailure();
      return Promise.reject(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  );
};

export const authenticate = function () {
  if (token) {
    console.log('authenticate');
    return AuthService.authenticate().then(
      (response) => {
        authenticateSuccess(response.data.data);
        return Promise.resolve(response.data.data);
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
};

export const authorize = function (user: LoginFormData) {
  console.log('authorize');
  return AuthService.authorize(user).then(
    (response) => {
      return Promise.resolve(response.data.data);
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export const logout = function () {
  removeToken();
  state.value.status.loggedIn = false;
  state.value.user = null;
  state.value.config = [];
};

export const loginSuccess = function (data: LoginResponse) {
  setToken(data.token);
  state.value.status.loggedIn = true;
  state.value.user = data.user;
  state.value.config = data.config || [];
};

export const authenticateSuccess = function (data: LoginResponse) {
  setToken(data.token);
  state.value.status.loggedIn = true;
  state.value.user = data.user;
  state.value.config = data.config || state.value.config || [];
};

export const loginFailure = function () {
  state.value.status.loggedIn = false;
  state.value.user = null;
  state.value.config = [];
};

export const loggedIn = computed(() => {
  return state.value.status.loggedIn;
});


