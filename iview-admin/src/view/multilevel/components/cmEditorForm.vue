<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
      <FormItem label="cm.server" prop="cmServer">
        <Input v-model="formValidate.cmServer" placeholder="请输入"></Input>
      </FormItem>
      <!-- <FormItem label="security.protocol" prop="securityProtocol">
        <Select v-model="formValidate.securityProtocol" placeholder="请选择">
          <Option
            v-for="(item, index) in authTypeArr"
            :key="index"
            :value="item.value"
            :label="item.label"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>-->
      <!-- <FormItem label="sasl.mechanism" prop="saslMechanism">
        <Select v-model="formValidate.saslMechanism" placeholder="请选择">
          <Option
            v-for="(item, index) in saslArr"
            :key="index"
            :value="item.value"
            :label="item.label"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>-->
      <!-- <FormItem label="安全协议" prop="authType">
        <Select v-model="formValidate.authType" placeholder="请选择">
          <Option
            v-for="(item,index) in authTypeArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          >{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="sasl" prop="sasl">
        <Select v-model="formValidate.sasl" placeholder="请选择">
          <Option
            v-for="(item,index) in saslArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          >{{item.label}}</Option>
        </Select>
      </FormItem>-->
    </Form>
  </div>
</template>
<script>
export default {
  name: "cmEditorForm",
  data() {
    return {
      ruleValidate: {
        connUrl: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ]
      },
      runtimeArr: [
        {
          label: "AutoResolveIntegrationRuntime",
          value: "AutoResolveIntegrationRuntime"
        }
      ],
      authTypeArr: [
        {
          label: "SASL_PLAINTEXT",
          value: "SASL_PLAINTEXT"
        }
      ],
      saslArr: [
        {
          label: "PLAIN",
          value: "PLAIN"
        }
      ],
      formValidate: {
        cmServer: ""
        // saslMechanism: "",
        // securityProtocol: ""
      }
    };
  },
  methods: {
    ok() {
      ;
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          let postData = this.getFormData();
          this.$emit("handleOk", postData);
        } else {
          this.$emit("handleCancel", "error");
        }
      });
    },
    cancel() {
      // this.handleReset('formValidate')
      this.$emit("handleCancel", "success");
    },
    handleAddAnnotions() {
      this.formValidate.annotions.unshift({ name: "" });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleTestConnServe() {
      let postData = this.getFormData();
      this.$Message.success("连接成功");
    },
    handleRemove(index) {
      this.formValidate.annotions.splice(index, 1);
    },
    getFormData() {
      let postData = {
        user: "",
        cmServer: ""
      };
      let jsonInfoData = {};
      for (let k in postData) {
        postData[k] = this.formValidate[k];
      }
      jsonInfoData["cm.server"] = postData["cmServer"];
      // 设置连接的类型
      postData.jsonInfoData = JSON.stringify(jsonInfoData);

      console.log("=======postData.jsonInfoData", postData.jsonInfoData);
      return postData;
      return postData;
    }
  },
  created() { },
  mounted() { }
};
</script>
