<template>
  <div class="user-avatar-dropdown">
    <Dropdown transfer trigger="click" @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvatar" />
      </Badge>
      <span>{{ userName }}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <!-- <DropdownItem name="message">
          消息中心 -->
          <!-- <Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge> -->
        <!-- </DropdownItem> -->
        <DropdownItem name="modifyPassword">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
    <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
    <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
      <FormItem label="原密码" prop="oldPassword" :error="oldPassError">
        <Input v-model="editPasswordForm.oldPassword" type="password" placeholder="请输入现在使用的密码"></Input>
      </FormItem>
      <FormItem label="新密码" prop="newPassword">
        <Input v-model="editPasswordForm.newPassword"  type="password" placeholder="请输入新密码，至少6位"></Input>
      </FormItem>
      <FormItem label="确认新密码" prop="rePassword">
        <Input v-model="editPasswordForm.rePassword"  type="password" placeholder="请再次输入新密码"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="cancelEditPass">取消</Button>
      <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
    </div>
  </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { resetPassword } from '@/api/user.js'
let Base64 = require('js-base64').Base64;
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      // type: Number,
      default: 0
    }
  },
  data(){
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPassword) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    // const valideOldPassword = (rule,value,callback) =>{
    //   if (Cookies.get('password') && crypto.createHash('sha256').update(value).digest('base64') !== Cookies.get('password')) {
    //     callback(new Error('原密码错误'));
    //   } else {
    //     callback();
    //   }
    // };
    const valideNewPassword = (rule,value,callback) =>{
      
      if (this.editPasswordForm.oldPassword === this.editPasswordForm.newPassword) {
        callback(new Error('密码和原密码相同'));
      } else {
        callback();
        // 匹配到数字
        // let n=0;
        // if(/\d/g.test(this.editPasswordForm.newPassword))n++;
        // if(/[a-z]/g.test(this.editPasswordForm.newPassword))n++;
        // if(/[A-Z]/g.test(this.editPasswordForm.newPassword))n++;
        // if(/((?=[\x21-\x7e]+)[^A-Za-z0-9])/g.test(this.editPasswordForm.newPassword))n++;
        // if(n==4){
        //   callback();
        // }else{
        //   callback(new Error('请输入由大小写字母、数字和特殊字符组成的密码'));
        // }
      }
    }
    return{
      editPasswordModal: false,
      editPasswordForm: {
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      },
      oldPassError: '',
      savePassLoading: false,
      passwordValidate: {
        oldPassword: [{
          required: true,
          message: '请输入原密码',
          trigger: 'blur'
        }],
        newPassword: [{
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
          {
            min: 6,
            message: '请至少输入6个字符',
            trigger: 'blur'
          },
          {
            max: 30,
            message: '最多输入30个字符',
            trigger: 'blur'
          },
          {
            validator: valideNewPassword,
            trigger: 'blur'
          }
        ],
        rePassword: [{
            required: true,
            message: '请再次输入新密码',
            trigger: 'blur'
          },
          {
            validator: valideRePassword,
            trigger: 'blur'
          }
        ]
      },
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    // 处理注销登录
    logout() {
      this.handleLogOut().then((res) => {
        this.$Message.info(res.data.msg);
        this.$router.push({
          name: 'login'
        })
      })
    },
    message() {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick(name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
        case 'modifyPassword': this.editPasswordModal = true;
      }
    },
    cancelEditPass() {
      this.editPasswordForm={
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      },
      this.editPasswordModal = false;
    },
    saveEditPass() {
      this.$refs.editPasswordForm.validate((valid) => {
        if (valid) {
          // console.log("验证成功");
          let newPassword =Base64.encode(this.editPasswordForm.newPassword);
          let oldPassword =Base64.encode(this.editPasswordForm.oldPassword);
          resetPassword({newPassword,oldPassword}).then(res=>{
            // console.log(res); 
            if(res.status==200){
              this.$Message.success(res.data.msg);
              this.editPasswordModal = false; 
            }
          }).catch(error=>{
            this.$Message.error(error.response.data.msg);
          })
          this.editPasswordForm={
                oldPassword: '',
                newPassword: '',
                rePassword: ''
          };
          
          


          // this.$http.put("/user/updatePasswd?oldPassword="+oldPassword+"&newPassword="+newPassword).then(res=>{
          //   console.log(res);
          // })

          // this.$http.put("/v1/index/updatePasswd?oldPassword="+oldPassword+"&newPassword="+newPassword).then((response) => {
          //   this.editPasswordModal = false;
          //   this.editPasswordForm = {};
          //   // Cookies.set('password', newPassword)
          //   this.$Message.success(response.data.msg);
          // }, (response) => {
          //   this.$Message.error(response.data.msg || response.data.message);
          // });
          // console.log(newPassword,oldPassword);
          
        }
      });
    }
  },
  mounted() {
  },
  computed:{
    userName(){
      console.log(this.$store.state.user.userInfoShow);
      if(this.$store.state.user.userInfoShow!=""){
        return this.$store.state.user.userInfoShow.data.fullname;
      }else{
        return "";
      } 
    }
  }
}
</script>
