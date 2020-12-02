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
      component: () => import('@/views/cmdb/object/index.vue'),
      name: 'object-list',
      meta: { title: '资源列表', icon: 'documentation' }
    },
    {
      path: 'object/:object_id/attribute',
      hidden: true,
      component: () => import('@/views/cmdb/object/attribute.vue'),
      name: 'resource-attribute',
      meta: { title: '属性列表', icon: 'documentation' }
    },
    {
      path: 'object/:object_id/relation',
      hidden: true,
      component: () => import('@/views/cmdb/object/relation.vue'),
      name: 'resource-relation',
      meta: { title: '关系列表', icon: 'documentation' }
    },
    {
      path: 'object/:object_id/instance',
      hidden: true,
      component: () => import('@/views/cmdb/instance/index.vue'),
      name: 'object-instance',
      meta: { title: '资源实例', icon: 'documentation' }
    },
    {
      path: 'object/create',
      component: () => import('@/views/cmdb/object/create.vue'),
      name: 'object-create',
      meta: { title: '资源创建', icon: 'documentation' }
    }
  ]
}

export { cmdb }
