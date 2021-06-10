<template>
  <div>
    <Tabs value="name1">
      <TabPane label="基本参数" name="name1">
        <div class="tabConten">
          <Form ref="formBasic" :model="formBasic" :rules="ruleValidate" :label-width="80">
            <FormItem label="名称" prop="ppName">
              <Input v-model="formBasic.ppName" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="描述" prop="desc">
              <Input
                v-model="formBasic.desc"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="请输入"
              ></Input>
            </FormItem>
            <FormItem label="并发" prop="concurrency">
              <Input v-model="formBasic.concurrency" placeholder="请输入"></Input>
            </FormItem>
          </Form>
        </div>
      </TabPane>
      <TabPane label="参数" name="name2">
        <Form ref="formParam" :model="formParam" :rules="ruleValidate" :label-width="80">
          <div style="border:solid 1px #ddd;border-radius:5px;padding:5px;">
            <div class="btnWrapper" style="text-align:right;padding:5px 0;">
              <label class="ivu-form-item-label" style="width: 80px;">参数增加</label>
              <Button type="default" @click="handleAddParams">增加</Button>
            </div>
            <div class="itemWrapper">
              <Table :loading="loading" :columns="tableTitle" :data="formParam.params" border>
                <template slot-scope="{ row }" slot="type">
                  <Select v-model="row.url" transfer>
                    <Option
                      v-for="item in typeArr"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.name }}</Option>
                  </Select>
                </template>
              </Table>
              <div class="page" style="text-align:right;padding-top:10px;">
                <Page
                  :total="formParam.params.length"
                  show-total
                  show-elevator
                  @on-change="pageChange"
                />
              </div>
            </div>
          </div>
        </Form>
      </TabPane>
      <TabPane label="变量" name="name3">
        <Form ref="formVariable" :model="formVariable" :rules="ruleValidate" :label-width="80">
          <div style="border:solid 1px #ddd;border-radius:5px;padding:5px;">
            <div class="btnWrapper" style="text-align:right;padding:5px 0;">
              <label class="ivu-form-item-label" style="width: 80px;">标签增加</label>
              <Button type="default" @click="handleAddVariable">增加</Button>
            </div>
            <div class="itemWrapper">
              <FormItem
                v-for="(item, index) in formVariable.variables"
                :key="index"
                label="标签"
                :prop="item.name"
              >
                <Row>
                  <Col span="18">
                    <Input type="text" v-model="item.name" placeholder="请输入"></Input>
                  </Col>
                  <Col span="4" offset="1" style="text-align:right;float:right;">
                    <Button @click="handleRemoveVariable(index)">删除</Button>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </div>
        </Form>
      </TabPane>
      <TabPane label="输出" name="name4">
        <div class="title">
          <span><Pipeline Run Id:</span>
          <span>{{ppRunId}}</span>
        </div>
        <div class="tableWrapper">
          <Table :loading="loading" :columns="outputTitle" :data="tableData" border>
            <template slot-scope="{ row }" slot="type">
              <Select v-model="row.url" transfer>
                <Option
                  v-for="item in typeArr"
                  :value="item.value"
                  :key="item.value"
                >{{ item.name }}</Option>
              </Select>
            </template>
          </Table>
          <div class="page" style="text-align:right;padding-top:10px;">
            <Page :total="tableData.length" show-total show-elevator @on-change="pageChangeOutPut" />
          </div>
        </div>
      </TabPane>
      <TabPane label="标签" name="name5">
        <div class="tabConten">
          <Form ref="formAnnotions" :model="formAnnotions" :rules="ruleValidate" :label-width="80">
            <div style="padding:5px;">
              <div class="btnWrapper" style="text-align:right;padding:5px 0;">
                <label class="ivu-form-item-label" style="width: 80px;">标签</label>
                <Button type="default" @click="handleAddAnnotions">增加</Button>
              </div>
              <div class="itemWrapper">
                <FormItem
                  v-for="(item, index) in formAnnotions.annotions"
                  :key="index"
                  label="标签"
                  :prop="item.name"
                >
                  <Row>
                    <Col span="18">
                      <Input type="text" v-model="item.name" placeholder="请输入"></Input>
                    </Col>
                    <Col span="4" offset="1" style="text-align:right;float:right;">
                      <Button @click="handleRemove(index)">删除</Button>
                    </Col>
                  </Row>
                </FormItem>
              </div>
            </div>
          </Form>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
