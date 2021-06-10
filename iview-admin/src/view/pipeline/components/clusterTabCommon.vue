
<template>
  <div>
    <div style="display:none;">{{getClusterValue}}</div>
    <Form ref="formLink" :model="nodeData.formLink" :rules="ruleValidate" :label-width="80">
      <FormItem label="集群" prop="colony">
        <Row>
          <Col span="22">
            <Select
              v-model="nodeData.formLink.colony"
              placeholder="请输入"
              transfer
              @on-change="changeColony"
            >
              <Option
                v-for="(item,index) in colonyAndCommonArr"
                :value="item.name"
                :label="item.name"
                :key="item.id"
              >{{item.name}}</Option>
            </Select>
          </Col>
          <Col span="2" style="text-align:right;" class="btnAddWrapper">
            <Button
              type="primary"
              @click="handleAddDataSetName"
              icon="ios-add"
              disabled
              style="font-size:24px;line-height:16px;"
            ></Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="数据连接" prop="link">
        <Row>
          <Col span="22">
            <Select v-model="nodeData.formLink.link" placeholder="请输入" filterable>
              <Option
                v-for="(item,index) in linkArr"
                :value="item.connName"
                :label="item.connName"
                :key="item.connId"
              >{{item.connName}}</Option>
            </Select>
          </Col>
          <Col span="2" style="text-align:right;" class="btnAddWrapper">
            <Button
              type="primary"
              @click="handleAddDataSetName"
              icon="ios-add"
              style="font-size:24px;line-height:16px;"
            ></Button>
          </Col>
        </Row>
      </FormItem>

      <FormItem label="主题" prop="datatopic">
        <Input v-model="nodeData.formLink.datatopic" placeholder="请输入"></Input>
      </FormItem>

      <FormItem label="账号" prop="username" v-if="nodeData.formLink.link != 'restmq'">
        <Row>
          <Col span="18">
            <Select v-model="nodeData.formLink.username" placeholder="请输入" transfer filterable>
              <Option
                v-for="(item,index) in userArr"
                :value="item.name"
                :label="item.name"
                :key="item.id"
              >{{item.name}}</Option>
            </Select>
          </Col>
          <Col span="4" style="text-align:right;" class="btnAddWrapper">
            <Button type="primary" @click="handleSetUsernameToColony">设置当前账号为该集群账号</Button>
          </Col>
        </Row>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { getLink, ajaxGetConn } from '@/api/link.js'
import { userFunc } from '@/api/user1.js'
export default {
  name: 'clusterTabCommon',
  props: ['nodeData'],
  data() {
    return {
      userArr: [],
      linkArr: [],
      colonyAndCommonArr: []
    }
  },
  computed: {

    getClusterValue() {
      let val = this.nodeData.formLink.colony
      this.linkArr = []
      this.userArr = []
      this.getCurLinkArr(val)
      this.getCurUserArr(val)
      return this.nodeData.formLink.colony
    }

  },
  components: {

  },
  activated() {

  },
  methods: {
    handleSetUsernameToColony() {
      this.$Message.success('设置当前账号成功')
    },
    handleAddDataSetName() {
      // 做跳转用

      this.value3 = true
    },
    changeColony(val) {
      this.getCurLinkArr(val)
      this.getCurUserArr(val)
    },
    initFormLinkArr() {
      let postData = {}
      let that = this
      postData.pageSize = 1000
      postData.pageNum = 1

      getLink(postData).then(res => {
        if (res.data.status == 'ok') {
          that.colonyAndCommonArr = [].concat(res.data.data.list)
        }
      })
    },
    getCurUserArr() {
      let postData = {}
      let that = this
      postData.pageSize = 1000
      postData.pageNum = 1
      postData.connType = this.nodeData.type
      postData.clusterName = this.nodeData.formLink.colony
      userFunc.getTableDataAai(postData).then(res => {
        if (res.data.status == 'ok') {
          that.userArr = [].concat(res.data.data.list)
        }
      })
    },
    getCurLinkArr() {
      let postData = {}
      let that = this
      postData.pageSize = 1000
      postData.pageNum = 1
      postData.connType = this.nodeData.type
      postData.clusterName = this.nodeData.formLink.colony
      ajaxGetConn(postData).then(res => {
        if (res.data.status == 'ok') {
          that.linkArr = [].concat(res.data.data.list)
        }
      })
    }
  },
  beforeCreate() {

  },
  destroyed() {

  },
  watch: {

  },
  created() {

  },
  mounted() {
    this.initFormLinkArr()
  }
}
</script>
