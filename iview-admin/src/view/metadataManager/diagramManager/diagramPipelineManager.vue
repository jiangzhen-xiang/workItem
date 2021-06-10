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
                <Form-item label="选择pipeline" prop="dataParams">
                  <i-select
                    v-model="searchForm.dataParams"
                    size="small"
                    placeholder="请选择数据"
                    style="width: 200px"
                  >
                    <i-option
                      v-for="item in dataList"
                      :key="item.id"
                      :value="item.id"
                    >{{ item.dataNum }}</i-option>
                  </i-select>
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
  name: 'dataManager',
  data () {
    return {
      searchWidth: 80,
      searchForm: {
        dataParams: ''
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
      ]
    }
  },
  methods: {
    init () {
      let myEcharts = this.$echarts.init(
        document.getElementById('echarts')
      )
      let option = { title: {
        text: ''
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          symbolSize: 60,
          roam: true,
          label: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 15
              }
            }
          },
          draggable: true, // 节点是否可拖拽，只在使用力引导布局的时候有用。
		      focusNodeAdjacency: true, // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
            categories: [{
              name: '一般'
            }],   
        		force: {
			    // 力引导图基本配置
			    // initLayout: , // 力引导的初始化布局，默认使用xy轴的标点
            repulsion: 500, // 节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
            gravity: 0.02, // 节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
            edgeLength: 200, // 边的两个节点之间的距离，这个距离也会受 repulsion影响 。值越大则长度越长
            layoutAnimation: true // 因为力引导布局会在多次迭代后才会稳定，这个参数决定是否显示布局的迭代动画
            // 在浏览器端节点数据较多（>100）的时候不建议关闭，布局过程会造成浏览器假死。                        
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeLabel: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 14,
                color:"black"
              },
              formatter: "{c}"
            }
          },
          data: [ 
            {
              "name": "pipeline_1"
            },
            {
              "name": "pipeline_2"
            },
            {
              "name": "pipeline_3"     
            },
            {
              "name": "pipeline_4"  
            }
          ],
          links: [{
            "source": "pipeline_1",
            "target": "pipeline_2",
            "value": "sink_x1 / source_y1"
          },{
            "source": "pipeline_1",
            "target": "pipeline_3",
            "value": "sink_x2 / source_y2"
          },{
            "source": "pipeline_2",
            "target": "pipeline_3",
            "value": "sink_x3 / source_y3"
          },{
            "source": "pipeline_3",
            "target": "pipeline_4",
            "value": "sink_x3 / source_y4"
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
