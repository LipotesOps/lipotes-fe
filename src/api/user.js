import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/users/token/',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/users/info/',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/users/logout/',
    method: 'get'
  })
}
