<template>
  <div>
       <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="80"
      class="form"
    >
      <FormItem label="角色名称:" prop="roleName">
                <Input v-model="formValidate.roleName" ref="rname" />
      </FormItem>
      <FormItem label="角色描述:" prop="roleDesc">
                <Input v-model="formValidate.roleDesc" />
      </FormItem>
      <FormItem v-if="idx==-1" key="hasprop" label="上级角色:" prop="pRoleId">
            <Select v-model="formValidate.pRoleId" >
                <Option value="1" key="hasprop1">系统管理员</Option>
            </Select>
      </FormItem>
      <FormItem v-else key='noProp' label="上级角色:">
            <Select v-model="formValidate.pRoleId" disabled >
                <Option :value="1" key="noprop1">系统管理员</Option>
            </Select>
      </FormItem>
      <FormItem label="角色类型:" prop="roleType">
            <Select v-model="formValidate.roleType">
                <Option value="2">业务管理员</Option>
            </Select>
      </FormItem>
      <FormItem style="text-align: right; padding-top: 10px">
                <Button type="default" @click="cancel" style="margin-right: 5px">取消</Button>
                <Button type="primary" @click="ok" style="margin-right: 5px">{{ (idx==-1)?"确定":"提交" }}</Button>
      </FormItem>

    </Form>
  </div>
</template>

<script>
import { roleInfo } from '@/api/roleManager';
export default {
  data: function() {
    return {
        ruleValidate: {
            roleName: [
                {
                    required: true,
                    message: '名称不能为空',
                    trigger: 'blur'
                }
            ],
            roleDesc: [
                {
                    required: true,
                    message: '请输入角色描述',
                    trigger: 'blur'
                }
            ],
            pRoleId: [
                { 
                  required: true, 
                  message: '请选择上级角色', 
                  trigger: 'blur' 
                }
            ],
            roleType: [
                { 
                  required: true, 
                  message: '请选择角色类型', 
                  trigger: 'blur' 
                }
            ]
        },
        formValidate:{
          roleName:'',
          roleDesc:'',
          pRoleId:'',
          roleType:'',
        },
        idx:-1,
        tip:"",
    }
  },
  methods: {
      async cancel(){
          if(this.idx!=-1){
              console.log("点击编辑取消");
              await this.$emit("handleAdd");
          }else{
              console.log("点击新增取消");            
          }
          this.$emit("handleCancle","modal1");
          this.formValidate={};
      },
      ok() {
          if(this.idx!=-1){
              // console.log("点击编辑确定");
              let obj={
                      roleName:this.formValidate.roleName,
                      roleDesc:this.formValidate.roleDesc,
                      pRoleId:this.formValidate.pRoleId,
                      roleType:this.formValidate.roleType,
                      roleId:this.formValidate.roleId
                    };

              this.$refs.formValidate.validate(validate => {
                if (validate) {
                  // console.log("hawu",obj);
                  
                  roleInfo.updateRole(obj).then(res=>{
                    if(res.status==200){
                      this.$Message.success(res.data.msg);
                      this.formValidate={};
                    }
                  })    
                }else{
                  alert("数据验证失败");
                }
                this.$emit("handleOk","modal1");
              })
          }else{
              console.log("点击新增确定",this.formValidate); 
              console.log(this.$refs.formValidate,this.formValidate)
              let obj=this.formValidate;
              this.$refs.formValidate.validate(validate => {
                if(validate){
                  this.addConfirm(obj);
                  this.formValidate={};
                }
                // if (validate) {
                //   roleInfo.addRole(obj) .then(res=>{
                //     // console.log(res);
                //     if(res.status==200){
                //       this.$Message.success(res.data.msg);
                //     }
                //   })    
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
          //       }
              })
          }
          
          // this.$emit("handleAdd");
          // this.$emit("handleOk","modal1");
    },
    async addConfirm(obj){
      try{
        let res=await roleInfo.addRole(obj);
        await this.$Message.success(res.data.msg);
        await this.$emit("handleAdd");
        await this.$emit("handleOk","modal1");
      }catch(e){
        await this.$Message.error("角色名重复，请修改！");
      }
    },
    getFocus(){
      this.$nextTick(function(){
        this.$refs.rname.focus();
      })
    },
    // getRuleValidate(idx){
    //   // if(idx<)
    //   if(idx==-1){
    //     this.ruleValidate=this.ruleValidate2;
    //   }else{
    //     this.ruleValidate=this.ruleValidate1;
    //   }
    // }
  },
  watch:{
    // idx:function(newVal){
    //  this.getRuleValidate(newVal);
    // }
  },
  computed:{
    // ruleValidate:function(){
    //   if(this.idx==-1){
    //     return this.ruleValidate2;
    //   }else{
    //     return this.ruleValidate1;
    //   }
    // }
  },
  mounted() {
  },
  created() {}
}
</script>

<style lang='less' scoped>
.form{
    margin-left:30px;
}
</style>
