import request from '@/utils/request'

const baseURL = '/micro-api'

export function fetchCmdbObject(params) {
  return request({
    baseURL,
    url: '/object/',
    method: 'get',
    params
  })
}

export function fetchObjectCategory(params) {
  return request({
    baseURL,
    url: '/category/',
    method: 'get',
    params
  })
}
