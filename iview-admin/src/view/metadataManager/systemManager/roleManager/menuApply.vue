<template>
  <div>
    <Card>
        <Button type="primary" @click="backRoleList">返回角色列表</Button>
    </Card>
  <Card class="margin-top-10">
    <p slot="title">
      <Icon type="navicon-round"></Icon>
      {{permsReadonly?'查看':''}}菜单授权 （ {{roleName}} ）
    </p>
    <Tree v-model="classificationSelected" :render="renderContent" :data="classificationList" @on-check-change="setClassificationInAll" show-checkbox ></Tree>
    <Spin v-if="spinShow">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在加载。。。</div>
    </Spin>
    <Button v-show="!permsReadonly" type="primary" :loading="loading" @click="commit" :disabled="disable">
        <span v-if="!loading">保存</span>
        <span v-else>正在保存</span>
    </Button>
  </Card>
  </div>
</template>

<script>
import { roleInfo } from '@/api/roleManager';
export default {
  data: function() {
    return {
      classificationList: [], //所有目录
      classificationSelected: [], // 在所有分类目录中选中的目录数组   :check-directly="true" 
      roles: [],
      nodeStrArray: "",   //选中的节点数组字符串
      loading: false,
      spinShow: false,
      disable: true
    }
  },
  computed: {
    roleName (){
      return sessionStorage.getItem("authorizeRoleName") || "";
    },
    authorizeRoleId() {
      return sessionStorage.getItem("authorizeRoleId");
    },
    permsReadonly(){
      return sessionStorage.getItem("permsReadonly") === 'true';
    }
  },
  methods: {
    init() {
      this.spinShow = true;
      // let roleId=this.$store.state.user.userInfoShow.data.roles[0].roleId;
      roleInfo.getRoleMenu(this.authorizeRoleId).then(res=>{
        // console.log(res.data,"eeeeeeee");        
        this.spinShow = false;
        this.classificationList = res.data;
        // this.recursion(this.classificationList);
      })
      // this.$http.get("v1/resource/listResTree?roleId=" + this.roleId).then((response) => {
      //   this.spinShow = false;
      //   this.classificationList = response.data;
      //   this.recursion(this.classificationList);
      // }, (response) => {
      //   this.spinShow = false;
      //   this.$Message.error(response.data.msg);
      // });　　　
    },
    recursion(obj){
      obj.forEach((item)=>{
        item.disabled = this.permsReadonly;
        if(item.children && item.children.length){
          this.recursion(item.children);
        }
      })
    },
    renderContent(h, {
      root,
      node,
      data
    }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }, [
        h('span', [
          h('span', data.title)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            marginLeft: '40px',
            color: '#999'
          }
        }, data.restURL)
      ]);
    },
    setClassificationInAll(selectedArray) {
      // console.log(selectedArray,"hhhhhhhh");
      this.classificationFinalSelected = selectedArray.map(item => {
        return item.id;
      });
      this.disable = false;
    },
    setClassificationInOffen(selectedArray) {
      this.classificationFinalSelected = selectedArray.map(item => {
        return item.id;
      });
      this.disable = false;
    },
    commit() {
      // 选中菜单的id
      let str = JSON.stringify(this.classificationFinalSelected);
      let s = str.substring(1, str.length - 1);
      this.nodeStrArray = s;
      if (s.length < 1) {
        this.$Modal.confirm({
          title: '确认清空',
          content: '<p>您没有勾选任何内容，是否要执行清空操作？</p>',
          onOk: () => {
            this.post();
          },
          onCancel: () => {

          }
        });
      } else {
        this.post();
      }
    },
    post(){
      let str = JSON.stringify(this.classificationFinalSelected);
      let s = str.substring(1, str.length - 1);
      this.nodeStrArray = s;
      var _this = this;
      this.$store.roleNodeArrayStr = s;
      this.loading = true;
      roleInfo.submitMenu({
        "privilege": this.nodeStrArray,
        "roleId": this.authorizeRoleId,
        "updateType": 1
      }).then(res=>{
        // console.log(res);
        if(res.status==200){
          this.$Message.success(res.data.msg);
          this.loading = false;
          this.disable = true;
        }else{
          this.$Message.error(response.data.msg);
          this.loading = false;
          this.disable = true;
        }        
      })
      // this.$http.post("v1/privilege/allocationPrivilege", {
      //   "privilege": this.nodeStrArray,
      //   "roleId": this.roleId,
      //   "updateType": 1
      // }).then((response) => {
      //   this.$Message.success(response.data.msg);
      //   this.loading = false;
      //   this.disable = true;
      // }, (response) => {
      //   this.$Message.error(response.data.msg);
      //   this.loading = false;
      //   this.disable = true;
      // });
    },
    backRoleList() {
      this.$router.push({
        name: 'roleManager'
      });
    }
  },
  mounted() {
  },
  created() {
    this.init();
  },
}
</script>

<style lang='less' scoped>
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
.margin-top-10{
    margin-top: 10px;
}
</style>
