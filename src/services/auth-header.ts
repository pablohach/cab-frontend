import useLocalStorage from '../composables/useLocalStorage';

export default function authHeader(only_token = false) {
  const { getToken } = useLocalStorage();
  const token = getToken();

  if (only_token)
    return (token ? 'Bearer ' + token : '');
  else
    return (token ? { Authorization: 'Bearer ' + token } : {});
}
