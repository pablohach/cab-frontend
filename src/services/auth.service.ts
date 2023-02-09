import axios from 'axios';
import { LoginFormData } from '../types/auth';

const API_ENDPOINT = 'auth/';

class AuthService {
  login(user: LoginFormData) {
    return axios.post(API_ENDPOINT + 'login', {
      username: user.username,
      password: user.password,
    });
  }

  authenticate() {
    return axios.get(API_ENDPOINT + 'user');
  }

  authorize(user: LoginFormData) {
    return axios.post(API_ENDPOINT + 'login', {
      username: user.username,
      password: user.password,
      include_token: 0,
    });
  }

  changePass(user_id: number, data: LoginFormData) {
    return axios.post(API_ENDPOINT + 'change/' + user_id, {
      password: data.password,
      new_password: data.new_password,
    });
  }

  forgotPass(email: string) {
    return axios.post(API_ENDPOINT + 'forgot', { email });
  }

  resetPass(data: LoginFormData) {
    return axios.post(API_ENDPOINT + 'reset', {
      reset_token: data.reset_token,
      password: data.new_password,
    });
  }
}

export default new AuthService();
