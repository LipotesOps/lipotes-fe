import request from '@/utils/request'

const flowableRestUrl = '/flowable-api'
const auth = { username: 'rest-admin', password: 'test' }

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
export function apiGetProcessDefinitions(query) {
  return request({
    baseURL: flowableRestUrl,
    url: '/repository/process-definitions',
    method: 'get',
    auth,
    params: query
  })
}
