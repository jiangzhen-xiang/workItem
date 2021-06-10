
<template>
  <div>
    <Tabs value="name1">
      <TabPane label="设置" name="name1">
        <div class="tabConten">
          <Form
            ref="formGenaral"
            :model="formGenaral"
            :rules="ruleValidate"
            :label-width="180"
            label-position="left"
          >
            <FormItem label="pipeline名称" prop="pipeline" style="width:445px;">
              <Input type="text" v-model="formGenaral.pipeline" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="最大并行度" prop="maxParallelism">
              <div style="display:inline-block;width:120px;">
                <Select v-model="formGenaral.maxParallelism" placeholder="请输入">
                  <Option
                    v-for="(item,index) in linkArr"
                    :value="item.value"
                    :label="item.label"
                    :key="item.label"
                  >{{item.label}}</Option>
                </Select>
              </div>
              <div style="display:inline-block;">
                <Input type="text" v-model="formGenaral.maxParallelismValue" placeholder="请输入"></Input>
              </div>
            </FormItem>
            <FormItem label="driver 内存:" prop="driver" style="width:465px;">
              <div class>
                <div style="display:inline-block;width:80%">
                  <Input type="text" v-model="formGenaral.driver" placeholder="请输入"></Input>
                </div>
                <div style="display:inline-block;width:9%;padding-left:5px;">MB</div>
              </div>
            </FormItem>
            <FormItem label="executor 内存:" prop="executor" style="width:465px;">
              <div class>
                <div style="display:inline-block;width:80%">
                  <Input type="text" v-model="formGenaral.executor" placeholder="请输入"></Input>
                </div>
                <div style="display:inline-block;width:9%;padding-left:5px;">MB</div>
              </div>
            </FormItem>
            <!-- <FormItem label="checkpoint" prop="isCheckPoint" style="width:445px;">
              <RadioGroup v-model="formGenaral.isCheckPoint">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="checkpoint间隔" prop="checkPointSplit" style="width:465px;">
              <div style="display:inline-block;width:80%">
                <Input type="text" v-model="formGenaral.checkPointSplit" placeholder="请输入"></Input>
              </div>
              <div style="display:inline-block;width:18%;padding-left:5px;">分钟</div>
            </FormItem>

            <FormItem label="从checkpoint恢复" prop="recovery" style="width:445px;">
              <Input type="text" v-model="formGenaral.recovery" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="端到端事务(Exactly Only Once)" prop="exactlyOnlyOnce" style="width:445px;">
              <RadioGroup v-model="formGenaral.exactlyOnlyOnce">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>-->
            <FormItem label="描述" prop="desc">
              <Input type="textarea" v-model="formGenaral.desc" placeholder="请输入"></Input>
            </FormItem>
            <div class="wrapper">
              <Table
                :loading="loading"
                :columns="tableTitleSink"
                tool-theme="dark"
                :data="formGenaral.sinkArr"
                border
              >
                <template slot-scope="{ row }" slot="error">
                  <Input type="text" size="small" v-model="row.error" />
                </template>
              </Table>
              <div class="page" style="text-align:right;padding-top:10px;">
                <Page
                  :total="formGenaral.sinkArr.length"
                  show-total
                  show-elevator
                  :current="currentSink"
                  :size="pageSize"
                  @on-change="pageChangeSink"
                />
              </div>
            </div>
          </Form>
        </div>
      </TabPane>
      <TabPane label="参数" name="name2">
        <Form ref="formParams" :model="formParams" :rules="ruleValidate" :label-width="80">
          <div style="border:solid 1px #ddd;border-radius:5px;padding:5px;">
            <div class="btnWrapper" style="text-align:right;padding:5px 0;">
              <label class="ivu-form-item-label" style="width: 80px;">参数增加</label>
              <Button type="default" @click="handleAddParams">增加</Button>
            </div>
            <div class="itemWrapper">
              <Table
                :loading="loading"
                :columns="tableTitleParams"
                :data="formParams.params"
                tooltip-theme="dark"
                border
              >
                <template slot-scope="{ row }" slot="name">
                  <Input text="text" v-model="row.name" size="small" prop="name"></Input>
                </template>
                <template slot-scope="{ row }" slot="type">
                  <Select v-model="row.type" prop="type" placeholder="请输入" transfer>
                    <Option
                      v-for="(item,index) in typeArr"
                      :value="item.value"
                      :label="item.label"
                      :key="item.label"
                    >{{item.label}}</Option>
                  </Select>
                </template>
                <template slot-scope="{ row , index }" slot="defaultValue">
                  <Input
                    type="text"
                    v-model="row.defaultValue"
                    prop="defaultValue"
                    size="small"
                    @on-blur="($event,index,row)=>{
                      
                        this.handleValueblur($event,index,row);
                    }"
                  ></Input>
                </template>
                <template slot-scope="{ row }" slot="action">
                  <Button type="error" @click="handleDeleteParam(row)">删除</Button>
                </template>
              </Table>
              <div class="page" style="text-align:right;padding-top:10px;">
                <Page
                  :total="formParams.params.length"
                  show-total
                  show-elevator
                  :current="current"
                  :size="size"
                  @on-change="pageChange"
                />
              </div>
            </div>
          </div>
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>

