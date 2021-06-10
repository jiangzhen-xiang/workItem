<template>
  <div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="24">
        <Card>
          <Row>
            <i-col span="24">
              <i-form
                ref="searchForm"
                :model="searchForm"
                inline
                label-position="right"
                :label-width="searchWidth"
              >
                <Form-item>
                  <Input v-model="searchForm.name" size="small" placeholder="请输入查找内容" style="width: 200px" />
                </Form-item>
                <Form-item>
                  <Button type="primary" size="small" @click="search()">搜索</Button>
                </Form-item>
              </i-form>
            </i-col>
          </Row>
          <div class="wrapper" v-show="tableControl === true">
            <Table :columns="tableTitle" :data="getTableData" border></Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page
                :total="tableData.length"
                show-total
                show-elevator
                @on-change="pageChange"
              />
            </div>
          </div>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
export default {
  name: 'textSearchManager',
  data () {
    return {
      tableControl: false,
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
          key: 'dataName',
          width: '120'
        },
        {
          title: '数据版本',
          key: 'version',
          width: '120'
        },
        {
          title: 'pipeline运行ID',
          key: 'id',
          width: '120'
        },
        {
          title: 'pipeline名称',
          key: 'pipelineName',
          width: '120'
        },
        {
          title: '应用用户',
          key: 'username',
          width: '120'
        },
        {
          title: '开始时间',
          key: 'startTime',
          width: '160'
        },
        {
          title: '结束时间',
          key: 'endTime',
          width: '160'
        },
        {
          title: '记录数',
          key: 'recordNumber',
          width: '120'
        },
        {
          title: '数据量',
          key: 'dataNumber',
          width: '120'
        }
      ],
      tableData: [
        {
          dataName: 'pipeline',
          version: 'v1',
          id: '1',
          pipelineName: 'pipeline1',
          username: 'admin',
          startTime: '2020-06-04 14:00:12',
          endTime: '2020-06-04 14:00:12',
          recordNumber: '2',
          dataNumber: '10'
        },
        {
          dataName: 'pipeline',
          version: 'v1',
          id: '1',
          pipelineName: 'pipeline1',
          username: 'admin',
          startTime: '2020-06-04 14:00:12',
          endTime: '2020-06-04 14:00:12',
          recordNumber: '2',
          dataNumber: '10'
        }
      ],
      modal1: false,
      searchForm: {
        name: ''
      }
    }
  },
  computed: {
    getTableData () {
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
    search () {
      this.tableControl = true
    }
  },
  created () {},
  mounted () {
  }
}
</script>
