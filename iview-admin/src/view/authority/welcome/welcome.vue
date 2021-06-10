<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="租户申请单前3名对比"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="授权表前3名授权租户分布"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <!-- <Card shadow>
        <example style="height: 310px;"/>
      </Card> -->
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'

import { ajaxGetUngrantAppy, ajaxGetGrantAppy, ajaxGetTopGrantTenant, ajaxGetTopGrantTable } from '@/api/welcome.js'

// import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar
    // Example
  },
  data () {
    return {
      inforCardData: [
        { title: '待授权申请单数', icon: 'md-person-add', count: 0, color: '#2d8cf0' },
        { title: '已授权申请单数', icon: 'md-checkmark', count: 0, color: '#19be6b' },
        { title: '当日申请单数', icon: 'md-help-circle', count: 0, color: '#ff9900' },
        { title: '当日授权数', icon: 'md-share', count: 0, color: '#ed3f14' },
        { title: '新增集群', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
        { title: '新增用户', icon: 'md-map', count: 14, color: '#9A66E4' }
      ],
      pieData: [
        { value: 0, name: '租户1' },
        { value: 0, name: '租户2' },
        { value: 0, name: '租户3' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ],
      barData: {
        tab1: [
          {
            '租户1': 105
          },
          {
            '租户2': 200
          }
        ],
        tab2: [
          {
            '租户3': 100
          },
          {
            '租户4': 200
          }
        ],
        tab3: [
          {
            '租户5': 100
          },
          {
            '租户6': 300
          }
        ]
      }

    }
  },
  mounted () {
    let that = this
    ajaxGetUngrantAppy().then(res => {
      this.inforCardData[0].count = res.data.ungrantAppyCount
    })
    ajaxGetGrantAppy().then(res => {
      this.inforCardData[1].count = res.data.grantAppyCount
    })
    ajaxGetTopGrantTenant({ queryCount: 3 }).then(res => {
      that.pieData = []
      res.data.map(item => {
        let obj = {}
        Object.keys(item).map(k => {
          obj.value = item[k]
          obj.name = k
        })
        that.pieData.push(obj)
      })
    })
    ajaxGetTopGrantTable({ queryTableCount: 3, queryTenantCount: 3 }).then(res => {
      that.barData = {}
      res.data.map(item => {
        let obj = {}
        Object.keys(item).map(k => {
          obj[k] = item[k]
        })
        that.barData = JSON.parse(JSON.stringify(obj))
      })
    })
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
