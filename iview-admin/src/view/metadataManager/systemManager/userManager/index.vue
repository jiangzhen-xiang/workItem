<template>
  <div>
     <Row class="row">
      <i-col>
        <Button type="primary" class="btn" @click="addUser" v-if="isAdmin">新增用户</Button>
        <Form :label-width="10" inline class="form">
          <FormItem>
            <Input type="text" placeholder="登录名" v-model="searchObj.loginName" />
          </FormItem>
          <FormItem>
            <Input type="text" placeholder="姓名" v-model="searchObj.name" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="searchUser">搜索</Button>
          </FormItem>
        </Form>
      </i-col>
    </Row>
    <div class="listShow">
      <Row class="listTitle"><Icon type="md-refresh" class="span" @click="reflesh" /><span class="spanTitle">用户列表</span></Row>
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
            <Button type="primary" size="small" style="margin-right: 5px" @click="updata(index)" v-if="row.rolesReadonly==false">编辑</Button>
            <Button type="error" size="small" @click="remove(index)" style="margin-right: 5px"  v-if="row.rolesReadonly==false">删除</Button>
            <Button type="primary" size="small" @click="watchuser(index)" style="margin-right: 5px"  v-if="row.rolesReadonly==true">查看角色</Button>
            <Button type="primary" size="small" @click="roleAssgin(index)"  v-if="row.rolesReadonly==false">角色分配</Button>
          </div>
          <div v-else>
            <Button type="primary" size="small" style="margin-right: 5px" @click="watchuser(index)">查看角色</Button>
          </div>
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
    <Modal v-model="modal1" :title="tip" footer-hide>
      <newUser
        ref="userEdit"
        :row="editItem"
        @handleCancle="AfterCancle($event)"
        @handleOk="AfterOk($event)"
        @handleAdd="reflesh"
      ></newUser>
    </Modal>
    <Modal v-model="modal2" title="查看角色" footer-hide>
      <watchUser
        ref="userWatch"
        :roleList="roleData"
        @handleCancle="watchCancle($event)">
      </watchUser>
    </Modal>
    <Modal v-model="modal3" title="角色分配" footer-hide>
      <roleAssgin
        ref="roleassgin"
        :roleList="roleData"
        @handleSubmit="assginSubmit($event)"
        @handleCancle="assginCancle($event)"
        >
      </roleAssgin>
    </Modal>
  </div>
</template>

<script>
import {userInfo} from '../../../../api/userManager'
import newUser from './info'
import watchUser from './watch'
import roleAssgin from './assgin'
export default {
  data: function() {

    return {
      tableTitle: [
        {
          title: "用户id",
          key: "userId",
          align: "center",
          Width: 60,
          tooltip: true
        },
        {
          title: "用户登录名",
          key: "userName",
          align: "center",
          Width: 200,
          tooltip: true
        },
        {
          title: "用户姓名",
          key: "fullName",
          align: "center",
          width: 200
        },
        {
          title: "角色",
          key: "roleNamesDisplay",
          align: "center",
          width: 200
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
      modal3:false,
      editItem:[],
      tip:"",
      idx:-1,
      idx1:-1,
      idx2:-1,
      searchObj:{
        loginName:'',
        name,
      },
      roleData:[],
    }
  },
  components:{
    newUser,watchUser,roleAssgin
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
        onOk: async () => {
          //此处调用删除数据接口
          let id=this.tableData[index].userId;
          this.tableData.splice(index, 1);
       //   this.totalNum = res.data.total;
          let res=await userInfo.delUser(id);
          await this.$Message.success(res.data.msg);
          await this.reflesh();
          // userInfo.delUser(id).then(res=>{
          //   // console.log(res);
          //   if(res.status==200){
          //     this.$Message.success(res.data.msg);
          //   }
          // })
        }
      });
    },
    // 修改
    updata(index) {
    //   this.$router.push({
    //     path: "/userManager/userUpdata"
    //   });
    //   localStorage.setItem("userInfo", JSON.stringify(this.tableData[index]));
        this.tip="编辑用户"
        this.idx=index;
        this.editItem=this.tableData[this.idx];
        this.$refs.userEdit.formValidate=this.editItem;
        this.$refs.userEdit.idx=this.idx;
        this.modal1=true;
    },
    // 查看角色
    async watchuser(index){
      let res=await userInfo.assignRole();
      // console.log(res.data,1111);
      this.roleData=res.data;
      this.idx1=index;
      this.$refs.userWatch.idx1=this.idx2;
      this.$refs.userWatch.formValidate=this.tableData[this.idx1];
      this.modal2=true;
    },
    watchCancle(val){
      this[val]=false;
    },
    // 新增用户
    addUser(){
      this.tip="新增用户"
      this.editItem={};
      this.idx=-1;
      this.$refs.userEdit.formValidate={};
      this.$refs.userEdit.idx=this.idx;
      this.modal1=true;
      this.$refs.userEdit.getFocus();
    },
    AfterCancle(val){
      this[val]=false;
    },
    AfterOk(val){
      this[val]=false;
    },
    // 角色分配
    async roleAssgin(index){
      // console.log(this.tableData[index].userId);
      this.$refs.roleassgin.userId= this.tableData[index].userId;
      this.idx2=index;
      this.$refs.roleassgin.idx2=this.idx2;
      this.$refs.roleassgin.formValidate=this.tableData[this.idx2];
      if(this.tableData[this.idx2].roleNamesDisplay){
        this.$refs.roleassgin.formValidate.checkbox=this.tableData[this.idx2].roleNamesDisplay.split(",");
      }
      let res=await userInfo.assignRole();
      this.roleData=res.data;
      // .then(res=>{
      //     // this.$refs.userWatch.role=res.data;
      //     
      // });
      this.modal3=true;
    },

    assginSubmit(val){
      console.log("点击了提交",val);
      this.tableData[this.idx2].roleNamesDisplay=val.checkbox.join(",");
      this.modal3=false;
    },
    
    assginCancle(val){
      this[val]=false;
    },

    reflesh(){
      userInfo.getUserData(this.currentPage,this.pageSize).then(res=>{
        // console.log(res,111111111111111);   
        this.tableData=res.data.list; 
        this.totalNum=res.data.total;
      })
    },

    searchUser(){
      // console.log(this.searchObj); 
      userInfo.searchUserData(this.searchObj.loginName,this.searchObj.name,this.pageSize,this.currentPage).then(res=>{
        // console.log(res);   
        this.tableData=res.data.list; 
        this.totalNum=res.data.total;     
      })      
    }
  },
  // watch:{
  //   // tableData:()=>{
  //   //   console.log("数据更新了");
  //   // },
  //   // totalNum:()=>{
  //   //   console.log("数据更新了");
  //   // }
  // },
  watch:{
   currentPage:function(){
      this.reflesh();
    },
    pageSize:function(){
      this.reflesh();
    }
  },
  mounted() {
    userInfo.getUserData(this.currentPage,this.pageSize).then(res=>{
      // console.log(res,111111111111111);   
      this.tableData=res.data.list; 
      this.totalNum=res.data.total;
    })

    
  },
  created() {
  },
  computed:{
    isAdmin(){
      // console.log(this.$store.state.user.userInfoShow);
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
.span:hover{
  color:rgb(10, 186, 230);
  border:1px solid rgb(10, 186, 230);
}
.spanTitle{
  font-size:14px;
  font-weight:bold;
  color:#000;
}
.fenge{
  width:100%;
  border-top:1px solid #efefef;
}
</style>
