<template>
  <Layout style="height: 100%"
          class="main">
    <Sider hide-trigger
           collapsible
           :width="256"
           :collapsed-width="64"
           v-model="collapsed"
           class="left-sider"
           :style="{ overflow: 'hidden' }">
      <side-menu accordion
                 ref="sideMenu"
                 :active-name="getActiveName"
                 :collapsed="collapsed"
                 @on-select="turnToPage"
                 :menu-list="menuList">

        <div class="logo-con"
             style="text-align: center;line-height: 44px;color: #feffff;font-size: 30px;background: #4a4846;">
          <div v-show="!collapsed">MetaData</div>
          <div v-show="collapsed">MD</div>
        </div>
      </side-menu>
    </Sider>
    <Layout style="height: 100%">
      <Header class="header-con">
        <header-bar :collapsed="collapsed"
                    @on-coll-change="handleCollapsedChange">
          <user :message-unread-count="unreadCount"
                :user-avatar="userAvatar" />
          <!-- <language v-if="$config.useI18n"
                    @on-lang-change="setLocal"
                    style="margin-right: 10px;"
                    :lang="local" /> -->
          <fullscreen v-model="isFullscreen"
                      style="margin-right: 10px;" />
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper"
               v-if="$route.meta.showTag">
            <tags-nav :value="$route"
                      @input="handleClick"
                      :list="tagNavList"
                      @on-close="handleCloseTag" />
          </div>
          <Content class="content-wrapper"
                   style="padding:0;overflow-x:hidden;">
            <keep-alive :include="cacheList">
              <router-view />
            </keep-alive>
            <ABackTop :height="100"
                      :bottom="80"
                      :right="50"
                      container=".content-wrapper"></ABackTop>

            <!--增加公共弹窗  -->
            <Modal v-model="modal12"
                   fullscreen
                   scrollable
                   :title="modalTitle">
              <div>
                <textarea name
                          style="width:100%;border:solid 1px #ddd;border-radius:5px;"
                          rows="30"
                          readonly>{{ code }}</textarea>
              </div>
            </Modal>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'
import './main.less'
import { getUserMenu } from '@/api/user'

export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop,
  },
  data () {
    return {
      modal12: false,
      code: '',
      modalTitle: '',
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: true,
      // arr1:[],
    }
  },
  computed: {
    ...mapGetters(['errorCount']),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    getActiveName () {
      return this.$route.meta.toDirect || this.$route.name
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvatar () {
      return this.$store.state.user.avatarImgPath
    },
    cacheList () {
      const list = [
        'flowDetail',
        'ParentView',
        ...(this.tagNavList.length
          ? this.tagNavList
            .filter(item => !(item.meta && item.meta.notCache))
            .map(item => item.name)
          : [])
      ]
      console.log('list=========list', list)
      return list
    },
    menuList () {
      console.log('menulist', this.$store.getters)
      return this.$store.getters.getMenuList;
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    },
    key(){
      return this.$route.name !== undefined ?this.$route.name+new Date() : this.$route.name;
    }
  },
  created () {
    this.$bus.on('showModal12', this.handleShow)
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions(['handleLogin', 'getUnreadMessageCount','getUserRoute']),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleShow (obj) {
      this.modal12 = true
      this.code = obj.code
      this.modalTitle = '文件预览(' + obj.fileName + ')'
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    // 得到该菜单对应路由下标
    getIndex(routers,title){
        let index=routers.findIndex(item=>{
          return item.meta.title==title;
        })
        return index;
    },
    async initMenu(){
      let res=await getUserMenu();
      let data=res.data;
      let arr1=[],arr2=[],arr3=[];
      let tip=-1,flag=-1;
      for(var i=0;i<data.remoteMenu.length;i++){
          // 获取路由列表中对应的一级菜单下标
          let index=this.getIndex(routers,data.remoteMenu[i].title);     
            // 找到了就将此条路由添加到数组;
          if(index!=-1){
            tip++;
            // 此处会将一级菜单的所有子级菜单也添加进去
            arr1.push(routers[index]);
            // 如果该接口数据还有子级菜单
            if(data.remoteMenu[i].children.length!=0){
              arr2=[];
              // 循环接口数据的二级菜单
              for(let j=0;j<data.remoteMenu[i].children.length;j++){
                //获取到二级菜单对应的一级路由下的二级路由的下标 
                let ind=this.getIndex(routers[index].children,data.remoteMenu[i].children[j].title);
                // 没有找到就跳出此次循环
                if(ind!=-1){ 
                  // 找到了就将二级菜单添加到arr2
                  arr2.push(routers[index].children[ind]); 
                  // 如果该接口数据的二级菜单还有三级菜单
                  if(data.remoteMenu[i].children[j].children!=null&&data.remoteMenu[i].children[j].children.length!=0){
                    flag=j;
                    let arr=data.remoteMenu[i].children[j].children;
                    arr3=[];
                        // 循环数据接口的三级菜单
                        for(let k=0;k<arr.length;k++){
                          //    找到接口对应路由的一级菜单下二级菜单下对应的三级菜单的下标
                          let n = this.getIndex(routers[index].children[ind].children,data.remoteMenu[i].children[j].children[k].title);
                          if(n!=-1){                      
                            //  找到了就将三级菜单添加到arr3
                            arr3.push(routers[index].children[ind].children[n])
                          }
                        }
                  }
                }
              }
            }
              // 将arr2赋值给arr1
              arr1[tip].children=arr2;
              if(flag!=-1){
                if(!arr1[tip].children[flag]){
                  location.reload();
                }
                arr1[tip].children[flag].children=arr3;
              }
              flag=-1;
          }
        }
        console.log(arr3,"hahahahahahahhahah");
        await this.$store.dispatch("getUserRoute",arr1);
    },
  },
  watch: {
    $route (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.initMenu();
    this.setTagNavList()
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    // 获取未读消息条数
    // this.getUnreadMessageCount()
  },
  created(){
    this.initMenu();
    
  }
}
</script>
