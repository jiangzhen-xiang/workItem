<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { aa } from '@/api/user'
import {userInfo} from '@/api/userManager'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    async handleSubmit ({ userName, password }) {
      // let that=this;
      // await setTimeout(function(){
      //   console.log(22222);
      // },5000)
      // // await this.$router.go(0);
      
      let res=await this.handleLogin({ userName, password });
      if(res.data.code!=1000){
          await this.$Message.error(res.data.msg);
          return;
      }else{
          await this.$Message.success(res.data.msg);
          // 获取用户信息          
          // this.$router.push({
          //   name: this.$config.homeName
          // })
      }
      let req = await userInfo.addUser();
      if(req.data.status=="ok"){
        await this.$store.dispatch('getUserInfoShow',req.data);
      }
      await this.$router.push({
            name: this.$config.homeName
      });
      // this.handleLogin({ userName, password }).then(res => {
      //   // console.log(res,1111111111111111111111111111);
      //   if(res.data.code!=1000){
      //     this.$Message.error(res.data.msg);
      //     return;
      //   }else{
      //     this.$Message.success(res.data.msg);
      //     // 获取用户信息          
      //     this.$router.push({
      //       name: this.$config.homeName
      //     })
      //   }
      //   userInfo.addUser().then(res=>{
      //       if(res.data.status=="ok"){
      //         this.$store.dispatch('getUserInfoShow',res.data)
      //         // console.log(this.$store.state.user.userInfoShow,"vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv"); 
      //       }
      //   })
        
      //   // this.getUserInfo().then(res => {
      //   //   this.$router.push({
      //   //     name: this.$config.homeName
      //   //   })
      //   // })
      // })
    }
  },
  mounted() {

  },
  created() {
    if(location.href.indexOf('#reloaded')==-1){
      location.href=location.href+"#reloaded";
      location.reload();
    }
  },
}
</script>

<style>
</style>
