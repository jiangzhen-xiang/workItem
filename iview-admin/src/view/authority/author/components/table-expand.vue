<template>
  <div>
    <Form
      ref="formValidate"
      :model="row"
      :rules="ruleValidate"
      :label-width="80"
      inline
    >
      <FormItem label="任务名称" prop="jobName" style="width: 30%">
        <Input v-model="row.jobName" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="entryClass" prop="entryClass" style="width: 30%">
        <Input v-model="row.entryClass" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="programArgs" prop="programArgs" style="width: 30%">
        <Input v-model="row.programArgs" placeholder="entryClass"></Input>
      </FormItem>
      <FormItem label="最大并行度" prop="parallelism" style="width: 30%">
        <Input v-model="row.parallelism" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="job内存(MB)" prop="jobMem" style="width: 30%">
        <Input v-model="row.jobMem" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="task内存(MB)" prop="taskMem" style="width: 30%">
        <Input v-model="row.taskMem" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="runUser" prop="runUser" style="width: 30%">
        <Input v-model="row.runUser" placeholder="请输入"></Input>
      </FormItem>
      <FormItem label="运行模式" prop="runMode" style="width: 30%">
        <Select v-model="row.runMode" placeholder="请选择">
          <Option
            v-for="(item, index) in modeArr"
            :value="item.value"
            :label="item.label"
            :key="index"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="运行集群" prop="cluster" style="width: 30%">
        <Select v-model="row.cluster" placeholder="请选择">
          <Option
            v-for="(item, index) in clusterArr"
            :value="item.name"
            :label="item.name"
            :key="index"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="运行环境" prop="env" style="width: 30%">
        <Select v-model="row.env" placeholder="请选择">
          <Option
            v-for="(item, index) in envArr"
            :value="item.name"
            v-show="item.clusterName == row.cluster"
            :label="item.name"
            :key="index"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="flink连接" prop="flinkCon" style="width: 30%">
        <Select v-model="row.flinkCon" placeholder="请选择">
          <Option
            v-for="(item, index) in flinkArr"
            v-show="item.clusterName == row.cluster"
            :value="item.connName"
            :label="item.connName"
            :key="index"
            >{{ item.connName }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="yarn连接" prop="yarnCon" style="width: 30%">
        <Select v-model="row.yarnCon" placeholder="请选择" transfer filter>
          <Option
            v-for="(item, index) in yarnArr"
            v-show="item.clusterName == row.cluster"
            :value="item.connName"
            :label="item.connName"
            :key="index"
            >{{ item.connName }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="account" prop="account" style="width: 30%">
        <Select v-model="row.account" placeholder="请选择" transfer filter>
          <Option
            v-for="(item, index) in accountArr"
            v-show="item.clusterName == row.cluster"
            :value="item.name"
            :label="item.name"
            :key="index"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="队列" prop="queue" style="width: 30%">
        <Input v-model="row.queue" placeholder="请输入"></Input>
      </FormItem>
      <FormItem style="width: 100%; text-align: right">
        <Button type="primary" @click="handleSubmit('formValidate')"
          >提交</Button
        >
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { getLink, ajaxGetConn, ajaxJarSubmit } from '@/api/link.js'
import { ajaxGetEnv } from '@/api/env.js'
import { userFunc } from '@/api/user1.js'

export default {
  props: {

    row: Object
  },
  data () {
    return {
      modeArr: [{
        label: 'yarn',
        value: 'yarn'
      }],
      clusterArr: [],
      envArr: [],
      yarnArr: [],
      accountArr: [],
      flinkArr: []
    }
  },
  methods: {
    getClusterArr () {
      let postData = {
        pageSize: 1000,
        pageNum: 1
      }
      getLink(postData).then(res => {
        if (res.data.status == 'ok') {
          this.clusterArr = res.data.data.list
        }
      })
    },
    handleClusterChange (val) {
      let postData = {
        pageSize: 100,
        pageNum: 1

      }
      ajaxGetEnv(postData).then(res => {
        if (res.data.status == 'ok') {
          this.envArr = res.data.data.list
        }
      })
    },
    handleConectChange (val) {
      let postData = {
        pageSize: 100,
        pageNum: 1

      }
      ajaxGetConn(postData).then(res => {
        if (res.data.status == 'ok') {
          this.flinkArr = res.data.data.list
          this.yarnArr = res.data.data.list
        }
      })
    },
    handleSubmit (name) {
      ajaxJarSubmit(this.row).then(res => {
        console.log('=========row', this.row)
        if (res.data.status == 'ok') {
          this.$Message.success('提交成功')
        }
      })
    },
    handleAccountChange () {
      let postData = {
        pageSize: 100,
        pageNum: 1
      }
      userFunc.getTableDataAai(postData).then(res => {
        if (res.data.status == 'ok') {
          this.accountArr = res.data.data.list
        }
      })
    }
  },
  mounted () {
    this.getClusterArr()
    this.handleClusterChange()
    this.handleConectChange()
    this.handleAccountChange()
  }
}
</script>
