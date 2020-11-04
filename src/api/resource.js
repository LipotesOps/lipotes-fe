import request from '@/utils/request'

const baseURL = '/micro-api'
const headers = { 'If-Match': undefined }

export function fetchCmdbObject(params) {
  return request({
    baseURL,
    url: '/resource/',
    method: 'get',
    params
  })
}

export function fetchCmdbObjectDetail(params, objectId) {
  return request({
    baseURL,
    url: `/resource/${objectId}/`,
    method: 'get',
    params
  })
}

// 更新resource object基本信息/CI/关系
export function updateObject(_id, data, _etag) {
  headers['If-Match'] = _etag
  return request({
    baseURL,
    url: `/resource/${_id}/`,
    method: 'patch',
    data,
    headers
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

