import request from '@/utils/request'

const baseURL = 'http://127.0.0.1:8000'
const auth = { username: 'admin', password: '20200077' }

export function login(data) {
  return request({
    baseURL: baseURL,
    url: '/users/token/',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    baseURL: baseURL,
    url: '/users/info/',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    baseURL: baseURL,
    url: '/users/logout/',
    auth,
    method: 'get'
  })
}
