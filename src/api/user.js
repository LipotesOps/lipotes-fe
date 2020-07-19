import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }

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
