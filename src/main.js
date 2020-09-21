import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

// k-form-design
import KFormDesign from 'k-form-design'
import 'k-form-design/lib/k-form-design.css'
Vue.use(KFormDesign)

// form generator
// import '@/styles/form-generator-styles/index.scss'
// import '@/icons'

// import Tinymce from '@/components/FormGenerator/tinymce/index.vue'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// Vue.component('tinymce', Tinymce)

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
