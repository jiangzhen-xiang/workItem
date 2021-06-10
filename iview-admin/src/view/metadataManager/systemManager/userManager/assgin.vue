<template>
  <div>
    <Form
      ref="formValidate"
      :model="formValidate"
      :label-width="80"
      class="form"
    >
        <FormItem label="角色">
          <CheckboxGroup v-model="formValidate.checkbox" >
              <Checkbox v-for="(item,index) in roleList" :label="item.name" :key="index" :disabled="item.disabled"></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem style="text-align: right; padding-top: 10px">
                  <Button type="default" @click="submit" style="margin-right: 5px">提交</Button>
                  <Button type="default" @click="cancel" style="margin-right: 5px">取消</Button>
        </FormItem>
    </Form>
  </div>
</template>

<script>
import { userInfo } from '@/api/userManager'
export default {
  props:['roleList'],
  data: function() {
    return {
        formValidate:{},
        userId:0,
    }
  },
  methods: {
      cancel(){
          this.$emit("handleCancle","modal3");
      },
      submit(){
          let roleIds=[];
          this.$emit("handleSubmit",this.formValidate);
          this.formValidate.checkbox.forEach(item=>{
            this.roleList.forEach(val=>{
                if(item==val.name){
                  roleIds.push(val.value);
                }
            })
          });
          userInfo.roleAssign({roleIds,userId:this.userId}).then(res=>{
            // console.log(res);    
            if(res.status==200){
              this.$Message.success(res.data.msg)
            }        
          })
      },
  },

}
</script>
<style lang='less' scoped>
</style>