export default {
  name: 'copyDataTab',
  data() {
    return {
      loading: '',
      ppRunId: '',
      current: 1,
      size: 10,
      currentOutput: 1,
      sizeOutput: 10,
      formAnnotions: {

        annotions: [
          {
            name: ''
          }
        ]
      },
      formBasic: {
        ppName: '',
        url: '',
        concurrency: '',
        desc: '',
        annotions: [
          {
            name: ''
          }
        ]
      },
      tableData: [],
      formParam: {
        params: [
          {
            name: '',
            type: '',
            value: ''
          }
        ]
      },
      formVariable: {
        variables: [{
          name: ''
        }]
      },
      typeArr: [{

        value: 'string',
        name: 'string'
      },
      {

        value: 'double',
        name: 'double'
      },
      {

        value: 'timestamp',
        name: 'timestamp'
      },
      {

        value: 'integer',
        name: 'integer'
      }],
      tableTitle: [
        {
          title: '名称',
          key: 'nameame',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h(
                'Input',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                    placeholder: '请输入',
                    value: params.row.name

                  }

                }
              )
            ])
          }
        },
        {
          title: '类型',
          key: 'type',
          minWidth: 120,
          slot: 'type'

        },
        {
          title: '数值',
          key: 'value',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h(
                'Input',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                    placeholder: '请输入',
                    value: params.row.value

                  }

                }
              )
            ])
          }
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
                          this.$Modal.remove()
                        }
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      outputTitle: [
        {
          title: '名称',
          key: 'ppName',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h(
                'Input',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                    placeholder: '请输入',
                    value: params.row.name

                  }

                }
              )
            ])
          }
        },
        {
          title: '类型',
          key: 'type',
          minWidth: 120,
          slot: 'type'

        },
        {
          title: '运行开始时间',
          key: 'duration',
          minWidth: 140

        },
        {
          title: '运行时长',
          key: 'duration',
          minWidth: 120

        },
        {
          title: '状态',
          key: 'status',
          minWidth: 120

        },
        {
          title: 'integration',
          key: 'integration',
          minWidth: 120

        }
        // {
        //   title: 'Action',
        //   key: 'action',

        //   minWidth: 120,
        //   render: (h, params) => {
        //     return h('div', [
        //       h(
        //         'Button',
        //         {
        //           props: {
        //             type: 'text',
        //             size: 'small'
        //           }
        //         },
        //         '编辑'
        //       ),
        //       h(
        //         'Button',
        //         {
        //           props: {
        //             type: 'text',
        //             size: 'small'
        //           },
        //           on: {
        //             click: () => {
        //               this.$Modal.confirm({
        //                 title: '消息提示',
        //                 closable: true,
        //                 content: '删除该数据后将不可恢复，是否删除?',
        //                 loading: true,
        //                 onOk: () => {
        //                   this.tableData.splice(
        //                     +params.index + this.size * (this.current - 1),
        //                     1
        //                   )
        //                   this.$Modal.remove()
        //                 }
        //               })
        //             }
        //           }
        //         },
        //         '删除'
        //       )
        //     ])
        //   }
        // }
      ],
      ruleValidate: {
        ppName: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleSelectAll(flag) {
      this.$refs.table.selectAll(flag)
    },

    handleAddVariable() {
      this.formVariable.variables.unshift({ name: '' })
    },
    handleRemoveVariable(index) {
      this.formVariable.variables.splice(index, 1)
    },
    handleAddAnnotions() {
      this.formBasic.annotions.unshift({ name: '' })
    },
    handleRemove(index) {
      this.formBasic.annotions.splice(index, 1)
    },
    pageChange(val) {
      this.current = val
    },
    pageChangeOutPut(val) {
      this.currentOutput = val
    },
    handleAddParams() {
      this.formParam.params.unshift({ name: '', value: '', type: '' })
    }

  },
  created() { },
  mounted() { }
}
</script>
