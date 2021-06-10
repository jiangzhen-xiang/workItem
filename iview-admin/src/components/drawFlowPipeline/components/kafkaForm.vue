<template>
  <div>
    <div style="display:none">getConfig</div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
      <FormItem label="bootstrap.servers" prop="bootstrapServers">
        <Input v-model="formValidate.bootstrapServers" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="security.protocol" prop="securityProtocol">
        <Select v-model="formValidate.securityProtocol" placeholder="请选择">
          <Option
            v-for="(item, index) in authTypeArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="sasl.mechanism" prop="saslMechanism">
        <Select v-model="formValidate.saslMechanism" placeholder="请选择">
          <Option
            v-for="(item, index) in saslArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
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
  name: "kafkaForm",
  data() {
    return {
      ruleValidate: {
        bootstrapServers: [
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
        bootstrapServers: "",
        saslMechanism: "",
        securityProtocol: ""
      }
    };
  },
  computed: {
    getConfig() {
      if (his.formValidate.config) {
        let obj = eval("(" + this.formValidate.config + ")");
        this.formValidate.bootstrapServers = obj.bootstrapServers;
        this.formValidate.saslMechanism = obj.saslMechanism;
        this.formValidate.securityProtocol = obj.securityProtocol;
      }
      return this.formValidate.config;
    }
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
        bootstrapServers: "",
        saslMechanism: "",
        securityProtocol: ""
      };
      for (let k in postData) {
        postData[k] = this.formValidate[k];
      }

      return postData;
    },
    handleReset1(name) {
      this.handleReset("formValidate");
    }
  },
  updated() { },
  created() {
    this.$bus.on("clear-form", this.handleReset1);
  },
  mounted() { }
};
</script>