export default {
  name: 'dataFlowTab',
  props: [],
  data() {
    return {
      formGenaral: {
        pipeline: '',
        maxParallelism: '智能设置',
        maxParallelismValue: '16',
        driver: '1024',
        executor: '1024',
        isCheckPoint: '1',
        checkPointSplit: '60',
        recovery: '100',
        exactlyOnlyOnce: '',
        desc: 'pipeline 演示测试',
        sinkArr: []
      },
      formParams: {
        params: []
      },
      linkArr: [{
        label: '默认',
        value: '默认'
      },
      {
        label: '智能设置',
        value: '智能设置'
      },
      {
        label: '自定义',
        value: '自定义'
      }],
      loading: false,
      currentSink: 1,
      current: 1,
      size: 10,
      pageSize: 10,
      tableTitleSink: [{
        title: 'sink名称',
        key: 'sink'
      },
      {
        title: '输出顺序',
        key: 'error',
        slot: 'error'
      }],
      typeArr: [{
        label: 'string',
        value: 'string'
      }],
      tableTitleParams: [
        {
          title: '参数名称',
          key: 'name',
          eclipse: true,
          tooltip: true,

          slot: 'name'
        },
        {
          title: 'type',
          key: 'type',
          eclipse: true,
          tooltip: true,
          slot: 'type'
        },
        {
          title: 'defaultValue',
          key: 'defaultValue',
          eclipse: true,
          tooltip: true,

          slot: 'defaultValue'
        },
        {
          title: '操作',
          key: 'action',
          eclipse: true,
          tooltip: true,

          slot: 'action'
        }
      ],
      ruleValidate: {}

    }
  },
  computed: {
    zjName() {
      return this.curModal
    }
  },
  methods: {
    handleValueblur(e, index, row) {

      let idx = (this.current - 1) * this.size + index
      row.defaultValue = e.target.value
      this.$set(this.formParams.params, idx, row)
    },

    handleDeleteParam(row) {

      let index = (this.current - 1) * this.size + row['_index']

      this.formParams.params.splice(index, 1)
    },
    handleAddParams() {

      let obj = {
        name: '',
        type: '',
        defaultValue: ''
      }
      this.formParams.params.push(obj)
      this.$set(this.formParams.params, 0, obj)
    },
    pageChangeSink(val) {
      this.currentSink = val
    },
    pageChange(val) {
      this.current = val
    },

    handleSuccessModal(postData) {
      this.outputStreamArr.push(postData)
      this.modalHide('modal1')
    },
    modalHide(k) {
      this[k] = false
    },

    modalShow(k) {
      this[k] = true
    },
    handleAddDataSetName() {
      this.value3 = true
    },
    handleAddColumns() {
      this.formOpt.columns.unshift({ name: '' })
    },
    handleRemove(index) {
      this.formOpt.columns.splice(index, 1)
    }
  },
  components: {

  },
  created() { },
  mounted() {
    this.$nextTick(() => {
      console.log('=========pipeline', this.pipeline)
    })
  }
}
</script>
<style lang="less" scoped>
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.btnAddWrapper {
  /deep/ .ivu-icon {
    font-size: 26px;
    line-height: 15px;
  }
}
.partWrapper {
  .ivu-list-item-meta {
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .ivu-list-item {
      align-items: center;
    }
  }
  /deep/ .ivu-avatar {
    height: 160px;
    width: 100%;
    border: solid 2px #ddd;
    border-radius: 5px;
    cursor: pointer;
  }
  /deep/ .ivu-avatar:hover {
    border-color: #1060d7;
  }
}

.borderWrapper {
  border-radius: 10px;
  overflow: hidden;
  background: #fff8f5;
  border: 1px solid #ddd;
  box-shadow: 2px 4px 4px rgba(221, 221, 221, 0.8);
  .iconWrapper {
    height: 90px;
    svg {
      font-size: 48px;
      margin-top: 16px;
    }
  }
  .f5bc08 {
    background: #f5bc08;
  }
  .ce634e {
    background: #ce634e;
  }
  .ed4a2 {
    background: #0ed4a2;
  }
}
.flex {
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}
.flex-item {
  padding: 20px;
  width: 25%;
  text-align: center;
}

.flex-item img {
  max-width: 100%;
  border-radius: 10px;
}

.flex::after {
  content: "";

  flex: auto;
}
</style>
<style >
.ivu-drawer-close {
  left: -15px;
  background: #fff;
  top: 50%;
  width: 30px;
  border-radius: 50%;
  margin-top: -25px;
}
</style>
