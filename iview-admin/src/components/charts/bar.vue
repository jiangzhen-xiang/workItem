<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: {
    value: Object,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
    this.$nextTick(() => {
      let that = this
      let xAxisData = Object.keys(this.value)
      let seriesData = Object.values(this.value)
      let seriesArr = []
      let legendArr = []
      let dataArr0 = []
      let dataArr1 = []
      xAxisData.map(key => {
        let obj = {
          value: 0,
          name: key
        }
        that.value[key].map(item => {
          Object.keys(item).map(k => {
            obj.value += item[k]
            legendArr.push(k)
            dataArr1.push({
              value: item[k],
              name: k
            })
          })
        })
        dataArr0.push(obj)
      })
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: legendArr// ['租户1', '租户2', '租户3', '租户4']
        },
        series: [
          {
            name: '总授权数',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],

            label: {
              position: 'inner'
            },
            labelLine: {
              show: false
            },
            data: dataArr0
            // [
            //   { value: 300, name: 'tab1' },
            //   { value: 300, name: 'tab2' }
            // ]
          },
          {
            name: '授权数',
            type: 'pie',
            radius: ['40%', '55%'],
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            },
            data: dataArr1
            //  [
            //   { value: 100, name: '租户1' },
            //   { value: 200, name: '租户2' },
            //   { value: 100, name: '租户3' },
            //   { value: 200, name: '租户4' }

            // ]
          }
        ]
      }

      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
