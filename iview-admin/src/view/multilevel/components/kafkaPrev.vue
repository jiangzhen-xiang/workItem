<template>
  <div>
    <div style="display:none;">{{ getCurEnvId }}</div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110">
      <FormItem label="账号" prop="user">
        <div style="display:flex">
          <div class="flexItem" style="width:90%;">
            <Select v-model="formValidate.user" placeholder="请选择" size="small">
              <Option
                v-for="(item, index) in userArr"
                :key="index"
                :value="item.id"
                :label="item.name"
              >{{ item.name }}({{ item.clusterName }})</Option>
            </Select>
          </div>
          <div class="flexItem" style="margin-left:10px;flex-grow:1;">
            <Button type="primary" size="small" @click="handleFireTestConn">测试连接</Button>
          </div>
        </div>
      </FormItem>
      <FormItem label="bootstrap.servers" prop="bootstrapServers">
        <Input v-model="formValidate.bootstrapServers" placeholder="请输入" disabled></Input>
      </FormItem>
      <FormItem label="security.protocol" prop="securityProtocol">
        <Select v-model="formValidate.securityProtocol" placeholder="请选择" disabled>
          <Option
            v-for="(item, index) in authTypeArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="sasl.mechanism" prop="saslMechanism">
        <Select v-model="formValidate.saslMechanism" placeholder="请选择" disabled>
          <Option
            v-for="(item, index) in saslArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          >{{ item.label }}</Option>
        </Select>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { ajaxGetAccount, ajaxSetConnToEnvTestConn } from "@/api/link.js";

export default {
  name: "kafkaPrev",
  props: ["formValidate", "clusterId", "stepOneData"],
  data() {
    return {
      formValidate: {
        user: "",
        connUrl: "",
        securityProtocol: "",
        saslMechanism: ""
      },
      // ruleValidate: {
      //   user: [
      //     {
      //       required: true,
      //       message: "账号名称不能为空",
      //       trigger: "change"
      //     }
      //   ]
      // },
      userArr: [],

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
        },
        {
          label: "GSSAPI",
          value: "GSSAPI"
        }
      ]
    };
  },
  computed: {
    getCurEnvId() {
      ;
      let postData = {};
      postData.pageSize = 1000;
      postData.pageNum = 1;
      postData.clusterId = this.clusterId;
      postData.categoryAccountName = this.stepOneData.connType;
      ajaxGetAccount(postData).then(res => {
        if (res.data.status == "ok") {
          this.userArr = [].concat(res.data.data.list);
        }
      });
      return this.formValidate.environment;
    }
  },
  methods: {
    handleFireTestConn() {
      let curFormData = this.getFormData();
      let postDataEnv = {};
      let that = this;
      postDataEnv.clusterId = +this.stepOneData.clusterId;
      postDataEnv.envId = this.formValidate.environment;
      postDataEnv.connId = this.stepOneData.connId;
      postDataEnv.accountId = this.formValidate.user;
      postDataEnv.config = curFormData.jsonInfoData;

      let arr = this.userArr.filter(user => {
        return user.id == this.formValidate.user;
      });
      if (arr.length) {
        postDataEnv.categoryAccountType = arr[0].categoryAccountType;
      }
      if (arr.length == 0) {
        this.$Message.warning("请先选择账号");
        return;
      }

      ajaxSetConnToEnvTestConn(postDataEnv).then(res => {
        if (res.data.status == "ok") {
          that.$Message.success("测试连接成功");
        }
      });
    },
    ok() {
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
    handleReset1() {
      this.$refs["formValidate"].resetFields();
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
        bootstrapServers: "",
        securityProtocol: "",
        saslMechanism: ""
      };
      let jsonInfoData = {};
      for (let k in postData) {
        postData[k] = this.formValidate[k];
      }
      jsonInfoData["bootstrap.servers"] = postData["bootstrapServers"];
      jsonInfoData["security.protocol"] = postData["securityProtocol"];
      jsonInfoData["sasl.mechanism"] = postData["saslMechanism"];
      // 设置连接的类型
      postData.jsonInfoData = JSON.stringify(jsonInfoData);

      console.log("=======postData.jsonInfoData", postData.jsonInfoData);
      return postData;
    }
  },
  created() {
    this.$bus.on("clear-form", this.handleReset1);
  },
  mounted() { }
};
</script>
