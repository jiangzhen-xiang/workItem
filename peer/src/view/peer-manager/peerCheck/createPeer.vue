<template>
  <div >
    <Row class="row">
      <i-col>
        <!--   -->
        <Form :label-width="80" ref="formValidate" :model="formValidate" :rules="ruleValidate">
          <FormItem  label="源集群:" prop="sourceClusterCode">
            <Select   v-model="formValidate.sourceClusterCode">
              <Option v-for="(item,index) in cluCode" :key="index" :value="item">{{item}}</Option>
            </Select>
          </FormItem>
          <FormItem  label="目标集群:" prop="targetClusterCode">
            <Select   v-model="formValidate.targetClusterCode">
              <Option v-for="(item,index) in cluCode" :key="index" :value="item">{{item}}</Option>
            </Select>
          </FormItem>
          <FormItem label="peer名称:" prop="peerId">
            <Input type="text" v-model="formValidate.peerId" />
          </FormItem>
          <FormItem class="btn">
            <Button type="primary" style="margin-right:10px;" @click="save">保存</Button>
            <Button type="primary" @click="cancel">取消</Button>
          </FormItem>
        </Form>
      </i-col>
    </Row>
    <Modal v-model="modal" title="错误提示" :closable="false" :mask-closable="false" footer-hide>
      <p v-for="(item,index) in getErrorTipArr " :key="index" >{{ item }}</p>
      <div style="overflow:hidden;"> 
        <Button type="primary" @click="errorOk" style="float:right;margin-top:10px;">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import peerCheckAxios from '@/api/peerCheck.js'
export default {
  data: function() {
    return {
      ruleValidate: {
        sourceClusterCode: [
            {
                required: true,
                message: '请选择源集群',
                trigger: 'blur'
            }
        ],
        targetClusterCode: [
            {
                required: true,
                message: '请选择目标集群',
                trigger: 'blur'
            }
        ],
        peerId: [
            { required: true, 
              message: 'peer名称不能为空', 
              trigger: 'blur' }
        ]
      },
      formValidate:{},
      cluCode:[],
      modal:false,
      errorTip:'',
    }
  },
  methods: {
    // 新建peer
    async save(){
        console.log("点击保存");
        this.$refs.formValidate.validate(async validate=>{
          if(validate){
            let res=await peerCheckAxios.peerCreate({
              "sourceClusterCode":this.formValidate.sourceClusterCode,
              "targetClusterCode": this.formValidate.targetClusterCode,
              "peerId": this.formValidate.peerId
            });
            if(res.data.code==1){
              this.$Message.success(res.data.message)
              this.$refs.formValidate.resetFields();
              await this.$emit("handleCreate")
              await this.$emit("handleOk","modal2");
            }else{
              // this.$Message.error(res.data.message)
              this.errorTip=res.data.message;
              this.modal=true;
            }
          }
        })
    },
    cancel(){
        console.log("点击取消");
        this.$refs.formValidate.resetFields();
        this.$emit("handleCancle","modal2");
    },
    errorOk(){
      this.modal=false;
    }
  },
  computed:{
    getErrorTipArr:function(){
      return this.errorTip.split("###");
    }
  },
  created() {}
}
</script>

<style lang='less' scoped>
.btn{
    float:right;
}
</style>
