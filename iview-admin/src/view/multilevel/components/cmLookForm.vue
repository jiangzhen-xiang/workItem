<template>
  <div>
    <!-- <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="80"
    >
      <div style="display:none;">{{ getConnType }}</div>
      <FormItem label="集群" prop="clusterId">
        <Select
          v-model="formValidate.clusterId"
          placeholder="集群选择"
          filterable
          @on-change="colonyChange"
        >
          <Option
            v-for="(item, index) in colonyArr"
            :key="index"
            :value="item.id.toString()"
            :label="item.name"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="环境" prop="envId">
        <Row style="padding-right:0;padding-left:0;">
          <Col span="18">
            <Select
              v-model="formValidate.envId"
              placeholder="环境"
              filterable
              @on-change="envChange"
            >
              <Option
                v-for="(item, index) in envArr"
                :key="index"
                :value="item.id.toString()"
                :label="item.name"
                >{{ item.name }}</Option
              >
            </Select>
          </Col>
          <Col span="4" offset="1">
            <Button @click="handleAddEnv(index)" :disabled="isCanAddEnv"
              >+</Button
            >
          </Col>
        </Row>
      </FormItem>
      <FormItem label="连接名称" prop="connId">
        <Row style="padding-right:0;padding-left:0;">
          <Col span="18">
            <Select
              v-model="formValidate.connId"
              filterable
              placeholder="连接"
              @on-change="connChange"
            >
              <Option
                v-for="(item, index) in connArr"
                :key="index"
                filterable
                :value="item.connId.toString()"
                :label="item.connName"
                >{{ item.connName }}</Option
              >
            </Select>
          </Col>
          <Col span="4" offset="1">
            <Button @click="handleSetConn(index)" :disabled="isCanSetConn"
              >+</Button
            >
          </Col>
        </Row>
      </FormItem>
      <FormItem label="用户名" prop="accountId">
        <Select v-model="formValidate.accountId" placeholder="环境">
          <Option
            v-for="(item, index) in accountArr"
            :key="index"
            :value="item.id.toString()"
            :label="item.name"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem style="text-align:right;padding-top:10px;">
        <Button type="default" @click="cancel" style="margin-right:5px;"
          >取消</Button
        >
        <Button
          type="primary"
          @click="ok"
          :disabled="isBatching"
          style="margin-right:5px;"
          >确定</Button
        >
      </FormItem>
    </Form>-->
    <div class="ivu-card-head">
      <p>基本信息</p>
    </div>
    <div
      class="flex"
      style="display: flex;flex-wrap: wrap;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 10px 0;
    border-bottom: solid 1px #ddd;
    margin-bottom: 10px;"
    >
      <div class="flexItem">连接名称:{{ row.connName }}</div>
      <div class="flexItem">连接类型:{{ row.connType }}</div>
      <div class="flexItem">所属集群:{{ row.clusterName }}</div>
    </div>
    <div class="ivu-card-head">
      <p>环境参数配置</p>
    </div>
    <div style="padding-top:10px;">
      <Collapse v-model="value1">
        <Panel :name="index.toString()" v-for="(item, index) in listData">
          {{ item.envName }}
          <div slot="content">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110">
              <FormItem
                label="bootstrap.servers"
                prop="bootstrapServers"
              >{{ item.config && item.config["bootstrap.servers"] }}</FormItem>
              <FormItem
                label="security.protocol"
                prop="securityProtocol"
              >{{ item.config && item.config["security.protocol"] }}</FormItem>
              <FormItem
                label="sasl.mechanism"
                prop="saslMechanism"
              >{{ item.config && item.config["sasl.mechanism"] }}</FormItem>
            </Form>
          </div>
        </Panel>
      </Collapse>
    </div>
  </div>
