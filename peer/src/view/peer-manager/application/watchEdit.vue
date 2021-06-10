<template>
  <div>
    <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="100"
      class="form"
    >
      <FormItem label="申请单名称" prop="userName">
                <Input v-model="formValidate.userName" v-if="idx!=-1" disabled />
                <Input v-model="formValidate.userName" v-else />
      </FormItem>
      <FormItem label="租户" prop="fullName">
               <Input v-model="formValidate.fullName" />   
      </FormItem>
      <FormItem label="联系方式" prop="userName">
                <Input v-model="formValidate.userName" v-if="idx!=-1" disabled />
                <Input v-model="formValidate.userName" v-else />
      </FormItem>
      <FormItem label="申请人" prop="fullName">
               <Input v-model="formValidate.fullName" />   
      </FormItem>
      <FormItem label="申请时间" prop="userName">
            <DatePicker type="datetime" placeholder="请选择日期时间" format="yyyy-MM-dd HH:mm" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="状态" prop="fullName">
            <Switch size="large" on-change="getStatus">
                <span slot="open">执行成功</span>
                <span slot="close">执行失败</span>
            </Switch>
      </FormItem>
      <FormItem style="text-align: right; padding-top: 10px">
                <Button type="default" @click="cancel" style="margin-right: 5px">取消</Button>
                <Button type="primary" @click="ok" style="margin-right: 5px">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
        ruleValidate: {
            userName: [
                {
                    required: true,
                    message: '用户登录名不能为空',
                    trigger: 'blur'
                }
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
    cancel(){
        if(this.idx!=-1){
            console.log("点击编辑取消");
        }else{
            console.log("点击查看取消");            
        }
        this.$emit("handleCancle","modal2");
    },
    ok(){
        if(this.idx!=-1){
            console.log("点击编辑确定");
            this.$refs.formValidate.validate(validate => {
                if (validate){
                    // userInfo.editUserData({"fullName":this.formValidate.fullName,"userId":this.formValidate.userId}).then(res=>{
                        // // console.log(res,"uuuuuuuuuu"); 
                        // if(res.status==200){
                        //   this.$Message.success(res.data.msg)
                        // }           
                    // })
                    this.$emit("handleOk","modal2");
                }
              })
        }else{          
            this.$emit("handleOk","modal2");
            console.log("点击查看确定");            
        }
    },
    getStatus(status){
        console.log(status);        
    }
  },
  mounted() {},
  created() {}
}
</script>

<style lang='less' scoped>
</style>
