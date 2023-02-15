import { api } from 'src/boot/axios';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default function (base_url: string, base_config = {}) {
  const data = ref<any>(null);
  const statusCode = ref<number>();
  const error = ref<any>(null);
  const loading = ref(false);
  const router = useRouter();

  const defaultConfig = {
    //headers: authHeader(),
  };
  const axios_config = { ...defaultConfig, ...base_config };

  const errorMessage = computed(() => {
    let e = '';
    if (statusCode.value == 401) {
      e = 'Sin autorización.';
    } else if (error.value) {
      e = error.value.message;
    }
    return e;
  });

  const errorDetails = computed(() => {
    let e = '';
    if (error.value?.response) {
      e = error.value.response.data?.message;
    }
    return e;
  });

  const errorFields = computed(() => {
    //if (error.value && Array.isArray(error.value.response.data.message)) {
    // No viene un array, viene un objeto, lo convierto a array
    let e = error.value?.response.data.message;
    if (e && e.startsWith('{') && e.endsWith('}')) {
      e = e.substr(1, e.length - 1).split(',');

      return e.reduce((acc: any, msg: string) => {
        const [field] = msg.split(' ');
        if (!acc[field]) {
          acc[field] = [];
        }
        acc[field].push(msg);
        return acc;
      }, {}); // eg. { email: [ 'email is required' ] }
    }

    return {};
  });

  const fetch = async (url = '', config = {}, custom_base_url = '') => {
    error.value = null;
    loading.value = true;
    try {
      const myconfig: any = { ...axios_config, ...config };
      //console.log(myconfig);
      const result = await api.request({
        url: (custom_base_url || base_url) + url,
        ...myconfig,
      });
      statusCode.value = result.status;
      if (myconfig.responseType == 'blob') {
        const filename = result.headers['content-disposition']
          ? result.headers['content-disposition'].match(
            /(?<=")(?:\\.|[^"\\])*(?=")/
          )
          : '';

        data.value = {
          filename: filename ? filename[0] : '',
          blob: new Blob([result.data]),
        };
      } else {
        data.value = result.data;
      }
      return result;
    } catch (ex: any) {
      error.value = ex;
      statusCode.value = ex.request.status;
      if (
        ex.request.response &&
        JSON.parse(ex.request.response).data?.token_expired
      ) {
        console.log('MANDAR A LOGIN');
        router.push({ name: 'Login' });
      }
      return Promise.reject(ex);
    } finally {
      loading.value = false;
    }
  };

  return {
    fetchData: data,
    fetchStatusCode: statusCode,
    fetchError: error,
    fetchLoading: loading,
    fetchErrorMessage: errorMessage,
    fetchErrorDetails: errorDetails,
    fetchErrorFields: errorFields,
    fetch,
  };
}
