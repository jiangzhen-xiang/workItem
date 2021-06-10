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
            <list>
              <ListItem v-for="(list, ii) in item.connectionEnvConfig">
                <div style="width:100%">
                  <div class="ivu-list-item">
                    <div class="ivu-list-item-meta">
                      <div class="ivu-list-item-meta-avatar">
                        <span
                          class="ivu-avatar ivu-avatar-circle ivu-avatar-image ivu-avatar-default"
                        >
                          <img :src="fileStr" />
                        </span>
                      </div>
                      <div class="ivu-list-item-meta-content">
                        <div class="ivu-list-item-meta-title">{{ list.fileName }}</div>
                      </div>
                    </div>
                    <ul class="ivu-list-item-action">
                      <!-- <li>
                        <a @click="handleDownload(list, index, ii)">下载</a>
                      </li>-->
                      <li>
                        <a @click="handlePrev(list, index, ii)">预览</a>
                      </li>
                    </ul>
                  </div>

                  <div
                    style="padding-top: 10px;position: relative;z-index: 0;padding-left:30px;"
                    v-if="list.isShowPrev"
                  >
                    <a
                      class="ivu-btn"
                      style="position: absolute; top: 11px; left: -10px; border: 1px dashed rgb(221, 221, 221); color: rgb(0, 0, 0);"
                      @click="handleOpen(list, index, ii)"
                      v-show="!list.isOpen"
                      title="展开"
                    >+</a>
                    <a
                      class="ivu-btn"
                      style="position: absolute; top: 11px; left: -10px; border: 1px dashed rgb(221, 221, 221); color: rgb(0, 0, 0);"
                      @click="handleClose(list, index, ii)"
                      v-show="list.isOpen"
                      title="闭合"
                    >-</a>

                    <textarea
                      v-show="list.isOpen"
                      name
                      id
                      style="width:100%;border:solid 1px #ddd;border-radius:5px;padding:10px;"
                      readonly
                      rows="10"
                    >{{ list.code }}</textarea>
                  </div>
                </div>
              </ListItem>
            </list>
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
  ajaxGetAccount,
  ajaxFileDown,
  ajaxFilePrev
} from "@/api/link.js";
import { getClusterEnv, ajaxGetEnv } from "@/api/env.js";
let fileStr = require("@/assets/images/file.png");
export default {
  name: "batchForm",
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
      code: "",
      fileStr: fileStr,
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
    handlePrev(item, index, ii) {
      ;
      let that = this;
      let postData = {};
      postData.clusterId = this.row.clusterId;
      postData.connId = this.row.connId;
      postData.envId = item.envId;
      postData.fileId = item.fileId;
      ajaxFilePrev(postData)
        .then(res => {
          if (res.data.status == "ok") {
            item.code = res.data.data.fileContent;

            item.isOpen = true;
            item.isShowPrev = true;
            that.$set(that.listData[index].connectionEnvConfig, ii, item);
            that.$set(that.listData, index, that.listData[index]);
            // that.$forceUpdate()
          }
        })
        .catch(err => {
          this.$Message.error(err.message || "与服务器通信失败,请联系管理员");
        });
    },
    handleOpen(item, index) {
      item.isOpen = true;
      // this.$set(this.listData[index].connectionEnvConfig, ii, item);
      // this.$set(this.listData, index, item);
    },
    handleClose(item, index) {
      item.isOpen = false;
      // this.$set(this.listData, index, item);
    },
    handleDownload(item, index) {
      ;
      let postData = {};
      postData.clusterId = this.row.clusterId;
      postData.connId = this.row.connId;
      postData.envId = item.envId;
      postData.fileId = item.fileId;

      ajaxFileDown(postData)
        .then(res => {
          // if (res.data.status == "ok") {
          let aEle = document.createElement("a"); // 创建a标签
          let blob = new Blob([res.data]);
          aEle.download = item.fileName; // 设置下载文件的文件名
          aEle.href = URL.createObjectURL(blob);
          aEle.click(); // 设置点击事件
          item.code = res.data;
          this.code = res.data;
          // this.$forceUpdate();

          // this.$set(this.listData, index, item);
          // }
        })
        .catch(err => {
          this.$Message.error(err.message || "与服务器通信失败,请联系管理员");
        });
    },
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
