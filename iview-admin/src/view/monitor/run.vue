<template>
  <div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="24">
        <Card>
          <div id="showMore">
            <i-form
              ref="searchForm"
              :model="searchForm"
              inline
              label-position="right"
              label-width="42"
            >
              <Form-item label="类型" prop="type">
                <i-select v-model="searchForm.type" placeholder="请选择类型" style="width: 120px">
                  <i-option
                    v-for="item in typeList"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.label }}</i-option>
                </i-select>
              </Form-item>
              <Form-item label="集群" prop="colony">
                <Select
                  v-model="searchForm.colony"
                  filterable
                  multiple
                  placeholder="请输入集群"
                  style="width: 120px"
                >
                  <Option
                    v-for="item in colonyList"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.label }}</Option>
                </Select>
              </Form-item>
              <Form-item label="状态" prop="status">
                <i-select v-model="searchForm.status" placeholder="请选择状态" style="width: 120px">
                  <i-option
                    v-for="item in statusList"
                    :key="item.id"
                    :value="item.id"
                  >{{ item.label }}</i-option>
                </i-select>
              </Form-item>
              <Form-item label="时间" prop="time">
                <Date-picker
                  v-model="searchForm.time"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="选择日期和时间"
                  style="width: 240px"
                ></Date-picker>
              </Form-item>
              <Form-item label-width="0">
                <i-button type="primary" icon="ios-search" @click="searchFunc()">搜索</i-button>
              </Form-item>
              <Form-item label-width="0">
                <i-button
                  v-if="showMoreControl==false"
                  type="primary"
                  icon="md-arrow-dropright"
                  @click="openMore()"
                >展开</i-button>
                <i-button
                  v-if="showMoreControl==true"
                  type="primary"
                  icon="md-arrow-dropdown"
                  @click="closeMore()"
                >收缩</i-button>
              </Form-item>
              <br />
              <Form-item label="名称" prop="name" v-if="showMoreControl === true">
                <Input v-model="searchForm.name" placeholder="请输入pipeline名称" style="width: 120px" />
              </Form-item>
              <Form-item label="标签" prop="label" v-if="showMoreControl === true">
                <Select
                  v-model="searchForm.label"
                  filterable
                  multiple
                  placeholder="请输入标签"
                  style="width: 120px"
                >
                  <Option v-for="item in labelList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                </Select>
              </Form-item>
              <Form-item label="团队" prop="team" v-if="showMoreControl === true">
                <Input v-model="searchForm.team" placeholder="请输入应用团队" style="width: 120px" />
              </Form-item>
              <Form-item label-width="0" v-if="showMoreControl === true">
                <i-button type="primary" @click="handleReset('searchForm')">清空</i-button>
              </Form-item>
            </i-form>
          </div>
          <div class="wrapper">
            <Row id="doThingBtn" style="margin:0px 0px 10px 0px;">
              <Col span="24">
                <Button type="info" :disabled="disabledControl === false">重新运行</Button>
                <Button type="success" :disabled="disabledControl === false">重新开始</Button>
                <Button type="warning" :disabled="disabledControl === false">取消</Button>
                <Button type="error" :disabled="disabledControl === false">停止</Button>
              </Col>
            </Row>
            <Table
              ref="selection"
              :columns="tableTitle"
              :data="tableData"
              tooltip-theme="dark"
              border
              @on-selection-change="handleRowChange"
            ></Table>
            <div class="page" style="text-align:right;padding-top:10px;">
              <Page :total="total" show-total show-elevator @on-change="pageChange" />
            </div>
          </div>
        </Card>
      </i-col>
    </Row>

    <Modal
      v-model="modal1"
      title="增加Pipeline"
      @on-ok="ok"
      @on-cancel="cancel"
      @on-visible-change="change('formValidate')"
    >
      <div class="formWrapper">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="名称" prop="ppName">
            <Input v-model="formValidate.ppName" placeholder="请输入" />
          </FormItem>
          <!-- <FormItem label="E-mail" prop="mail">
            <Input
              v-model="formValidate.mail"
              placeholder="Enter your e-mail"
            ></Input>
          </FormItem>-->
          <FormItem label="状态" prop="ppStatus">
            <Select v-model="formValidate.ppStatus" placeholder="请选择">
              <Option value="beijing">启动中</Option>
              <Option value="shanghai">成功</Option>
              <Option value="shenzhen">失败</Option>
            </Select>
          </FormItem>
          <!-- <FormItem label="Date">
            <Row>
              <Col span="11">
                <FormItem prop="date">
                  <DatePicker
                    type="date"
                    placeholder="Select date"
                    v-model="formValidate.date"
                  ></DatePicker>
                </FormItem>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <FormItem prop="time">
                  <TimePicker
                    type="time"
                    placeholder="Select time"
                    v-model="formValidate.time"
                  ></TimePicker>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="Gender" prop="gender">
            <RadioGroup v-model="formValidate.gender">
              <Radio label="male">Male</Radio>
              <Radio label="female">Female</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="Hobby" prop="interest">
            <CheckboxGroup v-model="formValidate.interest">
              <Checkbox label="Eat"></Checkbox>
              <Checkbox label="Sleep"></Checkbox>
              <Checkbox label="Run"></Checkbox>
              <Checkbox label="Movie"></Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="Desc" prop="desc">
            <Input
              v-model="formValidate.desc"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="Enter something..."
            ></Input>
          </FormItem>-->
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
import { ajaxGetMonitorList } from '@/api/monitor.js'
// import excel from '@/libs/excel'
// let pie1 = require('@/assets/images/pie1.png')
// let pie2 = require('@/assets/images/pie2.png')
// let pie3 = require('@/assets/images/pie3.png')
export default {
  name: 'chart',
  data() {
    return {
      total: 1,
      showMoreControl: false,
      disabledControl: false,
      searchForm: {
        type: '',
        time: [],
        status: '',
        team: '',
        colony: '',
        name: '',
        label: ''
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
      statusList: [
        {
          id: '1',
          label: '运行中'
        },
        {
          id: '2',
          label: '成功'
        },
        {
          id: '3',
          label: '失败'
        },
        {
          id: '4',
          label: '已取消'
        },
        {
          id: '5',
          label: '已暂停'
        },
        {
          id: '6',
          label: '等待'
        }
      ],
      labelList: [
        {
          id: '1',
          label: '标签1'
        },
        {
          id: '2',
          label: '标签2'
        },
        {
          id: '3',
          label: '标签3'
        }
      ],
      colonyList: [
        {
          id: '1',
          label: '集群1'
        },
        {
          id: '2',
          label: '集群2'
        },
        {
          id: '3',
          label: '集群3'
        }
      ],
      exportLoading: false,
      current: 1,
      size: 10,
      tableTitle: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'dataflow_name',
          width: '200',
          tooltip: true,
          eclipse: true,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      console.log('=====fock', params.row)
                      this.$router.push({
                        path: 'details',
                        query: {
                          ruleId: params.row.dataflow_documentId,
                          type: params.row.dataflow_name
                        }
                      })
                    }
                  }
                },
                params.row.dataflow_name
              )
            ])
          }
        },
        {
          title: '类型',
          key: 'dataflow_type',
          tooltip: true,
          eclipse: true,
          width: '100'
          // render: (h, params) => {
          //   if (params.row.PIPELINETYPE === '1') {
          //     return h('span', '批量')
          //   } else if (params.row.PIPELINETYPE === '2') {
          //     return h('span', '流式')
          //   }
          // }
        },
        {
          title: '开始时间',
          key: 'start_time',
          tooltip: true,
          eclipse: true,
          width: '140'
        },
        {
          title: '结束时间',
          key: 'end_time',
          tooltip: true,
          eclipse: true,
          width: '140'
        },
        {
          title: '持续时间',
          key: 'duration',
          tooltip: true,
          eclipse: true,
          width: '100'
        },
        // {
        //   title: '应用',
        //   key: 'APPLICATIONGROUP',
        //   width: '140'
        // },
        {
          title: '集群',
          key: 'cluster',
          width: '140'
        },
        // {
        //   title: '触发',
        //   key: 'TRIGGEREDBY',
        //   width: '140'
        // },
        {
          title: '状态',
          key: 'state',
          width: '100'
        },
        {
          title: '运行模式',
          key: 'mode',
          width: '100'
        },
        // {
        //   title: '参数',
        //   key: 'PARAMETERS',
        //   width: '100'
        // },
        // {
        //   title: '标签',
        //   key: 'ANNOTATIONS',
        //   width: '100'
        // },
        {
          title: '异常',
          key: 'exception',
          tooltip: true,
          eclipse: true,
          width: '100'
        },
        {
          title: '任务id',
          key: 'jobId',
          width: '260'
        }
      ],
      tableData: [],
      modal1: false,
      formValidate: {
        ppName: '',
        mail: '',
        ppStatus: '',
        gender: '',
        interest: [],
        date: '',
        time: '',
        desc: ''
      },
      ruleValidate: {
        ppName: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ],
        // mail: [
        //   {
        //     required: true,
        //     message: "Mailbox cannot be empty",
        //     trigger: "blur"
        //   },
        //   { type: "email", message: "Incorrect email format", trigger: "blur" }
        // ],
        ppStatus: [
          {
            required: true,
            message: '状态不能为空',
            trigger: 'change'
          }
        ]
        // gender: [
        //   { required: true, message: "Please select gender", trigger: "change" }
        // ],
        // interest: [
        //   {
        //     required: true,
        //     type: "array",
        //     min: 1,
        //     message: "Choose at least one hobby",
        //     trigger: "change"
        //   },
        //   {
        //     type: "array",
        //     max: 2,
        //     message: "Choose two hobbies at best",
        //     trigger: "change"
        //   }
        // ],
        // date: [
        //   {
        //     required: true,
        //     type: "date",
        //     message: "Please select the date",
        //     trigger: "change"
        //   }
        // ],
        // time: [
        //   {
        //     required: true,
        //     type: "string",
        //     message: "Please select time",
        //     trigger: "change"
        //   }
        // ],
        // desc: [
        //   {
        //     required: true,
        //     message: "Please enter a personal introduction",
        //     trigger: "blur"
        //   },
        //   {
        //     type: "string",
        //     min: 20,
        //     message: "Introduce no less than 20 words",
        //     trigger: "blur"
        //   }
        // ]
      }
    }
  },
  computed: {

  },
  methods: {
    // 搜索
    searchFunc() {
      this.tableData.filter(item => item.num === 2)
    },
    // 监听列表是否被选中
    handleRowChange(row) {
      if (row.length > 0) {
        this.disabledControl = true
      } else {
        this.disabledControl = false
      }
    },
    // 展开更多搜索条件
    openMore() {
      this.showMoreControl = true
    },
    closeMore() {
      this.showMoreControl = false
    },
    pageChange(val) {
      this.current = +val
      this.handleSearchList()
    },
    change(name) {
      // this.handleReset(name);
    },
    handleReset(name) {
      this.$refs[name].resetFields()
    },
    modelShow(k) {
      this[k] = true
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
    },
    handleSearchList() {
      let postData = {}
      postData.pageSize = this.size
      postData.pageNum = this.current
      ajaxGetMonitorList(postData).then(res => {
        if (res.data.status == 'ok') {
          this.tableData = res.data.data.result_content.map(item => {
            let obj = JSON.parse(item.dataflow_content)
            obj.dataflow_documentId = item.dataflow_documentId
            return obj
          })
          this.total = res.data.data.result_total
        }
      })
    },
    init() {
      this.handleSearchList()
    },
    exportExcel() {
      if (this.tableData.length) {
        this.exportLoading = true
        const params = {
          title: ['一级分类', '二级分类', '三级分类'],
          key: ['category1', 'category2', 'category3'],
          data: this.tableData,
          autoWidth: true,
          filename: '分类列表'
        }
        excel.export_array_to_excel(params)
        this.exportLoading = false
      } else {
        this.$Message.info('表格数据不能为空！')
      }
    }
  },
  created() { },
  mounted() {
    this.init()
  }
}
</script>
