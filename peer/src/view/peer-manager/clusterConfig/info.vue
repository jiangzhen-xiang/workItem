<template>
    <div class="checkCon">
        <Row>
            <i-col>
                <Form :label-width="150" :rules="ruleValidate" ref="formValidate" :model="formValidate">
                    <FormItem v-if="idx!=-1" key='noProp' label="集群标识:" >
                      <Input type="text" v-model="formValidate.clusterCode" disabled />
                    </FormItem>
                    <FormItem v-else label="集群标识:" prop="clusterCode">
                      <Input type="text" v-model="formValidate.clusterCode" />
                    </FormItem>
                    <FormItem label="集群名称:"  prop="clusterName">
                      <Input type="text"  v-model="formValidate.clusterName" />
                    </FormItem>
                    <FormItem label="集群描述:" >
                      <Input type="text"  v-model="formValidate.clusterDesc" />
                    </FormItem>
                    <FormItem label="hbase账户:"  prop="hbaseUser">
                      <Input type="text"  v-model="formValidate.hbaseUser" />
                    </FormItem>
                    <FormItem label="hbase密码:"  prop="hbasePwd">
                      <Input type="password"  v-model="formValidate.hbasePwd" />
                    </FormItem>
                    <FormItem label="krb5conf路径:"  prop="krb5ConfPath">
                      <Input type="text"  v-model="formValidate.krb5ConfPath" />
                    </FormItem>
                    <FormItem label="hbase配置文件路径:"  prop="hbaseConfPath" class="formLast">
                      <Input type="text"  v-model="formValidate.hbaseConfPath" />
                    </FormItem>
                    <FormItem class="btn1">
                      <Button type="primary" @click="testConnect">验证连接</Button>
                    </FormItem>
                    <FormItem class="btn2">
                      <Button type="primary" @click="preserve">保存</Button>
                      <Button type="primary" @click="cancel">取消</Button>
                    </FormItem>
                </Form>
            </i-col>
        </Row>
      <Modal v-model="modal" title="验证连接结果" :mask-closable="false" footer-hide>
        <div style="overflow:hidden;">
          <p>{{ testResult }}</p>
          <Button type="primary" style="margin-top:10px;float:right;" @click="modal=false">确定</Button>
        </div>
      </Modal>
  </div>
</template>
<script>
import { clusterIter } from '@/api/clusterConfig.js'
export default {
  data: function() {
    return {
        formValidate:{},
        copyFormVaildate:{},
        ruleValidate: {
            clusterCode: [
                {
                    required: true,
                    message: '集群标识不能为空',
                    trigger: 'blur'
                }
            ],
            clusterName: [
                {
                    required: true,
                    message: '请输入集群名称',
                    trigger: 'blur'
                }
            ],
            hbaseUser: [
                { required: true, 
                  message: '请输入hbase账户', 
                  trigger: 'blur' 
                }
            ],
            hbasePwd: [
                { required: true, 
                  message: '请输入hbase密码', 
                  trigger: 'blur' 
                }
            ],
            krb5ConfPath: [
                { required: true, 
                  message: '请输入krb5conf路径', 
                  trigger: 'blur' 
                }
            ],
            
            hbaseConfPath: [
                { required: true, 
                  message: '请输入hbase配置文件路径', 
                  trigger: 'blur' 
                }
            ]
        },
        idx:-1,
        testResult:"",
        modal:false,
    }
  },
  methods: {
    //验证连接   
    async testConnect(){
        let res=await clusterIter.checkHbaseConnect({
            "hbaseUser": this.formValidate.hbaseUser,
            "hbasePwd": this.formValidate.hbasePwd,
            "hbaseConfPath": this.formValidate.hbaseConfPath,
            "krb5ConfPath": this.formValidate.krb5ConfPath
        })
        console.log(res);
        this.testResult=res.data.message;
        this.modal=true;
    },
    // 保存
    async preserve(){
        if(this.idx!=-1){// 编辑保存
          console.log("编辑保存");
            let obj={
                      clusterName:this.formValidate.clusterName,
                      clusterCode:this.formValidate.clusterCode,
                      clusterDesc:this.formValidate.clusterDesc,
                      hbaseUser:this.formValidate.hbaseUser,
                      hbasePwd:this.formValidate.hbasePwd,
                      hbaseConfPath:this.formValidate.hbaseConfPath,
                      krb5ConfPath:this.formValidate.krb5ConfPath
                    };
            this.$refs.formValidate.validate(async validate=>{
                if(validate){
                    let res= await clusterIter.modifyClusterConfig(obj);
                    if(res.data.code==1){
                      this.$Message.success(res.data.message);
                      await this.$emit("handleAdd");
                      this.$emit("handleOk","modal1");
                    }else{
                      alert("数据验证失败");
                    }
                }
            })
        }else{ // 新增保存
        console.log("新增保存");
            let obj=this.formValidate;
            this.$refs.formValidate.validate(validate => {
                if(validate){
                  this.addConfirm(obj);
                }
            })
            // this.formValidate={}; 
        }
    },
    async addConfirm(obj){
        let res=await clusterIter.addClusterConfig(obj);
        if(res.data.code==1){
          await this.$Message.success(res.data.message);
          await this.$refs.formValidate.resetFields();
          await this.$emit("handleOk","modal1");
          await this.$emit("handleAdd");
        }else{
          await this.$Message.error(res.data.message);
        }
    },
    // 取消
    async cancel(){
      if(this.idx!=-1){
        console.log("点击编辑取消");
        // this.formValidate=JSON.parse(JSON.stringify(this.copyFormVaildate));
        // await this.$emit("handleAdd");
      }else{
        console.log("点击新增取消");            
      }
      await this.$refs.formValidate.resetFields();
      await this.$emit("handleCancle","modal1");
    },
  },
  mounted(){
  },
}
</script>

<style lang='less' scoped>
.checkCon{
  position: relative;
  width:380px;
}
.btn1{
  width:40px;
  position: absolute;
  left:70%;
  bottom:-25px;
}
.btn2{
    float:right;
}
</style>
