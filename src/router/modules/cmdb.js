/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const cmdb = {
  path: '/cmdb',
  component: Layout,
  redirect: '/cmdb/object',
  name: 'cmdb-object',
  meta: {
    title: '模型设置',
    icon: 'example'
  },
  children: [
    {
      path: 'object',
      component: () => import('@/views/cmdb/object/index'),
      name: 'object-list',
      meta: { title: '模型列表', icon: 'documentation' }
    },
    {
      path: 'object/create',
      component: () => import('@/views/cmdb/object/create'),
      name: 'object-create',
      meta: { title: '模型创建', icon: 'documentation' }
    }
  ]
}

export { cmdb }