</template>
<script>
import {
  getLink,
  ajaxEditorConn,
  getLinkCheck,
  ajaxGetConn,
  ajaxConnBatchAdd,
  ajaxGetAccount
} from "@/api/link.js";
import { getClusterEnv, ajaxGetEnv } from "@/api/env.js";
export default {
  name: "cmLookForm",
  props: ["connType", "row", "listData"],
  data() {
    let isCanCheckLink = true;
    const checkLink = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("连接名称不能为空"));
      } else {
        // 请求后端，获取这个账号名称，如果有数据，就提示有数据
        if (isCanCheckLink) {
          isCanCheckLink = false;
          setTimeout(() => {
            console.log("校验字段，校验连接名称");

            getLinkCheck(value, this.formValidate.clusterId)
              .then(res => {
                isCanCheckLink = true;
                // res.data 不为空，就是有数据
                ;
                if (res.data.status == "ok") {
                  if (
                    res.data.data &&
                    res.data.data != this.formValidate.connId
                  ) {
                    callback(new Error("连接名称重复"));
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              })
              .catch(err => {
                isCanCheckLink = true;
              });
          }, 1000);
        }
      }
    };
    return {
      value1: "0",
      isBatching: false,
      isCanAddEnv: true,
      isCanSetConn: true,
      colonyArr: [],
      envArr: [],
      connArr: [],
      runtimeArr: [
        {
          label: "AutoResolveIntegrationRuntime",
          value: "AutoResolveIntegrationRuntime"
        }
      ],
      authTypeArr: [
        {
          label: "none",
          value: "none"
        },
        {
          label: "kerberos",
          value: "kerberos"
        }
      ],
      formValidate: {
        connId: "",
        accountId: "",
        envId: "",
        clusterId: ""
      },
      ruleValidate: {
        connName: [
          {
            required: true,
            message: "连接名称不能为空",
            trigger: "blur"
          },
          // TODO 测试接口时放开
          {
            validator: checkLink,
            trigger: "change"
          }
        ],
        connType: [
          {
            required: true,
            message: "连接类型为空",
            trigger: "change"
          }
        ],
        clusterId: [
          {
            required: true,
            message: "集群名称不能为空",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    getConnType() {
      this.formValidate.connType = this.connType;
      return this.connType;
    }
  },
  methods: {
    colonyChange(val) {
      let postData = {};
      postData.pageSize = 1000;
      postData.pageNum = 1;
      postData.clusterId = val;
      getClusterEnv(postData).then(res => {
        if (res.data.status == "ok") {
          this.envArr = [].concat(res.data.data.list);
        }
      });
    },
    envChange(val) {
      let postData = {};
      postData.clusterId = this.formValidate.clusterId;
      postData.envId = val;
      postData.pageNum = 1;
      postData.pageSize = 1000;
      ajaxGetConn(postData).then(res => {
        if (res.data.status == "ok") {
          this.connArr = [].concat(res.data.data.list);
        }
      });
    },
    connChange(val) {
      let postData = {};
      postData.clusterId = this.formValidate.clusterId;
      postData.categoryAccountName = this.connType;
      postData.pageNum = 1;
      postData.pageSize = 1000;
      ajaxGetAccount(postData).then(res => {
        if (res.data.status == "ok") {
          this.accountArr = [].concat(res.data.data.list);
        }
      });
    },
    initFormLinkArr() {
      let postData = {};
      postData.pageNum = 1;
      postData.pageSize = 1000;
      getLink(postData).then(res => {
        if (res.data.status == "ok") {
          this.colonyArr = res.data.data.list;
        }
      });
    },
    // ok() {
    //   this.$refs.formValidate.validate(validate => {
    //     if (validate) {
    //       let postData = this.getFormData()
    //       ajaxAddLink(postData).then(res => {
    //         if (res.status == '200' && res.code == 'SUCCESS') {
    //           this.$Message.success(res.msg || '添加数据成功')
    //           this.$emit('handleOk', postData)
    //         } else {

    //         }
    //       }).catch(err => {
    //         this.$Message.error(res.msg || '与服务器通信错误,请稍后')
    //       })
    //     }
    //   })
    // },
    ok() {
      this.$refs.formValidate.validate(validate => {
        if (validate) {
          let postData = this.getFormData();
          this.isBatching = true;
          ajaxConnBatchAdd(postData)
            .then(res => {
              this.isBatching = false;
              if (res.data.status == "ok") {
                this.$Message.success(res.msg || "批量添加连接成功");
                this.$emit("handleOk", "modalBatch");
              } else {
              }
            })
            .catch(err => {
              this.isBatching = false;
              this.$Message.error(res.msg || "与服务器通信错误,请稍后");
            });
          // 
          // this.$emit('handleOk', postData)
        }
      });
    },
    cancel() {
      this.handleReset("formValidate");
      this.$emit("handleCancel", "modalBatch");
    },
    handleAddAnnotions() {
      this.formValidate.annotions.unshift({ name: "" });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.formValidate.annotions = [].concat({
        name: ""
      });
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
        connId: "",
        accountId: "",
        envId: "",
        clusterId: ""
      };
      for (let k in postData) {
        postData[k] = this.formValidate[k];
      }
      postData.connType = this.connType;
      return postData;
    }
  },
  created() { },
  mounted() {
    this.$nextTick(() => {
      this.initFormLinkArr();
    });
  }
};
</script>
