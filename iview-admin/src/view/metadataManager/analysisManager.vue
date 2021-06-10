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
                <Form-item label="数据源" prop="dataParams">
                  <i-select
                    v-model="searchForm.dataParams"
                    size="small"
                    placeholder="请选择数据"
                    style="width: 120px"
                  >
                    <i-option
                      v-for="item in dataList"
                      :key="item.id"
                      :value="item.id"
                    >{{ item.dataNum }}</i-option>
                  </i-select>
                </Form-item>
                <Form-item label="字段" prop="fieldParams">
                  <i-select
                    v-model="searchForm.fieldParams"
                    size="small"
                    placeholder="请选择字段"
                    style="width: 120px"
                  >
                    <i-option
                      v-for="item in fieldList"
                      :key="item.id"
                      :value="item.id"
                    >{{ item.label }}</i-option>
                  </i-select>
                </Form-item>
                <Form-item label-width="0">
                  <Button type="primary" size="small" @click="analysisamanager()">影响分析</Button>
                </Form-item>
              </i-form> 
            </i-col>
          </Row>
          <Row>
            <i-col span="24">
              <div id="echarts" style="width:100%; height:500px;"></div>
            </i-col>
          </Row>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
export default {
  name: 'analysisamanager',
  data () {
    return {
      searchWidth: 60,
      searchForm: {
        dataParams: '',
        field: ''
      },
      dataList: [
        {
          id: '1',
          dataNum: 'data1'
        },
        {
          id: '2',
          dataNum: 'data2'
        },
        {
          id: '3',
          dataNum: 'data3'
        }
      ],
      fieldList: [
        {
          id: '1',
          label: 'id'
        },
        {
          id: '2',
          label: 'name'
        },
        {
          id: '3',
          label: 'pipename'
        }
      ]
    }
  },
  methods: {
    analysisamanager () {
      console.log('影响分析方法')
    },
    init () {
      let myEcharts = this.$echarts.init(
        document.getElementById('echarts')
      )
      let colors = ['#9C27B0', '#FF4081']

      let datas = [{
        name: 'kafka_topic_1'
      }, {
        name: 'Hbase_table_1'
      }, {
        name: 'kafka_topic_2'
      }]

      for (let i = 0; i < datas.length; i++) {
        if (i === 0) {
          datas[i].itemStyle = {
            normal: {
              color: colors[0]
            }
          }
        } else {
          datas[i].itemStyle = {
            normal: {
              color: colors[1]
            }
          }
        }
      }
      let option = {
        animationEasingUpdate: 'quinticInOut',
        label: {
          normal: {
            show: true,
            textStyle: {
              fontSize: 12
            }
          }
        },
        series: [{
          type: 'graph',
          layout: 'force',
          symbolSize: 80,
          focusNodeAdjacency: true,
          roam: true,
          draggable: false,
          force: {
            repulsion: 2000,
            layoutAnimation: false
          },
          label: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 12
              }
            }
          },
          lineStyle: {
            normal: {
              opacity: 0.9,
              width: 1
            },
            emphasis:{
              color: '#ec407a'
            }
          },
          data: datas,
          links: [{
            source: 0,
            target: 1
          }, {
            source: 0,
            target: 2
          }, {
            source: 0,
            target: 3
          }]
        }]
      }
      myEcharts.setOption(option)
    }
  },
  created () {},
  mounted () {
    this.init()
  }
}
</script>
