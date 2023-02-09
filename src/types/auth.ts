// ******** Type ************ //

export interface Role {
  id: number;
  name: string;
}

export interface UserBasic {
  id: number;
  username: string;
  name: string;
  surname: string;
  email: string;
}

export interface User extends UserBasic {
  date_from: string;
  date_to: string | undefined;
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
