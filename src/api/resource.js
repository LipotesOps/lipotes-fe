import request from '@/utils/request'

const baseURL = '/micro-api'
const headers = { 'If-Match': undefined }

export function fetchResourceObject(params) {
  return request({
    baseURL,
    url: '/resource/',
    method: 'get',
    params
  })
}

export function fetchResourceInstance(params, objectId) {
  return request({
    baseURL,
    url: `/${objectId}/`,
    method: 'get',
    params
  })
}

export function createResourceInstance(data, objectId) {
  return request({
    baseURL,
    url: `/${objectId}/`,
    method: 'post',
    data,
    headers
  })
}

export function fetchResourceObjectDetail(params, objectId) {
  return request({
    baseURL,
    url: `/resource/${objectId}/`,
    method: 'get',
    params
  })
}

// 更新resource object基本信息/CI/关系
export function updateResourceObject(_id, data, _etag) {
  headers['If-Match'] = _etag
  return request({
    baseURL,
    url: `/resource/${_id}/`,
    method: 'patch',
    data,
    headers
  })
}

// 更新resource instance 基本信息/CI/关系
export function updateResourceInstance(_id, _etag, data, objectId) {
  headers['If-Match'] = _etag
  return request({
    baseURL,
    url: `/${objectId}/${_id}/`,
    method: 'patch',
    data,
    headers
  })
}

// 删除resource instance
export function delResourceInstance(_id, _etag, objectId) {
  headers['If-Match'] = _etag
  return request({
    baseURL,
    url: `/${objectId}/${_id}/`,
    method: 'delete',
    headers
  })
}

// 创建resource object基本信息/CI/关系
export function createObject(data) {
  return request({
    baseURL,
    url: `/resource/`,
    method: 'post',
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

