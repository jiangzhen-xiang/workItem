<template>
  <div>
       <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="80"
      class="form"
    >
      <FormItem label="hue地址:" prop="url">
                <Input v-model="formValidate.url" ref="rname" />
      </FormItem>
     
      <FormItem style="text-align: right; padding-top: 10px">
                <Button type="default" @click="cancel" style="margin-right: 5px">取消</Button>
                <Button type="primary" @click="ok" style="margin-right: 5px">确定</Button>
      </FormItem>

    </Form>
  </div>
</template>

<script>
import { updateOozieUrl} from '@/api/oozieTask'

export default {
  data: function() {
    return {
        ruleValidate: {
            url: [
                {
                    required: true,
                    message: 'url不能为空',
                    trigger: 'blur'
                }
            ]
        },
        item: {},
        formValidate:{
          url:''
        },
        tip:"",
    }
  },
  methods: {
      async cancel(){
          this.$emit("handleCancle","modal1");
          this.formValidate={};
      },
      ok() {
              

              this.$refs.formValidate.validate(validate => {
                if (validate) {    
                  console.log(this.formValidate.url);
                  this.item.url = this.formValidate.url;
                  updateOozieUrl(this.item).then(res=>{
                    if(res.data.status==1){
                      this.$Message.success("修改成功");
                      this.formValidate={};
                      this.$emit("handleUp");
                    }
                  })    
                }else{
                  alert("数据验证失败");
                }
                this.$emit("handleOk","modal1");
              })
          
    },
    getFocus(){
      this.$nextTick(function(){
        this.$refs.rname.focus();
      })
    },

  },
  watch:{

  },
  computed:{

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
