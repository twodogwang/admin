import fetch from '@/utils/fetch';
import qs from 'qs';

export function login(username, password) {
  return fetch({
    url: '/baseLogin/login',
    method: 'post',
    data: qs.stringify({
      username,
      password,
      rememberMe: false
    })
  });
}

export function getInfo(token) {
  return fetch({
    url: '/user/info',
    // url: 'http://127.0.0.1:3333/api/user/info',
    method: 'get',
    params: {
      token
    }
  });
}

export function logout() {
  return fetch({
    url: '/baseLogin/logout',
    method: 'get'
  });
}
