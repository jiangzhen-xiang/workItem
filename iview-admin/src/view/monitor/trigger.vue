<template>
  <div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="24">
        <Card>
          <p slot="title" style="height:30px;"></p>
          <div class="btnWrapper" slot="extra" style="left:16px;">
            <ButtonGroup>
              <Button @click="modelShow('modal1')">
                <Icon type="ios-ios-plus" />
                增加
              </Button>
            </ButtonGroup>
          </div>
          <div class="wrapper">
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

    <Modal
      v-model="modal1"
      title="增加Pipeline"
      @on-ok="ok"
      @on-cancel="cancel"
      @on-visible-change="change('formValidate')"
    >
      <div class="formWrapper">
        <Form
          ref="formValidate"
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="80"
        >
          <FormItem label="名称" prop="ppName">
            <Input v-model="formValidate.ppName" placeholder="请输入"></Input>
          </FormItem>
          <!-- <FormItem label="E-mail" prop="mail">
            <Input
              v-model="formValidate.mail"
              placeholder="Enter your e-mail"
            ></Input>
          </FormItem> -->
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
          </FormItem> -->
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
import excel from '@/libs/excel'
let pie1 = require('@/assets/images/pie1.png')
let pie2 = require('@/assets/images/pie2.png')
let pie3 = require('@/assets/images/pie3.png')
export default {
  name: 'chart',
  data () {
    return {
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
          title: 'pipeline名称',
          key: 'ppName',
          width: '120',
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
                      this.$router.push({
                        name: 'detail',
                        params: params.row
                      })
                    }
                  }
                },
                params.row.ppName
              )
            ])
          }
        },
        {
          title: '状态',
          key: 'ppStatus',
          width: 120
        },
        {
          title: 'Action',
          key: 'action',

          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '消息提示',
                        closable: true,
                        content: '删除该数据后将不可恢复，是否删除?',
                        loading: true,
                        onOk: () => {
                          this.tableData.splice(
                            +params.index + this.size * (this.current - 1),
                            1
                          )
                          this.modal1 = false
                        }
                      })
                    }
                  }
                },
                '删除'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                },
                '编辑pipeline'
              )
            ])
          }
        }
      ],

      tableData: [
        {
          ppName: 'OpType',
          ppStatus: 2,
          category3: 3
        },
        {
          ppName: 'OpType333',
          ppStatus: 2,
          category3: 3
        },
        {
          ppName: 'OpType',
          ppStatus: 2,
          category3: 3
        },
        {
          ppName: 'OpType333',
          ppStatus: 2,
          category3: 3
        },
        {
          ppName: 'OpType',
          ppStatus: 2,
          category3: 3
        },
        {
          ppName: 'OpType333',
          ppStatus: 2,
          category3: 3
        },
        {
          ppName: 'OpType',
          ppStatus: 2,
          category3: 3
        },
        {
          ppName: 'OpType333',
          ppStatus: 2,
          category3: 3
        },
        {
          ppName: 'OpType',
          ppStatus: 2,
          category3: 3
        },
        {
          ppName: 'OpType333',
          ppStatus: 2,
          category3: 3
        },
        {
          ppName: 'OpType',
          ppStatus: 2,
          category3: 3
        },
        {
          ppName: 'OpType333',
          ppStatus: 2,
          category3: 3
        }
      ],
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
    pageChange (val) {
      this.current = +val
    },
    change (name) {
      // this.handleReset(name);
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    modelShow (k) {
      this[k] = true
    },
    getFormData () {
      let postData = {
        ppName: '',
        ppStatus: ''
      }
      for (let k in postData) {
        postData[k] = this.formValidate[k]
      }
      return postData
    },
    ok () {
      console.log('this.formValidate', this.formValidate)
      let postData = this.getFormData()

      this.tableData.push(postData)
      this.handleReset('formValidate')
    },
    cancel () {
      this.handleReset('formValidate')
    },
    init () {
      let option = {
        backgroundColor: '#fff',
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'none',
            symbolSize: 100,
            roam: true,
            label: {
              show: true,
              position: 'top'
            },
            symbol: (a, b) => {
              console.log('aaaaa====', a, b, pie1)
              let img = 'image://'

              console.log('img====', b.data.img)
              switch (b.data.img) {
                case 2:
                  img += pie2
                  break
                case 3:
                  img += pie3
                  break
                default:
                  img += pie1
                  break
              }
              return img
            },
            edgeSymbol: ['circle'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20
            },
            data: [
              {
                name: 'Kafka Topic-A',
                img: 1,
                x: 10,
                y: 250
              },
              {
                name: '1',
                img: 2,
                x: 150,
                y: 250,
                label: {
                  show: false,
                  position: 'top'
                }
              },
              {
                name: 'HBase Table-B ',
                img: 3,
                x: 290,
                y: 250
              }
            ],
            // links: [],
            links: [
              {
                source: 'Kafka Topic-A',
                target: '1'
              },
              {
                source: '1',
                target: 'HBase Table-B '
              }
            ],
            lineStyle: {
              color: '#23cdfd',
              opacity: 3.9,
              width: 2,
              curveness: 0
            }
          }
        ]
      }
      let myChart = this.$echarts.init(
        document.getElementById('chartWarraper')
      )
      myChart.setOption(option)
    },
    exportExcel () {
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
  created () {},
  mounted () {
  }
}
</script>
