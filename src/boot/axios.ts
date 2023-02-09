import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import useLocalStorage from '../composables/useLocalStorage';
import authHeader from '../services/auth-header';
import { logout } from '../store/auth.store';



declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const { getApiUrl } = useLocalStorage();
const api = axios.create({ baseURL: getApiUrl() + process.env.API_URL_VERSION });

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token_auth = authHeader(true);
    if (token_auth && config.headers && typeof token_auth === 'string') {
      config.headers.Authorization = token_auth;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

//Add a response interceptor
//https://medium.com/swlh/handling-access-and-refresh-tokens-using-axios-interceptors-3970b601a5da
api.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    //debugger;
    if (
      error.response.status === 401 &&
      error.response.data?.data?.token_expired
    ) {
      logout();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);



export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
