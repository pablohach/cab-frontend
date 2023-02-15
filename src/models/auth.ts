// ******** Type ************ //

export interface Role {
  id: number;
  name: string;
}

export interface UserBasic {
  id_usuario: number;
  login: string;
  nombre: string;
  email: string;
}

export interface User extends UserBasic {
  habilitado: number;
  roles: Role[];
  isActive: boolean;
}

export interface UserLogin extends UserBasic {
  roles_code: number[];
  roles: Role[];
  permissions_code: string[];
}

// Login Data from form login
export interface LoginFormData {
  username: string;
  password: string;
  new_password?: string;
  new_password_repeat?: string;
  reset_token?: string;
}


export interface LoginResponse {
  token: string;
  user: UserLogin;
  config?: SystemConfig[];
}

export interface SystemConfig {
  id: number;
  description: string;
  value: string | null;
  readonly: boolean;
}

export interface AuthStateStore {
  status: { loggedIn: boolean };
  user: UserLogin | null;
  config: SystemConfig[];
}
