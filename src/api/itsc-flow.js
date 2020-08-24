import request from '@/utils/request'

export function fetchFlows(query) {
  return request({
    url: '/api/flow/',
    method: 'get',
    params: query
  })
}

export function updateFlow(id, data) {
  return request({
    url: `/api/flow/${id}/`,
    method: 'put',
    data: data
  })
}

export function createFlow(data) {
  return request({
    url: `/api/flow/`,
    method: 'post',
    data: data
  })
}

export function fetchCategory(query) {
  return request({
    url: '/api/category/',
    method: 'get',
    params: query
  })
}

export function fetchBpmn(query) {
  return request({
    url: '/api/bpmn/',
    method: 'get',
    params: query
  })
}

export function updateBpmn(id, data) {
  return request({
    url: `/api/bpmn/${id}/`,
    method: 'put',
    data: data
  })
}

export function createBpmn(data) {
  return request({
    url: `/api/bpmn/`,
    method: 'post',
    data: data
  })
}

export function createFlowInst(data) {
  return request({
    url: `/api/flow-instance/`,
    method: 'post',
    data: data
  })
}
