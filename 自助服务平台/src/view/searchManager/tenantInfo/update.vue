<template>
    <div class="checkCon">
        <Row>
            <i-col>
                <Form :label-width="150" :rules="ruleValidate" ref="formValidate" :model="formValidate">
                    <div style="width:100%;
                    height:530px;overflow:auto;">
                    <div v-if="idx!=-1" key="noprops" >
                      <FormItem label="用户类型:" >
                        <Input type="text" v-model="formValidate.tenantType" />
                      </FormItem>
                      <FormItem label="用户名称:" prop="tenantUser">
                        <Input type="text" v-model="formValidate.tenantUser" />
                      </FormItem>
                      <FormItem label="系统简称:" >
                        <Input type="text"  v-model="formValidate.sysName" />
                      </FormItem>
                      <FormItem label="系统中文名:" >
                        <Input type="text"  v-model="formValidate.syschName" />
                      </FormItem>
                    </div>
                    <div v-else key="hasprops" >
                      <FormItem label="用户类型:" prop="tenantType">
                        <Input type="text" v-model="formValidate.tenantType" />
                      </FormItem>
                      <FormItem label="用户名称:" prop="tenantUser">
                        <Input type="text" v-model="formValidate.tenantUser" />
                      </FormItem>
                      <FormItem label="系统简称:"  prop="sysName">
                        <Input type="text"  v-model="formValidate.sysName" />
                      </FormItem>
                      <FormItem label="系统中文名:" prop="syschName" >
                        <Input type="text"  v-model="formValidate.syschName" />
                      </FormItem>
                    </div>
                    <FormItem label="项目负责人"  prop="proManager">
                      <Input type="text"  v-model="formValidate.proManager" />
                    </FormItem>
                    <FormItem label="项目负责人电话:"  prop="proManagerTel">
                      <Input type="text" v-model="formValidate.proManagerTel" />
                    </FormItem>
                    <FormItem label="项目负责人邮箱:" prop="proManagerMail">
                      <Input type="text"  v-model="formValidate.proManagerMail" />
                    </FormItem>
                    <FormItem label="应用管理员:" prop="appManager" >
                      <Input type="text" v-model="formValidate.appManager" />
                    </FormItem>
                    <FormItem label="系统管理员"  prop="sysManager">
                      <Input type="text"  v-model="formValidate.sysManager" />
                    </FormItem>
                    <FormItem label="接口负责人:"  prop="interfaceManager">
                      <Input type="text" v-model="formValidate.interfaceManager" />
                    </FormItem>
                    <FormItem label="接口负责人电话:"  prop="interfaceManagerTel">
                      <Input type="text"  v-model="formValidate.interfaceManagerTel" />
                    </FormItem>
                    </div>
                    <div style="height:30px;width:100%;">
                      <FormItem class="btn2">
                        <Button type="primary" @click="cancel">取消</Button>
                        <Button type="primary" @click="confirm">确定</Button>
                      </FormItem>
                    </div>
                </Form>
            </i-col>
        </Row>
  </div>
</template>
<script>
import ajaxTenantInfo from '@/api/tenantInfo.js'
export default {
  data: function() {
    return {
        formValidate:{},
        ruleValidate: {
            tenantType: [
                {
                    required: true,
                    message: '用户类型不能为空',
                    trigger: 'blur'
                }
            ],
            tenantUser: [
                {
                    required: true,
                    message: '用户名称不能为空',
                    trigger: 'blur'
                }
            ],
            sysName: [
                { required: true, 
                  message: '系统简称不能为空', 
                  trigger: 'blur' 
                }
            ],
            syschName: [
                { required: true, 
                  message: '系统中文名不能为空', 
                  trigger: 'blur' 
                }
            ],
            proManager: [
                // { required: true, 
                //   message: '请输入项目负责人', 
                //   trigger: 'blur' 
                // }
            ],           
            proManagerTel: [
                {
                  // required: true,
                  // type:'string',
                  // pattern:/^1[3-9]\d{9}$/,
                  // message:'请输入正确的电话格式',
                  // trigger:'blur',
                }
            ],
            proManagerMail: [
                {
                  // required: true,
                  // type:'string',
                  // pattern:/^[0-9A-Za-z_\.]{1,20}@[0-9A-Za-z]{2,10}(\.((com)|(cn)|(gov)|(edu)))+$/,
                  // message:'请输入正确的邮箱格式',
                  // trigger:'blur',
                }
            ],           
            appManager: [
                { 
                  // required: true, 
                  // message: '请输入应用管理员', 
                  // trigger: 'blur' 
                }
            ],
            sysManager: [
                // { 
                //   required: true, 
                //   message: '请输入系统管理员', 
                //   trigger: 'blur' 
                // }
            ],           
            interfaceManager: [
                // { required: true, 
                //   message: '请输入接口负责人', 
                //   trigger: 'blur' 
                // }
            ],
            interfaceManagerTel: [
                {
                  // required: true,
                  // type:'string',
                  // pattern:/^1[3-9]\d{9}$/,
                  // message:'请输入正确的电话格式',
                  // trigger:'blur',
                }
            ],
            // createYear: [
            //     { 
            //       required: true, 
            //       type:'date',
            //       message: '请输入创建年份', 
            //       trigger:'blur'
            //     }
            // ]
        },
        idx:-1,
        modal:false,
    }
  },
  methods: {
    // 确定
    async confirm(){
      let obj=JSON.parse(JSON.stringify(this.formValidate));
        if(this.idx!=-1){// 编辑确定
            console.log("编辑确定");
            this.$refs.formValidate.validate(async validate=>{
                if(validate){
                    console.log(obj);
                    let res= await ajaxTenantInfo.updateTenantUser(obj);
                    if(res.data.code==1){
                      await this.$Message.success(res.data.message);
                      await this.$emit('handleType');
                      await this.$emit("handleUpdate");
                      await this.$refs.formValidate.resetFields();
                    }else{
                      alert("数据验证失败");
                    }
                    await this.$emit("handleOk","modal1");
                }
            })
        }else{ // 新增确定
            console.log("新增确定");
            obj.createYear=Number(new Date().getFullYear());
            console.log(obj,this.formValidate);
            this.$refs.formValidate.validate(async validate => {
                if(validate){
                  console.log(111);
                  await this.addConfirm(obj);
                }
            })
        }
    },
    async addConfirm(obj){
        let res=await ajaxTenantInfo.addTenantUser(obj);
        if(res.data.code==1){
          await this.$Message.success(res.data.message);
          await this.$emit('handleType');
          await this.$emit("handleUpdate");
          await this.$refs.formValidate.resetFields(); 
        }else{
          await this.$Message.error(res.data.message);
        }
        await this.$emit("handleOk","modal2");
    },
    // 取消
    async cancel(){
      if(this.idx!=-1){
        console.log("点击编辑取消");
        await this.$emit("handleUpdate");
      }else{
        console.log("点击新增取消");            
      }
      await this.$refs.formValidate.resetFields();
      await this.$emit("handleCancle","modal2");
    },
  },
  created() {},
}
</script>

<style lang='less' scoped>
.btn2{
    position:absolute;
    right:-10px;
    bottom:-50px;
}
</style>
