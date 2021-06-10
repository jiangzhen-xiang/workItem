<template>
  <div>
     <Row class="row">
      <i-col>
        <Button type="primary" class="btn" @click="addRole" v-if="isAdmin">新增角色</Button>
      </i-col>
    </Row>
    <div class="listShow">
      <Row class="listTitle"><Icon type="md-refresh" class="span" @click="reflesh" /><span class="spanTitle">角色列表</span></Row>
      <div class="fenge"></div>
      <!-- 
          stripe=>显示斑马纹
          data=>表数据
          columns=>显示表头信息
          height=>表格高度 如果大于此值固定表头
          loading=>表格是否加载中
      -->
      <Table
        stripe
        class="listContent"
        ref="tableName"
        :data="tableData"
        :columns="tableTitle"
      >
        <template slot-scope="{ row, index }" slot="action">
          <div v-if="$store.state.user.userInfoShow.data.authorities[0].authority=='ROLE_系统管理员'">
            <Button type="primary" size="small" style="margin-right: 5px" @click="updata(index)" v-if="row.roleName!='系统管理员'">编辑</Button>
            <Button type="error" size="small" @click="remove(index)" style="margin-right: 5px" v-if="row.roleName!='系统管理员'">删除</Button>
            <Button type="primary" size="small" style="margin-right: 5px" @click="menuApp(index)" v-if="row.roleName!='系统管理员'">菜单授权</Button>
            <Button type="primary" size="small" style="margin-right: 5px" @click="menuWatch(index)" v-if="row.roleName=='系统管理员'">查看菜单</Button>
          </div>
          <div v-else>
            <Button type="primary" size="small" style="margin-right: 5px" @click="menuWatch(index)">查看菜单</Button>
          </div>
          <!-- <Button type="primary" size="small" style="margin-right: 5px">查看接口</Button>
          <Button type="primary" size="small">接口授权</Button> -->
        </template>
      </Table>
      <Page
        show-total
        class="listPage"
        style="text-align:right;margin-top:10px;"
        :total="totalNum"
        :page-size="pageSize"
        :current="currentPage"
        show-elevator
        show-sizer
        @on-change="pageChange"
        @on-page-size-change="onPageSize"
      />
    </div>
    <Modal v-model="modal1" :title="tip" footer-hide  :closable="false" :mask-closable="false">
      <addRole
        ref="roleEdit"
        @handleCancle="AfterCancle($event)"
        @handleOk="AfterOk($event)"
        @handleAdd="reflesh"
      ></addRole>
    </Modal>
    <Modal v-model="modal2" title="查看角色详情" footer-hide>
      <watchRole
        ref="roleWatch"
        @handleCancle="AfterCancle($event)"
      ></watchRole>
    </Modal>
  </div>
</template>

