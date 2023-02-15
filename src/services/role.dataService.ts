import useFetch from '../composables/useFetch';

export default function () {
  const {
    fetchData,
    fetchStatusCode,
    fetchError,
    fetchLoading,
    fetchErrorMessage,
    fetchErrorDetails,
    fetchErrorFields,
    fetch,
  } = useFetch('roles/');

  const getAll = (querystr = '') => {
    return fetch(querystr, {
      method: 'get',
    });
  };

  const get = (id: number) => {
    return fetch(id.toString(), {
      method: 'get',
    });
  };

  const update = (id: number, data: any) => {
    return fetch(id.toString(), {
      method: 'put',
      data: data,
    });
  };

  const create = (data: any) => {
    return fetch('', {
      method: 'post',
      data: data,
    });
  };

  const remove = (id: number) => {
    return fetch(id.toString(), {
      method: 'delete',
    });
  };

  const getPermissions = (querystr = '') => {
    return fetch(
      querystr,
      {
        method: 'get',
      },
      'permissions/'
    );
  };

  const getRolePermissions = (role_id: number) => {
    return fetch(role_id + '/permissions', {
      method: 'get',
    });
  };

  const saveRolePermissions = (id: number, data: any) => {
    return fetch(id + '/permissions', {
      method: 'put',
      data: data,
    });
  };

  return {
    fetchData,
    fetchStatusCode,
    fetchError,
    fetchLoading,
    fetchErrorMessage,
    fetchErrorDetails,
    fetchErrorFields,
    getAll,
    get,
    update,
    create,
    remove,
    getPermissions,
    getRolePermissions,
    saveRolePermissions,
  };
}
