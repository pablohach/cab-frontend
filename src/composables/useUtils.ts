import { SimpleFilter } from 'src/models/crud';

export default function () {
  const getQueryString = (data: any) => {
    let ret = '';
    for (const property in data) {
      ret += (ret ? '&' : '') + `${property}=` + JSON.stringify(data[property]);
    }
    return ret ? '?' + ret : '';
  };

  const getPaginationParams = (
    page: number,
    pageSize: number,
    order = '',
    filters: SimpleFilter[] = [],
    extra_params: any = {}
  ) => {
    let params: any = { page: 0, per_page: 0, order: '', filters: [] };
    if (page && Number.isInteger(page)) {
      params.page = page;
    }
    if (pageSize && Number.isInteger(pageSize)) {
      params.per_page = pageSize;
    }
    if (filters?.length) {
      params.filters = filters;
    }
    if (order) {
      params.order = order;
    }
    params = { ...params, ...extra_params };

    return params;
  };

  const getPaginationQueryString = (
    page: number,
    pageSize: number,
    order = '',
    filters: SimpleFilter[] = [],
    extra_params: any = {}
  ) => {
    return getQueryString(
      getPaginationParams(page, pageSize, order, filters, extra_params)
    );
  };


  // DeepCopy type can be easily extended by other types,
  // like Set & Map if the implementation supports them.

  type DeepCopy<T> = T extends undefined | null | boolean | string | number
    ? T
    // eslint-disable-next-line @typescript-eslint/ban-types
    : T extends Function | Set<any> | Map<any, any>
    ? unknown
    : T extends ReadonlyArray<infer U>
    ? Array<DeepCopy<U>>
    : { [K in keyof T]: DeepCopy<T[K]> };

  const deepCopy = <T>(obj: T): DeepCopy<T> => {
    // implementation doesn't matter, just use the simplest
    return obj ? JSON.parse(JSON.stringify(obj)) : null;
  };

  /*
        Retorna el objeto sin las props que son undefined
      */
  const removeObjectUndefinedProps = (obj: any) => {
    if (!!obj) {
      Object.keys(obj).forEach((key: string) => {
        if (!!obj[key]) {
          if (typeof obj[key] === 'object') {
            removeObjectUndefinedProps(obj[key]);
          } else if (typeof obj[key] === 'undefined') {
            delete obj[key];
          }
        }
      });
    }
    return obj;
  };

  /*
        Combina 2 objetos, sacandole primero las props que son undefined del objeto a agregar
      */
  const mergeObjects = (
    obj1: any,
    obj2: any,
    removeUndefined = true
  ) => {
    if (!!obj1 && !!obj2)
      return {
        ...obj1,
        ...(removeUndefined ? removeObjectUndefinedProps(obj2) : obj2),
      };
    else return obj1 || obj2;
  };

  /*
        Retorna el objeto con las props en null
      */
  const clearObjectProps = (obj: any) => {
    if (!!obj) {
      Object.keys(obj).forEach((key: string) => {
        if (!!obj[key]) {
          if (typeof obj[key] === 'object') {
            clearObjectProps(obj[key]);
          } else {
            obj[key] = null;
          }
        }
      });
    }
    return obj;
  };

  const getRegFromString = (s: string) => {
    const a = s.split('/');
    const modifiers = a.pop();
    a.shift();
    const pattern = a.join('/');
    return new RegExp(pattern, modifiers);
  };

  return {
    getQueryString,
    getPaginationParams,
    getPaginationQueryString,
    deepCopy,
    removeObjectUndefinedProps,
    mergeObjects,
    clearObjectProps,
    getRegFromString,
  };
}
