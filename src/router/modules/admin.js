/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const serviceManageRouter = {
  path: '/service-manage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'serviceManage',
  meta: {
    title: '服务管理',
    icon: 'example'
  },
  children: [
    {
      path: 'settings',
      component: () => import('@/views/itsc-home/index'),
      name: 'service-manages',
      meta: { title: '服务设置', icon: 'documentation' }
    },
    {
      path: 'list',
      component: () => import('@/views/itsc-service/index'),
      name: 'service-list',
      meta: { title: '服务列表', icon: 'documentation' }
    }
  ]
}

const flowManageRouter = {
  path: '/flow-manage',
  component: Layout,
  redirect: '/flow-manage/flow',
  name: 'flowManage',
  meta: {
    title: '流程管理',
    icon: 'example'
  },
  children: [
    {
      path: 'flow',
      component: () => import('@/views/itsc-flow/index'),
      name: 'process-design',
      meta: { title: '流程设计', icon: 'documentation' }
    },
    {
      path: 'flow/edit',
      hidden: true,
      component: () => import('@/views/itsc-flow/edit'),
      name: 'bpmn-design',
      meta: { title: '设计bpmn', icon: 'documentation' }
    },
    {
      path: 'form',
      component: () => import('@/views/form/index'),
      name: 'form-manage',
      meta: { title: '表单管理', icon: 'documentation' }
    },
    {
      path: 'form/:form_uuid/design',
      hidden: true,
      // component: () => import('@/views/form/form-design'),
      component: () => import('@/views/form-generator-views/index/Home'),
      name: 'form-design',
      meta: { title: '表单配置', icon: 'documentation' }
    },
    {
      path: 'form/flow/:flow_uuid/bpmn/:bpmn_uuid',
      hidden: true,
      component: () => import('@/views/form/form-bind'),
      name: 'form-bind',
      meta: { title: '表单绑定', icon: 'documentation' }
    },
    {
      path: 'jobs',
      component: () => import('@/views/itsc-task/index'),
      name: 'tasks-center',
      meta: { title: '工单中心', icon: 'documentation' }
    },
    {
      path: 'scripts',
      component: () => import('@/views/itsc-home/index'),
      name: 'script-manage',
      meta: { title: '脚本管理', icon: 'documentation' }
    }
  ]
}

const userManageRouter = {
  path: '/user-manage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'userManage',
  meta: {
    title: '用户管理',
    icon: 'example'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/itsc-home/index'),
      name: 'users',
      meta: { title: '用户', icon: 'documentation' }
    },
    {
      path: 'group',
      component: () => import('@/views/itsc-home/index'),
      name: 'groups',
      meta: { title: '用户组', icon: 'documentation' }
    },
    {
      path: 'role',
      component: () => import('@/views/itsc-home/index'),
      name: 'roles',
      meta: { title: '角色', icon: 'documentation' }
    }
  ]
}

const permissionManageRouter = {
  path: '/permission',
  component: Layout,
  redirect: 'noRedirect',
  name: 'permissionManage',
  meta: {
    title: '权限管理',
    icon: 'example'
  },
  children: [
    {
      path: 'settings',
      component: () => import('@/views/itsc-home/index'),
      name: 'permission',
      meta: { title: '权限设置', icon: 'documentation' }
    },
    {
      path: 'happy',
      component: () => import('@/views/itsc-home/index'),
      name: 'itsc-roles',
      meta: { title: '角色', icon: 'documentation' }
    }
  ]
}

export { serviceManageRouter, flowManageRouter, userManageRouter, permissionManageRouter }
