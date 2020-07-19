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
      name: 'itsc-home',
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
      name: 'itsc-home',
      meta: { title: '流程设计', icon: 'documentation' }
    },
    {
      path: 'flow/edit',
      hidden: true,
      component: () => import('@/views/itsc-flow/edit'),
      name: 'itsc-home',
      meta: { title: '设计bpmn', icon: 'documentation' }
    },
    {
      path: 'form',
      component: () => import('@/views/itsc-home/index'),
      name: 'itsc-home',
      meta: { title: '表单设计', icon: 'documentation' }
    },
    {
      path: 'jobs',
      component: () => import('@/views/itsc-task/index'),
      name: 'itsc-home',
      meta: { title: '工单中心', icon: 'documentation' }
    },
    {
      path: 'scripts',
      component: () => import('@/views/itsc-home/index'),
      name: 'itsc-home',
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
      name: 'itsc-home',
      meta: { title: '用户', icon: 'documentation' }
    },
    {
      path: 'group',
      component: () => import('@/views/itsc-home/index'),
      name: 'itsc-home',
      meta: { title: '用户组', icon: 'documentation' }
    },
    {
      path: 'role',
      component: () => import('@/views/itsc-home/index'),
      name: 'itsc-home',
      meta: { title: '角色', icon: 'documentation' }
    }
  ]
}

const permissionManageRouter = {
  path: '/user-manage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'userManage',
  meta: {
    title: '权限管理',
    icon: 'example'
  },
  children: [
    {
      path: 'permission',
      component: () => import('@/views/itsc-home/index'),
      name: 'itsc-home',
      meta: { title: '权限设置', icon: 'documentation' }
    }
  ]
}

export { serviceManageRouter, flowManageRouter, userManageRouter, permissionManageRouter }
