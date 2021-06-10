
<template>
  <div>
    <div>
      <Table
        :loading="loading"
        :columns="tableTitleInspect"
        :data="getTableDataInspect"
        tooltip-theme="dark"
        border
      >
        <template slot-scope="{row,index}" slot="env">
          <Select
            v-model="row.env"
            placeholder="请选择"
            size="small"
            transfer
            @on-change="changePublishEnv(row,index)"
          >
            <Option value="-1" label="集群默认运行环境">集群默认运行环境</Option>
            <Option
              v-for="(env, index) in runEnvArr"
              v-show="env.clusterName == row.cluster"
              :key="index"
              :value="env.name"
              :label="env.name"
            >{{ env.name }}</Option>
          </Select>
        </template>
      </Table>
      <div class="page" style="text-align:right;padding-top:10px;">
        <Page
          :simple="pageSize"
          :total="nodeData.runTime&&nodeData.runTime.clusterUseArr&&nodeData.runTime.clusterUseArr.length||0"
          show-total
          show-elevator
          @on-change="pageChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { ajaxGetEnv } from '@/api/env.js'
export default {
  name: 'tableClusterEnv',
  props: ['nodeData', 'pageSize'],
  data() {
    return {
      runEnvArr: [],
      loading: false,
      current: 1,
      tableTitleInspect: [

        {
          title: '集群名称',
          key: 'cluster',
          eclipse: true,
          tooltip: true

        },
        {
          title: '环境名称',
          key: 'env',
          eclipse: true,
          tooltip: true,
          slot: 'env'

        }

      ]
    }
  },
  computed: {
    getSimple() {
      console.log('======this.size', this.pageSize)
      return !this.pageSize
    },
    getTableDataInspect() {
      let arr = this.nodeData && this.nodeData.runTime && this.nodeData.runTime.clusterUseArr || []
      return arr.slice((this.current - 1) * 10, this.current * 10)
    }

  },
  methods: {
    changePublishEnv(source, index) {
      this.nodeData.runTime.clusterUseArr[index].env = source.env
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
    pageChange(val) {
      this.current = val
    }
  },
  components: {

  },
  created() { },
  mounted() {
    this.getRunEnvArr()
  }
}
</script>
