import request from '@/utils/request'

export function fetchCmdbObject(params) {
  return request({
    url: '/micro-api/object/',
    method: 'get',
    params
  })
}
