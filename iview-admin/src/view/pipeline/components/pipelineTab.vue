
<template>
  <div>
    <div style="display:none">{{getclusterUseArr}}</div>
    <Tabs value="name1">
      <TabPane label="设置" name="name1">
        <div class="tabConten">
          <Form
            ref="formGenaral"
            :model="pipeline.formGenaral"
            :rules="ruleValidate"
            :label-width="180"
            label-position="left"
          >
            <FormItem label="pipeline名称" prop="pipeline" style="width:445px;">
              <Input type="text" v-model="pipeline.formGenaral.pipeline" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="最大并行度" prop="maxParallelism">
              <div style="display:inline-block;width:120px;">
                <Select v-model="pipeline.formGenaral.maxParallelism" placeholder="请输入" filterable>
                  <Option
                    v-for="(item,index) in linkArr"
                    :value="item.value"
                    :label="item.label"
                    :key="item.label"
                  >{{item.label}}</Option>
                </Select>
              </div>
              <div style="display:inline-block;">
                <Input
                  type="text"
                  v-model="pipeline.formGenaral.maxParallelismValue"
                  placeholder="请输入"
                ></Input>
              </div>
            </FormItem>
            <FormItem label="jobmanager 内存:" prop="jobmanager" style="width:465px;">
              <div class>
                <div style="display:inline-block;width:80%">
                  <Input type="text" v-model="pipeline.formGenaral.jobmanager" placeholder="请输入"></Input>
                </div>
                <div style="display:inline-block;width:9%;padding-left:5px;">MB</div>
              </div>
            </FormItem>
            <FormItem label="taskmanager 内存:" prop="taskmanager" style="width:465px;">
              <div class>
                <div style="display:inline-block;width:80%">
                  <Input type="text" v-model="pipeline.formGenaral.taskmanager" placeholder="请输入"></Input>
                </div>
                <div style="display:inline-block;width:9%;padding-left:5px;">MB</div>
              </div>
            </FormItem>
            <FormItem label="taskSlots" prop="taskSlots" style="width:465px;">
              <Input type="text" v-model="pipeline.formGenaral.taskSlots" placeholder="请输入"></Input>
            </FormItem>
            <!-- <FormItem label="checkpoint" prop="isCheckPoint" style="width:445px;">
              <RadioGroup v-model="pipeline.formGenaralisCheckPoint">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="checkpoint间隔" prop="checkPointSplit" style="width:465px;">
              <div style="display:inline-block;width:80%">
                <Input type="text" v-model="pipeline.formGenaral.checkPointSplit" placeholder="请输入"></Input>
              </div>
              <div style="display:inline-block;width:18%;padding-left:5px;">分钟</div>
            </FormItem>

            <FormItem label="从checkpoint恢复" prop="recovery" style="width:445px;">
              <Input type="text" v-model="pipeline.formGenaral.recovery" placeholder="请输入"></Input>
            </FormItem>-->
            <FormItem label="端到端事务(Exactly Only Once)" prop="exactlyOnlyOnce" style="width:445px;">
              <RadioGroup v-model="pipeline.formGenaral.exactlyOnlyOnce">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="描述" prop="desc">
              <Input type="textarea" v-model="pipeline.formGenaral.desc" placeholder="请输入"></Input>
            </FormItem>

            <div class="wrapper">
              <Table
                :loading="loading"
                :columns="tableTitleSink"
                tool-theme="dark"
                :data="pipeline.formGenaral.sinkArr"
                border
              >
                <template slot-scope="{ row }" slot="error">
                  <Input type="text" size="small" v-model="row.error" />
                </template>
              </Table>
              <div class="page" style="text-align:right;padding-top:10px;">
                <Page
                  :total="pipeline.formGenaral.sinkArr.length"
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
        <Form ref="formParams" :model="pipeline.formParams" :rules="ruleValidate" :label-width="80">
          <div style="border:solid 1px #ddd;border-radius:5px;padding:5px;">
            <div class="btnWrapper" style="text-align:right;padding:5px 0;">
              <label class="ivu-form-item-label" style="width: 80px;">参数增加</label>
              <Button type="default" @click="handleAddParams">增加</Button>
            </div>
            <div class="itemWrapper">
              <Table
                :loading="loading"
                :columns="tableTitleParams"
                :data="pipeline.formParams.params"
                tooltip-theme="dark"
                border
              >
                <template slot-scope="{ index,row }" slot="name">
                  <Input
                    text="text"
                    v-model="row.name"
                    size="small"
                    prop="name"
                    @on-blur="handleBlindChange(row,index)"
                  ></Input>
                </template>
                <template slot-scope="{ index,row  }" slot="type">
                  <Select
                    v-model="row.type"
                    prop="type"
                    placeholder="请输入"
                    transfer
                    @on-blur="handleBlindChange(row,index)"
                  >
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
                    @on-blur="handleBlindChange(row,index)"
                  ></Input>
                  <!-- <Select v-model="row.type" placeholder="请输入">
                    <Option
                      v-for="(item,index) in typeArr"
                      :value="item.value"
                      :label="item.label"
                      :key="item.label"
                    >{{item.label}}</Option>
                  </Select>-->
                </template>
                <template slot-scope="{ row }" slot="action">
                  <Button type="error" @click="handleDeleteParam(row)">删除</Button>
                </template>
              </Table>
              <div class="page" style="text-align:right;padding-top:10px;">
                <Page
                  :total="pipeline.formParams.params.length"
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
      <TabPane label="发布配置" name="name3">
        <div class="ivu-card-head">
          <p>参数配置</p>
        </div>
        <Form
          ref="formValidate"
          :model="pipeline.runTime"
          :rules="ruleValidate"
          :label-width="80"
          inline
        >
          <FormItem label="运行模式" prop="mode" style="width:200px;">
            <Select v-model="pipeline.runTime.mode" size="small" placeholder="请选择运行模式" transfer>
              <Option
                value="name"
                v-for="(item, index) in modeArr"
                :label="item.label"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="运行集群" prop="cluster" style="width:200px;">
            <Select
              v-model="pipeline.runTime.cluster"
              size="small"
              placeholder="请选择运行集群"
              @on-change="changeCluster"
            >
              <Option
                value="name"
                v-for="(item, index) in colonyArr"
                :label="item.name"
                :value="item.name"
                :key="index"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>

          <FormItem label="flink连接" prop="flinkConn" style="width:200px;">
            <Select
              v-model="pipeline.runTime.flinkConn"
              size="small"
              placeholder="请选择flink连接"
              transfer
            >
              <Option
                v-for="(item, index) in runConnArr"
                v-if="( item.clusterName == pipeline.runTime.cluster )&&(item.connType == 'flink')"
                :label="item.connName"
                :value="item.connName"
                :key="index"
              >{{ item.connName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="yarn 连接" prop="yarnConn" style="width:200px;">
            <Select
              v-model="pipeline.runTime.yarnConn"
              size="small"
              placeholder="请选择yarn连接"
              transfer
            >
              <Option
                value="name"
                v-for="(item, index) in runConnArr"
                v-if="item.clusterName == pipeline.runTime.cluster && item.connType == 'yarn' "
                :label="item.connName"
                :value="item.connName"
                :key="index"
              >{{ item.connName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="队列" prop="queue" style="width:200px;">
            <Input v-model="pipeline.runTime.queue" size="small" placeholder="请输入队列"></Input>
          </FormItem>
          <FormItem label="yarn 账号" prop="yarnAccount" style="width:200px;">
            <Select
              v-model="pipeline.runTime.yarnAccount"
              size="small"
              placeholder="请选择yarn账号"
              transfer
              filterable
            >
              <Option
                value="name"
                v-for="(item, index) in yarnAccountArr"
                :label="item.name"
                :value="item.name"
                :key="index"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="默认用户" prop="runUser" style="width:200px;">
            <Input
              v-model="pipeline.runTime.runUser"
              size="small"
              placeholder="未开启kerbros认证使用默认用户"
              style="width:200px;"
            ></Input>
          </FormItem>
        </Form>
        <Divider style="margin:10px 0;" />
        <div class>
          <div class="ivu-card-head">
            <p>集群配置</p>
          </div>
          <div style="width:100%;margin:10px;">
            <tableClusterEnv :nodeData="pipeline" />
          </div>
        </div>
      </TabPane>
      <TabPane label="checkPoints" name="name4">
        <Form ref="formValidate" :model="pipeline.config" :rules="ruleValidate" :label-width="160">
          <FormItem label="是否启用CheckPoint" prop="isCheckPoint">
            <RadioGroup v-model="pipeline.config.isCheckPoint">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="checkpoint间隔" prop="checkpointInterval">
            <div style="display:inline-block;width:120px">
              <Input
                v-model="pipeline.config.checkpointInterval"
                size="small"
                placeholder="请输入队列"
                :disabled="pipeline.config.isCheckPoint == '0' "
              ></Input>
            </div>
            <div style="display:inline-block;width:18%;padding-left:5px;">分钟</div>
          </FormItem>
          <FormItem label="checkpointMode" prop="checkpointMode">
            <Select
              v-model="pipeline.config.checkpointMode"
              size="small"
              placeholder="请选择运行模式"
              style="width:160px"
              transfer
              filterable
            >
              <Option
                value="name"
                v-for="(item, index) in checkpointModeArr"
                :label="item.label"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="checkpointCleanup" prop="checkpointCleanup">
            <Select
              v-model="pipeline.config.checkpointCleanup"
              size="small"
              placeholder="请选择运行集群"
              style="width:160px"
            >
              <Option
                value="name"
                v-for="(item, index) in checkpointCleanupArr"
                :label="item.label"
                :value="item.value"
                :key="index"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { userFunc } from '@/api/user1.js'
import { getLink, ajaxGetConn } from '@/api/link.js'
import { ajaxGetEnv } from '@/api/env.js'
import tableClusterEnv from './tableClusterEnv.vue'
export default {
  name: 'pipelineTab',
  props: ['pipeline', 'nodeData'],
  data() {
    return {
      small: 'default',
      clusterUseArr: [],
      runEnvArr: [],
      checkpointCleanupArr: [{
        label: 'cancel时删除',
        value: 'DELETE_ON_CANCELLATION'
      },
      {
        label: 'cancel时保留',
        value: 'RETAIN_ON_CANCELLATION'
      }],
      checkpointModeArr: [{
        label: '至少一次',
        value: 'AT_LEAST_ONCE'
      },
      {
        label: '准确一次',
        value: 'EXACTLY_ONCE'
      }],
      runConnArr: [],
      yarnAccountArr: [],
      modeArr: [
        {
          label: 'yarn',
          value: 'yarnApp'
        },
        {
          label: 'standalone',
          value: 'standalone'
        }
      ],
      colonyArr: [],
      envArr: [],
      formGenaral: {
        pipeline: '',
        maxParallelism: '智能设置',
        maxParallelismValue: '16',
        jobmanager: '1024',
        taskmanager: '1024',
        isCheckPoint: '1',
        checkPointSplit: '60',
        recovery: '100',
        exactlyOnlyOnce: '',
        desc: 'pipeline 演示测试'
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
    },
    getclusterUseArr() {
      let arr = []
      //
      let arrObj = {}
      this.pipeline && this.pipeline.runTime && this.pipeline.runTime.clusterUseArr && this.pipeline.runTime.clusterUseArr.map(item => {
        arrObj[item.cluster] = 1
      })
      // 从pipeline.drawData中 获取集群
      this.pipeline && this.pipeline.drawData && this.pipeline.drawData.map(item => {
        if ((item.start || (item.tabType == 'endTab')) && (item.formLink.colony) && (!(item.formLink.colony in arrObj))) {
          arrObj[item.formLink.colony] = '1'
          arr.push({
            label: item.formLink.colony,
            cluster: item.formLink.colony,
            env: '-1'
          })
        }
      })
      // 从runtime中配置的获取
      let isHasRunTime = this.pipeline && this.pipeline.runTime && this.pipeline.runTime.colony && (!(this.pipeline.runTime.colony in arrObj))
      if (isHasRunTime) {
        arrObj[this.pipeline.runTime.colony] = '1'
        arr.push({
          label: this.pipeline.runTime.colony,
          cluster: this.pipeline.runTime.colony,
          env: '-1'
        })
      }

      this.pipeline && this.pipeline.runTime && this.pipeline.runTime.clusterUseArr && (this.pipeline.runTime.clusterUseArr = this.pipeline.runTime.clusterUseArr.concat(arr))
      return arr
    }
  },
  methods: {
    changePublishEnv(source, index) {
      console.log('source========', source)
      console.log('=========index', index)
      console.log('=========clusert', this.pipeline.runTime.clusterUseArr[index])
    },
    getRunEnvArr() {
      let postData = {}
      postData.pageSize = 1000
      postData.pageNum = 1
      ajaxGetEnv(postData).then(res => {
        if (res.data.status == 'ok') {
          this.runEnvArr = [].concat(res.data.data.list)
        }
      })
    },
    getClusterArr() {
      let postData = {}
      let that = this
      postData.pageSize = 1000
      postData.pageNum = 1

      getLink(postData).then(res => {
        if (res.data.status == 'ok') {
          that.colonyArr = [].concat(res.data.data.list)
        }
      })
    },
    changeCluster(val) {
      let arr = this.colonyArr.filter(item => {
        return item.name == val; ''
      })
      this.envArr = [].concat(arr[0].envVOList)
      // 查询当前集群下的'有连接'
      let postData = {}
      postData.pageNum = 1
      postData.pageSize = 1000
      ajaxGetConn(postData).then(res => {
        if (res.data.status == 'ok') {
          this.runConnArr = [].concat(res.data.data.list)
        }
      })
      // 先去掉配置中设置的那个集群
      this.pipeline.runTime.clusterUseArr = this.pipeline.runTime.clusterUseArr.filter(item => {
        return item.isPublish != 1
      })
      // 还要设置下集群发布配置下的集群列表
      let hasArr = this.pipeline.runTime.clusterUseArr.filter(item => {
        return item.cluster == val
      })
      if (hasArr.length == 0) {
        this.pipeline.runTime.clusterUseArr.push({
          cluster: val,
          name: val,
          env: '-1',
          isPublish: 1
        })
      }
    },
    getYarnAccountArr() {
      let postData = {}
      postData.pageSize = 1000
      postData.pageNum = 1
      userFunc.getTableDataAai(postData).then(res => {
        if (res.data.status == 'ok') {
          this.yarnAccountArr = res.data.data.list
        }
      })
    },
    handleBlindChange(row, index, key) {
      console.log('======row', row)
      this.$set(this.pipeline.formParams.params, index, row)
      // this.pepeline.formParams.params[index]
      //   this.projectData[index]=row;
      //   this.projectData.splice(0,0)
    },
    handleValueblur(e, index, row) {
      let idx = (this.current - 1) * this.size + index
      row.defaultValue = e.target.value
      this.$set(this.pipeline.formParams.params, idx, row)
    },

    handleDeleteParam(row) {
      let index = (this.current - 1) * this.size + row['_index']
      this.pipeline.formParams.params.splice(index, 1)
    },
    handleAddParams() {
      let obj = {
        name: '',
        type: '',
        defaultValue: ''
      }
      this.pipeline.formParams.params.push(obj)
      console.log('======this.pieline', this.pipeline)
      // this.$set(this.pipeline.formParams.params, 0, obj)
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
    tableClusterEnv
  },
  created() { },
  mounted() {
    this.$nextTick(() => {
      console.log('=========pipeline', this.pipeline)
      this.getYarnAccountArr()
      this.getClusterArr()
      this.getRunEnvArr()
      let postData = {}
      postData.pageNum = 1
      postData.pageSize = 1000
      ajaxGetConn(postData).then(res => {
        if (res.data.status == 'ok') {
          this.runConnArr = [].concat(res.data.data.list)
        }
      })
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
