<template>
  <div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="24">
        <Card>
          <Row>
            <Col span="12">
              <strong>{{ changeHistoryName }}</strong>
              <i-select
                v-model="changeHistoryVersion"
                size="small"
                placeholder="请选择版本"
                style="width: 120px"
              >
                <i-option
                  v-for="item in changeHistoryVersionList"
                  :key="item.id"
                  :value="item.id"
                >{{ item.version }}</i-option>
              </i-select>
            </Col>
            <Col span="12" style="text-align: right;">
              <i-form
                ref="searchForm"
                :model="searchForm"
                inline
                label-position="right"
                :label-width="searchWidth"
              >
                <Form-item label="版本比较" style="text-align: left;">
                  <i-select
                    v-model="searchForm.versonOne"
                    size="small"
                    placeholder="请选择版本"
                    style="width: 120px"
                  >
                    <i-option
                      v-for="item in changeHistoryVersionList"
                      :key="item.id"
                      :value="item.id"
                    >{{ item.version }}</i-option>
                  </i-select>
                  <i-select
                    v-model="searchForm.versionTwo"
                    size="small"
                    placeholder="请选择版本"
                    style="width: 120px"
                  >
                    <i-option
                      v-for="item in changeHistoryVersionList"
                      :key="item.id"
                      :value="item.id"
                    >{{ item.version }}</i-option>
                  </i-select>
                </Form-item>
                <Form-item label-width="10">
                  <Button type="primary" size="small" @click="compare()">比较</Button>
                  <Button type="success" size="small" @click="back">返回</Button>
                </Form-item>
              </i-form>
            </Col>
          </Row>
          <div class="wrapper">
            <Table :columns="tableTitle" :data="getTableData" border>
              <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
              </template>
            </Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page :total="tableData.length" show-total show-elevator @on-change="pageChange" />
            </div>
          </div>
        </Card>
      </i-col>
    </Row>
    <Modal
      v-model="modal1"
      fullscreen
      title="版本比较"
      @on-ok="ok"
      @on-cancel="cancel"
      @on-visible-change="change('formValidate')"
    >
      <Row :gutter="20">
        <Col span="12">
          <strong>版本号：</strong><span>v1</span><br />
          <Table :columns="compareTableTitle" :data="getLeftTableData" border>
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
          </Table>
        </Col>
        <Col span="12">
          <strong>版本号：</strong><span>v2</span><br />
          <Table :columns="compareTableTitle" :data="getRightTableData" border>
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
          </Table>
        </Col>
      </Row>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'changeManager',
  data() {
    return {
      searchWidth: 80,
      labelWidth: 80,
      searchForm: {
        type: '',
        name: ''
      },
      typeList: [
        {
          id: '1',
          label: '全部'
        },
        {
          id: '2',
          label: '流式'
        },
        {
          id: '3',
          label: '批量'
        }
      ],
      exportLoading: false,
      current: 1,
      size: 10,
      tableTitle: [
        {
          // type: "index",
          title: '序号',
          width: 60,
          align: 'center',
          render: (h, params) => {
            console.log('params======', params)
            return h(
              'span',
              +params.index + 1 + (this.current - 1) * this.size
            )
          }
        },
        {
          title: '数据名称',
          key: 'name',
          width: '120'
        },
        {
          title: '数据版本',
          key: 'version',
          width: '100'
        },
        {
          title: '字段名称',
          key: 'fieldName',
          width: '150'
        },
        {
          title: '字段类型',
          key: 'fieldType',
          width: '120'
        },
        {
          title: '变更类型',
          key: 'changeType',
          width: '120'
        },
        {
          title: '初次时间',
          key: 'firstTime',
          width: '160'
        },
        {
          title: '变更时间',
          key: 'changeTime',
          width: '160'
        },
        {
          title: '变更人',
          key: 'changeUser',
          width: '120'
        }
      ],
      tableData: [
        {
          name: 'pipeline1',
          version: 'v1',
          fieldName: 'kafkaname',
          fieldType: 'kabka',
          changeType: 'hbase',
          firstTime: '2020-06-04 16:21:12',
          changeTime: '2020-06-04 16:50:12',
          changeUser: 'admin'
        },
        {
          name: 'pipeline2',
          version: 'v2',
          fieldName: 'habsename',
          fieldType: 'hbase',
          changeType: 'kafka',
          firstTime: '2020-06-04 16:21:12',
          changeTime: '2020-06-04 16:50:12',
          changeUser: 'admin'
        }
      ],
      compareTableTitle: [
        {
          // type: "index",
          title: '序号',
          width: 60,
          align: 'center',
          render: (h, params) => {
            console.log('params======', params)
            return h(
              'span',
              +params.index + 1 + (this.current - 1) * this.size
            )
          }
        },
        {
          title: '数据名称',
          key: 'name',
          width: '100'
        },
        {
          title: '数据版本',
          key: 'version',
          width: '100'
        },
        {
          title: '字段名称',
          key: 'fieldName',
          width: '150'
        },
        {
          title: '字段类型',
          key: 'fieldType',
          width: '120'
        },
        {
          title: '变更类型',
          key: 'changeType',
          width: '120'
        },
        {
          title: '初次时间',
          key: 'firstTime',
          width: '160'
        },
        {
          title: '变更时间',
          key: 'changeTime',
          width: '160'
        },
        {
          title: '变更人',
          key: 'changeUser',
          width: '120'
        }
      ],
      getLeftTableData: [
        {
          name: 'pipeline1',
          version: 'v1',
          fieldName: 'kafkaname',
          fieldType: 'kabka',
          changeType: 'hbase',
          firstTime: '2020-06-04 16:21:12',
          changeTime: '2020-06-04 16:50:12',
          changeUser: 'admin'
        },
        {
          name: 'pipeline2',
          version: 'v2',
          fieldName: 'habsename',
          fieldType: 'hbase',
          changeType: 'kafka',
          firstTime: '2020-06-04 16:21:12',
          changeTime: '2020-06-04 16:50:12',
          changeUser: 'admin'
        }
      ],
      getRightTableData: [
        {
          name: 'pipeline3',
          version: 'v1',
          fieldName: 'kafkaname',
          fieldType: 'kabka',
          changeType: 'hbase',
          firstTime: '2020-06-04 16:21:12',
          changeTime: '2020-06-04 16:50:12',
          changeUser: 'admin'
        },
        {
          name: 'pipeline4',
          version: 'v2',
          fieldName: 'habsename',
          fieldType: 'hbase',
          changeType: 'kafka',
          firstTime: '2020-06-04 16:21:12',
          changeTime: '2020-06-04 16:50:12',
          changeUser: 'admin'
        }
      ],
      modal1: false,
      formValidate: {
        name: '',
        type: '',
        cluster: '',
        user: '',
        createTime: '',
        label: '',
        application: '',
        changeHistory: ''
      },
      changeHistoryName: '',
      changeHistoryVersion: 3,
      changeHistoryVersionList: [
        {
          version: 'v1',
          id: 1
        },
        {
          version: 'v2',
          id: 2
        },
        {
          version: 'v3',
          id: 3
        }
      ]
    }
  },
  computed: {
    getTableData() {
      let arr = []
      arr = this.tableData.filter((item, index) => {
        let rule1 = index >= (this.current - 1) * this.size
        let rule2 = index < this.current * this.size
        return rule1 && rule2
      })
      return arr
    }
  },
  methods: {
    back() {
      this.$router.push({
        path: 'administrationManager'
      })
    },
    compare () {
      this.modal1 = true
    },
    pageChange(val) {
      this.current = +val
    },
    change(name) {
      // this.handleReset(name);
    },
    handleReset(name) {
      this.$refs[name].resetFields()
    },
    getFormData() {
      let postData = {
        ppName: '',
        ppStatus: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      return postData
    },
    ok() {
      console.log('this.formValidate', this.formValidate)
      let postData = this.getFormData()

      this.tableData.push(postData)
      this.handleReset('formValidate')
    },
    cancel() {
      this.handleReset('formValidate')
    }
  },
  created() { },
  activated() {
    this.changeHistoryName = this.$route.query.name
    this.tableData.name = this.$route.query.name
    this.tableData.version = this.$route.query.version
    if (this.$route.query.version === 'v1') {
      this.changeHistoryVersion = 1
    } else if (this.$route.query.version === 'v2') {
      this.changeHistoryVersion = 2
    } else if (this.$route.query.version === 'v3') {
      this.changeHistoryVersion = 3
    }
  },
  destroyed() {
    this.changeHistoryName = ''
    this.changeHistoryVersion = ''
    this.tableData.name = ''
    this.tableData.version = ''
  },
  mounted() {
    this.changeHistoryName = this.$route.query.name
    this.tableData.name = this.$route.query.name
    this.tableData.version = this.$route.query.version
    if (this.$route.query.version === 'v1') {
      this.changeHistoryVersion = 1
    } else if (this.$route.query.version === 'v2') {
      this.changeHistoryVersion = 2
    } else if (this.$route.query.version === 'v3') {
      this.changeHistoryVersion = 3
    }
  }
}
</script>
