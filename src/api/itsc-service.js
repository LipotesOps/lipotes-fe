import request from '@/utils/request'

const baseURL = 'http://127.0.0.1:8000'

export function fetchServices(query) {
  return request({
    baseURL: baseURL,
    url: '/api/flow/service/list/',
    method: 'get',
    params: query
  })
}

