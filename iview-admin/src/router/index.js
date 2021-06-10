import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import {
  setToken,
  getToken,
  canTurnTo,
  setTitle
} from '@/libs/util'
import { getUserMenu } from '@/api/user.js'
import config from '@/config'

const {
  homeName
} = config

Vue.use(Router)

const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else {
    next({
      replace: true,
      name: 'error_401'
    })
  } // 无权限，重定向到401页面
}
// console.log(routes,1111122222222);

const router = new Router({
  routes,
  mode: 'hash'
})


router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  
  // if (!token && to.name !== LOGIN_PAGE_NAME) {
  //   // 未登录且要跳转的页面不是登录页
  //   console.log(1);
    
  //   next({
  //     name: LOGIN_PAGE_NAME // 跳转到登录页
  //   })
  //  } else if (!token && to.name === LOGIN_PAGE_NAME) {
  //   // 未登陆且要跳转的页面是登录页
  //   next() // 跳转
  //  } else if (token && to.name === LOGIN_PAGE_NAME) {
  //   // 已登录且要跳转的页面是登录页
  //   next({
  //     name: homeName // 跳转到homeName页
  //   })
  //  } else { //登陆后，跳转的页面不是登录页
    // if (store.state.user.hasGetInfo) {   //已经获取用户信息后，直接判断是否有权限，没有权限重定向到404
    //   turnTo(to, store.state.user.access, next)
    // } else {  //未获取用户信息，先获取用户信息再判断，如果获取不到就跳转到登录页面
    //   turnTo(to, store.state.user.access, next)
    //   store.dispatch('getUserInfo').then(user => {
    //     // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
    //     turnTo(to, user.access, next)
    //   }).catch(() => {
    //     setToken('')
    //     next({
    //       name: 'login'
    //     })
    //   })
    // }
    // getUserMenu("admin").then(res=>{
    //   console.log(res,444444444444444);     
    // })
    // store.state.access=['/home'];
    next()
  // }
  // next()
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
