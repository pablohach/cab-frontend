import { InjectionKey, Ref } from 'vue';
import { AuthStateStore } from './auth';


export const AuthStateKey: InjectionKey<Ref<AuthStateStore>> = Symbol('AuthStateStore');

// eslint-disable-next-line @typescript-eslint/ban-types
export const AuthLoginKey: InjectionKey<Function> = Symbol('AuthLoginKey');
// eslint-disable-next-line @typescript-eslint/ban-types
export const AuthLogoutKey: InjectionKey<Function> = Symbol('AuthLogoutKey');
// eslint-disable-next-line @typescript-eslint/ban-types
export const AuthAuthorizeKey: InjectionKey<Function> = Symbol('AuthAuthorizeKey');

