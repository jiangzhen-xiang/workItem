// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 兼容ie 11
import '@babel/polyfill'
import Vue from 'vue'
import App from './App'
import 'es6-promise/auto'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import '@/icons/index.js'
import {
  directive as clickOutside
} from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
// import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import TreeTable from 'tree-table-vue'
import echarts from 'echarts'
import VueBus from 'vue-bus'
import axios from 'axios'

// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(TreeTable)
Vue.use(VOrgTree)
Vue.use(VueBus)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
Vue.prototype.$echarts = echarts
Vue.prototype.$http=axios

const getFormat = function (time, str) {
  let date = new Date(time)
  let year = date.getFullYear();
  let Math = date.getMonth() + 1;
  let day = date.getDate();
  let hh = date.getHours()
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  Math = Math.toString().length > 1 ? Math : '0' + Math
  day = day.toString().length > 1 ? day : '0' + day
  hh = hh.toString().length > 1 ? hh : '0' + hh
  mm = mm.toString().length > 1 ? mm : '0' + mm
  ss = ss.toString().length > 1 ? ss : '0' + ss


  let MStr = /M+/;
  let YStr = /y+/;
  let dStr = /d+/;
  let hStr = /H+/;
  let mStr = /m+/;
  let sStr = /s+/;
  str = str.replace(YStr, year);
  str = str.replace(MStr, Math);
  str = str.replace(dStr, day);
  str = str.replace(hStr, hh);
  str = str.replace(mStr, mm);
  str = str.replace(sStr, ss);
  return time ? str : '';

}
Vue.prototype.$timeFormat = getFormat
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
