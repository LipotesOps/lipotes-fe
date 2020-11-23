/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const cmdb = {
  path: '/cmdb',
  component: Layout,
  redirect: '/cmdb/object',
  name: 'cmdb-object',
  meta: {
    title: '资源设置',
    icon: 'example'
  },
  children: [
    {
      path: 'object',
      component: () => import('@/views/cmdb/object/index'),
      name: 'object-list',
      meta: { title: '资源列表', icon: 'documentation' }
    },
    {
      path: 'object/:object_id/detail',
      hidden: true,
      component: () => import('@/views/cmdb/object/detail'),
      name: 'object-detail',
      meta: { title: '资源详情', icon: 'documentation' }
    },
    {
      path: 'object/:object_id/instance',
      hidden: true,
      component: () => import('@/views/cmdb/instance/index'),
      name: 'object-instance',
      meta: { title: '资源实例', icon: 'documentation' }
    },
    {
      path: 'object/create',
      component: () => import('@/views/cmdb/object/create'),
      name: 'object-create',
      meta: { title: '资源创建', icon: 'documentation' }
    }
  ]
}

export { cmdb }