<script>
import { roleInfo } from '../../../../api/roleManager'
import addRole from './info'
import watchRole from './watch'
export default {
  data: function() {
    return {
      tableTitle: [
        {
          title: "角色id",
          key: "roleId",
          align: "center",
          Width: 60,
          tooltip: true
        },
        {
          title: "角色名",
          key: "roleName",
          align: "center",
          Width: 200,
          tooltip: true
        },
        {
          title: "角色描述",
          key: "roleDesc",
          Width: 200,
          align: "center",
          tooltip: true
        },
        {
          title: "角色类型",
          key: "roleType",
          width: 200,
          align: "center",
          render: (h, params) => {
                return h('div', [
                  h('span', this.roleCate[params.row.roleType-1])
                ]);
            }
          },
        {
          title: "操作",
          slot: "action",
          align: "center",
          fixed: "right",
          minwidth: 250
        }
      ],
      tableData: [],
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
      modal1:false,
      modal2:false,
      idx:-1,
      idx1:-1,
      tip:"",
      roleCate:["系统管理员","业务管理员","普通用户"]
    }
  },
  components:{
    addRole,watchRole
  },
  methods: {
    pageChange(index) {
      // console.log(index);
      this.currentPage = index;
    },

    onPageSize(index) {
      this.pageSize = index;
    },
    // 删除
    remove(index) {
      this.$Modal.confirm({
        title: "消息提示",
        closable: true,
        content: "删除该数据后将不可恢复，是否删除?",
        onOk:async () => {
          //此处调用删除数据接口
          let id=this.tableData[index].roleId;
          this.tableData.splice(index, 1);
        //  this.totalNum = res.data.total;
          let res=await roleInfo.delRole(id);
          await this.$Message.success(res.data.msg);
          // roleInfo.delRole(id).then(res=>{
          //   if(res.status==200){
          //     this.$Message.success(res.data.msg);
          //   }
          // })
          await this.reflesh();
        }
      });
    },
    // 修改
    updata(index) {
    //   this.$router.push({
    //     path: "/userManager/userUpdata"
    //   });
        this.tip="编辑角色";
        this.idx=index;
        this.editItem=this.tableData[this.idx];
        this.$refs.roleEdit.formValidate=this.editItem;
        this.$refs.roleEdit.idx=this.idx;
        this.modal1=true;
        // console.log(this.tableData[this.idx]);
        
    },
    addRole(){
      this.tip="新增角色";
      this.$refs.roleEdit.idx=-1;
      this.$refs.roleEdit.getFocus();
      this.modal1=true;
    },
    AfterCancle(val){
      this[val]=false;
    },

    async AfterOk(val){
      this[val]=false;
    },
    // 菜单授权 
    menuApp(index){
      // console.log(this.tableData[index]);
      let id=this.tableData[index].roleId;
      // console.log(id);
      this.setSessionStorage(index);
      this.$router.push({
        path:"/systemManager/menuApply/id="+id,
      })
    },
    // 查看菜单
    menuWatch(index){
      let id=this.tableData[index].roleId;
      // console.log(id);
      this.setSessionStorage(index,"watch");
      this.$router.push({
        path:"/systemManager/menuApply/id="+id,
      })
    },
    // watchDetail(index){
    //   this.modal2=true;
    //   this.idx1=index;
    //   this.editItem=this.tableData[this.idx1];
    //   this.$refs.roleWatch.formValidate=this.editItem;
    //   this.setSessionStorage(index);
    //   this.$router.push({
    //     path:"/systemManager/menuApply/id=1"
    //   })
    // },
    // menuAuthorize(index) {
    //   this.setSessionStorage(index);
    //   this.$router.push({
    //     name: 'menu_authorize_index'
    //   });
    // },
    // functionAuthorize(index) {
    //   this.setSessionStorage(index);
    //   this.$router.push({
    //     name: 'function_authorize_index'
    //   });
    // },
    setSessionStorage(index,d){
      sessionStorage.setItem("authorizeRoleName",this.tableData[index]["roleName"]);
      sessionStorage.setItem("authorizeRoleId",this.tableData[index]["roleId"]);
      if(d=="watch"){
        sessionStorage.setItem("permsReadonly",true);
      }else{
        sessionStorage.setItem("permsReadonly",this.tableData[index]["permsReadonly"]);
      }   
    },

    reflesh(){
      roleInfo.getRoleData({page:this.currentPage,size:this.pageSize}).then(res=>{
        // console.log(res,111111111111111);   
        this.tableData=res.data.list; 
        this.totalNum=res.data.total;
      })
    }
  },
  watch:{
   currentPage:function(){
      this.reflesh();
    },
    pageSize:function(){
      this.reflesh();
    }
  },
  mounted() {
    this.reflesh();
  },
  computed:{
    isAdmin(){
      if(this.$store.state.user.userInfoShow){
        if(this.$store.state.user.userInfoShow.data.roleIds[0]=="1")
        return true;
      }else{
        return false;
      } 
    }
  }
}
</script>
<style lang='less' scoped>
.row{
  margin:10px 0;
  background-color:#fff;
  padding:10px 20px 0;
  height:52px;
}
.btn{
  float:left;
}
.form{
  float: right;
}
.listShow{
  background-color:#fff;
}
.listTitle,.listContent,.listPage{
  margin:10px 20px;
}
.listTitle{
  padding-top:10px;
}
.span{
  width:25px;
  height:25px;
  font-size:20px;
  border-radius: 50%;
  background-color: #efefef;
  text-align: center;
  line-height: 25px;
  margin-right:10px;
  cursor: pointer;
}
.spanTitle{
  font-size:14px;
  font-weight:bold;
  color:#000;
}
.span:hover{
  color:rgb(10, 186, 230);
  border:1px solid rgb(10, 186, 230);
}
.fenge{
  width:100%;
  border-top:1px solid #efefef;
}
</style>

