<template>
  <div>
       <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="100"
      class="form"
    >
      <FormItem v-if="idx!=-1" key="noprop" label="用户登录名:">
                <Input v-model="formValidate.userName"  disabled />
      </FormItem>
      <FormItem v-else label="用户登录名:" prop="userName">
                <Input v-model="formValidate.userName" placeholder="请输入5-15个字符" ref="uname"/>
      </FormItem>
      <FormItem label="用户姓名:" prop="fullName">
               <Input v-model="formValidate.fullName"  placeholder="请输入用户姓名" />   
      </FormItem>
      <FormItem style="text-align: right; padding-top: 10px">
                <Button type="default" @click="cancel" style="margin-right: 5px">取消</Button>
                <Button type="primary" @click="ok" style="margin-right: 5px">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import {userInfo} from '../../../../api/userManager'
export default {
  data: function() {
    return {
        ruleValidate: {
            userName: [
                {
                    required: true,
                    message: '用户登录名不能为空',
                    trigger: 'blur'
                },
                {
                  min:5,
                  message: '请至少输入5个字符',
                  trigger: 'blur'
                },
                {
                  max: 15,
                  message: '最多输入15个字符',
                  trigger: 'blur'
                },
            ],
            fullName: [
                {
                    required: true,
                    message: '用户姓名不能为空',
                    trigger: 'blur'
                }
            ]
        },
        formValidate:{},
        idx:-1,
    }
  },
  methods: {
      // handleAdd(){
      //           this.$emit("handleAdd")
      //       },
      cancel(){
          if(this.idx!=-1){
              console.log("点击编辑取消");
          }else{
              console.log("点击新增取消");            
          }
          this.$emit("handleCancle","modal1");
      },
      ok() {
          if(this.idx!=-1){
              console.log("点击编辑确定");
              this.$refs.formValidate.validate(validate => {
                if (validate) {
                  userInfo.editUserData({"fullName":this.formValidate.fullName,"userId":this.formValidate.userId}).then(res=>{
                    // console.log(res,"uuuuuuuuuu"); 
                    if(res.status==200){
                      this.$Message.success(res.data.msg)
                    }           
                  })
                //   ajaxEditorOrderMeta(this.formValidate).then(res => {
                //     if (res.data.status == '1') {
                //       this.$Message.success('编辑成功')
                //       this.handleReset('formValidate')
                //       this.$emit('handleSuccess', postData)
                //     } else {
                //       this.$Message.error(res.data.message || '编辑成功')
                //     }
                //   })
                // alert("okokokokokokokokokokokokkokook");
                this.$emit("handleOk","modal1");
                }
              })

          }else{
            this.$refs.formValidate.validate(validate => {
              if(validate){
                this.addConfirm();
              }
            })
            // console.log(this.formValidate);
            // userInfo.addNewUser({
            //   "creator": 1,
            //   "dataState": "1",
            //   "fullName": this.formValidate.fullName,
            //   "userName": this.formValidate.userName,
            // }).then(res=>{
            //   // console.log(res);
            //   this.$Message.success(res.data.msg)
            // })
            //   this.$emit("handleAdd");
            //   this.$emit("handleOk","modal1");
            // console.log("点击新增确定");            
          }
    },
    async addConfirm(){
      try{
        let res=await userInfo.addNewUser({
                  "creator": 1,
                  "dataState": "1",
                  "fullName": this.formValidate.fullName,
                  "userName": this.formValidate.userName,
                });
        await this.$Message.success(res.data.msg);
        await this.$emit("handleAdd");
        await this.$emit("handleOk","modal1");
      }catch(e){
          await this.$Message.error("用户登录名重复，请修改！");
      }     
    },
    getFocus(){
      this.$nextTick(function(){
        this.$refs.uname.focus();
      })
    }
  },
  mounted() {

  },
  created() {
    console.log(1111111);
    
  }
}
</script>

<style lang='less' scoped>
.form{
    margin-left:30px;
}
</style>
