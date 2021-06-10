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
                <Form-item label="pipeline名称" prop="name">
                  <i-select
                    v-model="searchForm.type"
                    size="small"
                    placeholder="请选择pipeline名称"
                    style="width: 200px"
                  >
                    <i-option
                      v-for="item in typeList"
                      :key="item.id"
                      :value="item.id"
                    >{{ item.label }}</i-option>
                  </i-select>
                </Form-item>
              </i-form>
            </i-col>
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
  </div>
</template>
<script>
export default {
  name: 'administrationManager',
  data() {
    return {
      searchWidth: 80,
      searchForm: {
        name: ''
      },
      typeList: [
        {
          id: '1',
          label: 'pipeline1'
        },
        {
          id: '2',
          label: 'pipeline2'
        },
        {
          id: '3',
          label: 'pipeline13'
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
      modai1Title: false,
      formValidate: {
        name: '',
        type: '',
        cluster: '',
        user: '',
        createTime: '',
        label: '',
        application: '',
        changeHistory: ''
      }
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
    }
  },
  created() { },
  mounted() {
  }
}
</script>
