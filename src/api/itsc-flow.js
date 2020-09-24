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

export function fetchFlow(params) {
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

export function fetchTaskInstance(params) {
  return request({
    url: '/api/task-instance/',
    method: 'get',
    params
  })
}

// complete a task
export function completeTask(taskId, data) {
  return request({
    url: `/api/task-instance/${taskId}/complete/`,
    method: 'post',
    data
  })
}

export function fetchTask(params) {
  return request({
    url: '/api/task/',
    method: 'get',
    params
  })
}

export function updateTask(id, data) {
  return request({
    url: `/api/task/${id}/`,
    method: 'put',
    data
  })
}

export function fetchForm(params) {
  return request({
    url: '/api/form/',
    method: 'get',
    params
  })
}

export function fetchFormContent(params) {
  return request({
    url: '/api/form-content/',
    method: 'get',
    params
  })
}

export function updateForm(id, data) {
  return request({
    url: `/api/form/${id}/`,
    method: 'put',
    data
  })
}

export function createForm(data) {
  return request({
    url: `/api/form/`,
    method: 'post',
    data
  })
}

export function updateFormContent(id, data) {
  return request({
    url: `/api/form-content/${id}/`,
    method: 'put',
    data
  })
}

export function createFormContent(data) {
  return request({
    url: `/api/form-content/`,
    method: 'post',
    data
  })
}
