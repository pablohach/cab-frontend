import useFetch from "../composables/useFetch";

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
  } = useFetch("users/");

  const getAll = (querystr = "") => {
    return fetch(querystr, {
      method: "get",
    });
  };

  const get = (id: number) => {
    return fetch(id.toString(), {
      method: "get",
    });
  };

  const update = (id: number, data: any) => {
    return fetch(id.toString(), {
      method: "put",
      data: data,
    });
  };

  const create = (data: any) => {
    return fetch("", {
      method: "post",
      data: data,
    });
  };

  const remove = (id: number) => {
    return fetch(id.toString(), {
      method: "delete",
    });
  };

  const getRoles = (querystr = "") => {
    return fetch(
      querystr,
      {
        method: "get",
      },
      "roles/"
    );
  };

  const getPermissions = (querystr = "") => {
    return fetch(
      querystr,
      {
        method: "get",
      },
      "permissions/"
    );
  };

  const getUserPermissions = (id: number) => {
    return fetch(id + "/permissions", {
      method: "get",
    });
  };

  const saveUserPermissions = (id: number, data: any) => {
    return fetch(id + "/permissions", {
      method: "put",
      data: data,
    });
  };

  const getRolePermissions = (role_id: number) => {
    return fetch(
      role_id + "/permissions",
      {
        method: "get",
      },
      "roles/"
    );
  };

  const saveRolePermissions = (id: number, data: any) => {
    return fetch(
      id + "/permissions",
      {
        method: "put",
        data: data,
      },
      "roles/"
    );
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
    getRoles,
    getPermissions,
    getUserPermissions,
    getRolePermissions,
    saveUserPermissions,
    saveRolePermissions,
  };
}
