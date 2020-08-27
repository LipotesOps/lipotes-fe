import request from '@/utils/request'

const flowableRestUrl = '/flowable-api'
const auth = { username: 'rest-admin', password: 'test' }

// flowable-rest 通用axios接口
export function generaFlowable({ url: url, method: method, data: data, params: params }) {
  return request({
    baseUrl: flowableRestUrl,
    url: { url },
    method: { method },
    auth,
    data: { data },
    params: { params }
  })
}

export function createDeployment(data) {
  return request({
    baseURL: flowableRestUrl,
    url: '/repository/deployments',
    method: 'post',
    auth,
    data
  })
}

export function apiStartProcessInstance(data) {
  return request({
    baseURL: flowableRestUrl,
    url: '/runtime/process-instances',
    method: 'post',
    auth,
    data
  })
}

export function queryProcessInstance(data) {
  return request({
    baseURL: flowableRestUrl,
    url: '/query/process-instances',
    method: 'post',
    auth,
    data
  })
}

export function queryTask(data) {
  return request({
    baseURL: flowableRestUrl,
    url: '/query/tasks',
    method: 'post',
    auth,
    data
  })
}

// 根据DeploymentId 获取definitionId
export function apiGetProcessDefinitions(params) {
  return request({
    baseURL: flowableRestUrl,
    url: '/repository/process-definitions',
    method: 'get',
    auth,
    params
  })
}
