<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="名称" prop="files">
        <!-- <Input v-model="formValidate.link" placeholder="请输入"></Input> -->
        <Upload
          multiple
          type="drag"
          action="//jsonplaceholder.typicode.com/posts/"
          v-model="formValidate.files"
          :before-upload="handleUpload"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或者拖拽文件到此上传</p>
          </div>
        </Upload>
      </FormItem>
      <!-- <FormItem label="描述" prop="desc">
        <Input
          v-model="formValidate.desc"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          placeholder="请输入"
        ></Input>
      </FormItem>

      <FormItem label="ZK地址" prop="host">
        <Input v-model="formValidate.host" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="ZK端口" prop="port">
        <Input v-model="formValidate.port" placeholder="请输入"></Input>
      </FormItem>

      <FormItem label="认证方式" prop="authType">
        <Select v-model="formValidate.authType" placeholder="请选择">
          <Option
            v-for="(item,index) in authTypeArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          >{{item.label}}</Option>
        </Select>
      </FormItem>
      <div style="border:solid 1px #ddd;border-radius:5px;padding:5px;">
        <div class="btnWrapper" style="text-align:right;padding:5px 0;">
          <label class="ivu-form-item-label" style="width: 80px;">标签增加</label>
          <Button type="default" @click="handleAddAnnotions">增加</Button>
        </div>
        <div class="itemWrapper">
          <FormItem
            v-for="(item, index) in formValidate.annotions"
            :key="index"
            label="标签"
            :prop="item.name"
          >
            <Row>
              <Col span="18">
                <Input type="text" v-model="item.name" placeholder="请输入"></Input>
              </Col>
              <Col span="4" offset="1" style="text-align:right;float:right;">
                <Button @click="handleRemove(index)">删除</Button>
              </Col>
            </Row>
          </FormItem>
        </div>
      </div>
      <FormItem style="text-align:right;padding-top:10px;">
        <Button type="default" @click="cancel" style="margin-right:5px;">取消</Button>
        <Button type="info" @click="handleTestConnServe" style="margin-right:5px;">测试连接</Button>

        <Button type="primary" @click="ok" style="margin-right:5px;">确定</Button>
      </FormItem>-->
    </Form>
  </div>
</template>
<script>
export default {
  name: "hdfsEditorForm",
  data() {
    return {
      formValidate: {
        files: []
      },
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
      ]
    };
  },
  methods: {
    handleUpload(file) {
      this.formValidate.files.push(file);
      // this.$forceUpdate();
    },
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
        connUrl: ""
      };
      for (let k in postData) {
        postData[k] = this.formValidate[k];
      }
      return postData;
    }
  },
  created() { },
  mounted() { }
};
</script>
