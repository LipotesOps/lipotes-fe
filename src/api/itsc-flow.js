import request from '@/utils/request'

// itsc-flow 通用axios接口
export function generalApi({ url: url, method: method, data: data, params: params }) {
  return request({
    url: { url },
    method: { method },
    data: { data },
    params: { params }
  })
}

export function fetchFlows(params) {
  return request({
    url: '/api/flow/',
    method: 'get',
    params
  })
}

export function updateFlow(id, data) {
  return request({
    url: `/api/flow/${id}/`,
    method: 'put',
    data
  })
}

export function createFlow(data) {
  return request({
    url: `/api/flow/`,
    method: 'post',
    data
  })
}

export function fetchCategory(params) {
  return request({
    url: '/api/category/',
    method: 'get',
    params
  })
}

export function fetchBpmn(params) {
  return request({
    url: '/api/bpmn/',
    method: 'get',
    params
  })
}

export function updateBpmn(id, data) {
  return request({
    url: `/api/bpmn/${id}/`,
    method: 'put',
    data
  })
}

export function createBpmn(data) {
  return request({
    url: `/api/bpmn/`,
    method: 'post',
    data
  })
}

export function createFlowInst(data) {
  return request({
    url: `/api/flow-instance/`,
    method: 'post',
    data
  })
}

// sync taskInst from flowable
export function createTaskInst(data) {
  return request({
    url: `/api/task-instance/`,
    method: 'post',
    data
  })
}

export function fetchTask(params) {
  return request({
    url: '/api/task-instance/',
    method: 'get',
    params
  })
}
