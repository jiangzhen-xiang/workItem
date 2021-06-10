<style lang="less">
@import "./common.less";
</style>
<template>
  <div>
    <Row class="margin-top-10" style="display:flex;">
      <i-col span="8">
        <Card style="height:100%;">
          <p slot="title">任务</p>
          <div slot="extra"><<</div>
          <div>
            <div class="searchWrapper" style="padding-bottom:10px;">
              <Input placeholder="请输入" v-model="searchText">
                <Icon type="ios-search" slot="suffix" />
              </Input>
            </div>
            <div class="menuWrapper">
              <Collapse v-model="value1">
                <Panel :name="item.name" v-for="(item, index) in panelArr">
                  {{ item.title }}
                  <div class="wrapperConent" slot="content">
                    <list border>
                      <ListItem v-for="(list, idx) in item.listArr">
                        <span @click="handleTabChange">{{ list.text }}</span>
                      </ListItem>
                    </list>
                  </div>
                </Panel>
              </Collapse>
            </div>
          </div>
        </Card>
      </i-col>
      <i-col span="16">
        <Card>
          <p slot="title" style="height:30px;">
            <ButtonGroup>
              <Button type="text">
                <Icon type="md-albums" />保存为模版
              </Button>
              <Button type="text">
                <Icon type="md-checkmark" />校验
              </Button>
              <Button type="text">
                <Icon type="ios-bug-outline" />调试
              </Button>
              <Button type="text">
                <Icon type="ios-navigate" />运行
              </Button>
            </ButtonGroup>
          </p>

          <div>
            <div
              class="test"
              style="height:300px;overflow:auto;border:solid 1px #ddd;border-radius:4px;"
            >
              <div
                class="graphWrapper"
                style="height:100%;position:relative;"
                @click.stop="handleSetPipeline"
              >
                <div v-for="(item, index) in drawData">
                  <div v-if="item.copyData">
                    <copyDataTemp
                      v-bind:styleParent="item.style"
                      :index="index"
                      :copyData="item"
                      @handleDragMove="handleDragMove"
                      @handleDragDrop="handleDragDrop"
                      @handleAddLine="handleAddLine"
                      @handleUpdateLine="handleUpdateLine"
                      @handleRemoveLine="handleRemoveLine"
                      @deleteTemp="handleDeleteTemp"
                      @handleSetActive="handleSetActiveTab"
                    />
                  </div>
                  <div v-else-if="item.isLink">
                    <LinkLine :index="index" :linkData="item" @deleteTemp="handleDeleteTemp" />
                  </div>
                  <div v-else>111</div>
                </div>
              </div>
            </div>

            <div class="buttonWrapper" style="border-bottom:solid 1px #ddd;">
              <Tooltip content="搜索服务节点" placement="top">
                <Button type="text">
                  <Icon type="md-search"></Icon>
                </Button>
              </Tooltip>
              <Tooltip content="放大" placement="top">
                <Button type="text">
                  <Icon type="md-add"></Icon>
                </Button>
              </Tooltip>
              <Tooltip content="缩小" placement="top">
                <Button type="text">
                  <Icon type="md-remove"></Icon>
                </Button>
              </Tooltip>
              <Tooltip content="锁定" placement="top">
                <Button type="text">
                  <Icon type="ios-lock-outline" />
                </Button>
              </Tooltip>
              <Tooltip content="裁剪" placement="top">
                <Button type="text">
                  <Icon type="ios-crop" />
                </Button>
              </Tooltip>
              <Tooltip content="还原" placement="top">
                <Button type="text">
                  <Icon type="ios-cube" />
                </Button>
              </Tooltip>
            </div>
            <div class="tabWrapper">
              <component :is="zjName"></component>
            </div>
          </div>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
import excel from '@/libs/excel'
import pipelineTab from '@/view/excel/components/pipelineTab.vue'
import LinkLine from '@/view/excel/components/LinkLine.vue'
import copyDataTab from '@/view/excel/components/copyDataTab.vue'
import dataFlowTab from '@/view/excel/components/dataFlowTab.vue'
import copyDataTemp from './components/copyDataTemp'
export default {
  name: 'upload-excel',
  data () {
    return {
      drawData: [
      ],
      isDrawing: false,
      pipeline: 'pipeline',
      tabCurrent: 'pipelineTab',
      value1: '1',
      searchText: '',
      panelArr: [
        {
          name: '1',
          title: 'Move&transform',
          listArr: [
            {
              text: 'Copy Data'
            },
            {
              text: 'Data Flow'
            }
          ]
        },
        {
          name: '3',
          title: 'script&command',
          listArr: [
            {
              text: 'shell'
            },
            {
              text: 'python'
            },
            {
              text: 'jar'
            }
          ]
        },
        {
          name: '4',
          title: 'SQL',
          listArr: [
            {
              text: 'hive'
            },
            {
              text: 'spark'
            },
            {
              text: 'oracle'
            }
          ]
        },
        {
          name: '5',
          title: 'move',
          listArr: [
            {
              text: '集群-集群 COPY'
            },
            {
              text: 'Local-Local COPY'
            },
            {
              text: 'Local-集群 COPY'
            },
            {
              text: 'Data Flow'
            }
          ]
        },
        {
          name: '6',
          title: '监控元数据(文件/表/API/FTP)',
          listArr: [
            {
              text: 'LookUp'
            },
            {
              text: 'Delete'
            },
            {
              text: 'Web'
            },
            {
              text: 'Web Hook'
            },
            {
              text: 'Wait'
            },
            {
              text: 'Validate'
            }
          ]
        },
        {
          name: '7',
          title: '条件',
          listArr: [
            {
              text: 'Filter'
            },
            {
              text: 'IF'
            },
            {
              text: 'Switch'
            },
            {
              text: 'ForEach'
            },
            {
              text: '-'
            }
          ]
        },
        {
          name: '8',
          title: '机器学习',
          listArr: [
            {
              text: 'TensorFlow'
            },
            {
              text: 'Keras'
            },
            {
              text: 'Pytorch'
            },
            {
              text: 'KubeFlow'
            },
            {
              text: 'horovod'
            }
          ]
        },
        {
          name: '2',
          title: '自定义',
          listArr: [
            {
              text: 'hdfs/hive授权'
            },
            {
              text: 'make hive'
            }
          ]
        }

      ]
    }
  },
  components: { pipelineTab, copyDataTab, copyDataTemp, LinkLine, dataFlowTab },
  computed: {
    zjName () {
      // var myComponent = require(`@/view/excel/components/${this.tabCurrent}.vue`);
      // console.log("components", this.components);
      // return myComponent;

      return this.tabCurrent
    }
  },
  beforeDestroy () {
    let itemArr = document.querySelectorAll('.ivu-list-item')
    let drawContainer = document.querySelectorAll('.graphWrapper')
    this.handleRemoveListener(itemArr, 'mousedown', this.handleMouseDown)
    this.handleRemoveListener(document, 'mousemove', this.handleMouseMove)
    // this.removeEventListener(drawContainer, 'mouseup', this.handleMouseUp)
    this.handleRemoveListener(document, 'mouseup', this.handleMouseUp)
  },

  methods: {
    handleDragDrop (nodeData, index) {
      this.drawData.map(item => {
        if (item.isLink && (item.targetId == nodeData.nodeId)) {
          item.isLinking = 'linked'
        }

        return item
      })
    },
    handleDragMove (nodeData, index) {
      // curLink: {
      //   isLinking: 'isLinking',
      //   isLink: true,
      //   lineType: 'success',
      //   position: {
      //     x: 0,
      //     y: 0
      //   },
      //   sourcePoint: {
      //     x: 0,
      //     y: 0
      //   },
      //   targetPoint: {
      //     x: 0,
      //     y: 0
      //   }
      // }
      // 在这里做第二步和第三步
      // 2:获取以这个节点为目标的线，然后更改连线的目标点的位置
      // 3:获取以这个节点为源的线，然后更改连线的目标节点
      // 第二步做完了
      this.drawData.map(item => {
        if (item.isLink && (item.targetId == nodeData.nodeId)) {
          item.targetPoint.y = nodeData.position.y + 60
          item.targetPoint.x = nodeData.position.x
          item.isLinking = 'isLinking'
        }

        return item
      })

      // 第三步
      this.drawData.map(item => {
        if (item.isLink && (item.sourceId == nodeData.nodeId)) {
          item.sourcePoint.y = nodeData.position.y + 60
          item.sourcePoint.x = nodeData.position.x
          item.isLinking = 'isLinking'
          item.position.x = nodeData.position.x + 180
          item.position.y = nodeData.position.y + 60
        }

        return item
      })
    },
    handleUpdateLine (postData) {
      console.log('=======handleUpdateLine', postData)
      this.$set(this.drawData, this.drawData.length - 1, postData)
      console.log('=======this.drawData', this.drawData)
    },
    calLayout (pageX, pageY) {
      let rootDom = document.querySelectorAll('.graphWrapper')[0].getBoundingClientRect()
      let dotsPostion = {
        x: (rootDom.left - rootDom.left % 1) / 1,
        y: (rootDom.top - rootDom.top % 1) / 1
      }
      let position = {}
      position.x = pageX - dotsPostion.x
      position.y = pageY - dotsPostion.y
      return position
    },
    handleSetPipeline () {
      this.tabCurrent = 'pipelineTab'
    },
    handleSetActiveTab (postData) {
      this.tabCurrent = postData.type + 'Tab'
    },
    handleRemoveLine () {
      this.drawData.splice(this.drawData.length - 1, 1)
    },
    handleAddLine (lineData) {
      this.drawData.push(lineData)
    },
    handleDeleteTemp (index) {
      this.drawData.splice(index, 1)
    },
    initDraw () {
      let itemArr = document.querySelectorAll('.ivu-list-item')
      let drawContainer = document.querySelectorAll('.graphWrapper')
      this.handleAddListener(itemArr, 'mousedown', this.handleMouseDown)
      this.handleAddListener(document, 'mousemove', this.handleMouseMove)
      // this.handleAddListener(drawContainer, 'mouseup', this.handleMouseUp)
      this.handleAddListener(document, 'mouseup', this.handleMouseUp)

      // 绑定itemArr 的up事件
    },
    handleAddListener (btn, type, handle) {
      if (document.addEventListener) {
        if (Object.prototype.toString.call(btn) == '[object NodeList]') {
          for (let i = 0; i < btn.length; i++) {
            let curBtn = btn[i]
            curBtn.addEventListener(type, handle)
          }
        } else {
          btn.addEventListener(type, handle)
        }
      }
    },
    handleRemoveListener (btn, type, handle) {
      if (document.removeEventListener) {
        if (Object.prototype.toString.call(btn) == '[object NodeList]') {
          for (let i = 0; i < btn.length; i++) {
            let curBtn = btn[i]
            curBtn.removeEventListener(type, handle)
          }
        } else {
          btn.removeEventListener(type, handle)
        }
      }
    },
    handleMouseDown (e) {
      this.isDrawing = true
      let div = document.createElement('div')
      let type = 'dataFlow'
      if (e.target.textContent.indexOf('Copy') != '-1') {
        type = 'copyData'
      }
      div.setAttribute('data-type', type)
      div.setAttribute('data-text', e.target.textContent)
      div.className = 'isDrawing'
      let copyDataImg = require('@/assets/images/copyDataDraw.png')
      let img = document.createElement('img')
      img.style.width = '100%'
      img.src = copyDataImg
      div.appendChild(img)
      div.id = 'copyDataTemp'
      div.style = 'position:absolute;left:' + (e.pageX - 155) + 'px;top:' + (e.pageY - 25) + 'px'
      document.body.appendChild(div)
    },

    handleMouseMove (e) {
      if (!this.isDrawing) {
        return
      }
      let copyDataTemp = document.getElementById('copyDataTemp')
      if (copyDataTemp) {
        copyDataTemp.style =
          'position:absolute;left:' +
          (e.pageX - 155) +
          'px;top:' +
          (e.pageY - 25) +
          'px'
      }
    },
    handleHasClass(e,key){
      let event = e.target;
      while(event.className.indexOf(key) !='-1'){
        return true;
      }
    },
    handleMouseUp (e) {
      // 这里的逻辑到底是什么
      // 是否在isDrawing，如果是，就判断是否是graphWrapper，如果是，就往里面放个数据，然后把copyData 清楚
      // 如果是isDrawing，如果否，就不放数据，直接清空copyDataTemp
      // 如果isDrawing为否，就判断是否有copyDataTemp，有的话就清楚
      if (this.isDrawing) {
        if (e.target.className == 'graphWrapper') {
          this.isDrawing = false
          let copyDataTemp = document.getElementById('copyDataTemp')
          document.body.removeChild(copyDataTemp)
          let x = e.offsetX - 155
          let y = e.offsetY - 25
          this.drawData.push({
            copyData: true,
            nodeId: 'node_' + new Date().getTime(),
            text: copyDataTemp.getAttribute('data-text'),
            type: copyDataTemp.getAttribute('data-type'),
            style: 'position:absolute;left:' + x + 'px;top:' + y + 'px',
            position: {
              x: x,
              y: y
            }
          })
        } else {
          this.isDrawing = false
          let copyDataTemp = document.getElementById('copyDataTemp')
          document.body.removeChild(copyDataTemp)
        }
      } else {
        let copyDataTemp = document.getElementById('copyDataTemp')
        copyDataTemp && (document.body.removeChild(copyDataTemp))
      }
    },
    handleTabChange () {
      this.tabCurrent = 'copy'
    }
  },
  created () { },
  mounted () {
    this.$nextTick(() => {
      this.initDraw()
    })
  }
}
</script>
<style lang="less" >
.isDrawing {
  padding: 5px;
  border: dashed 2px #bbb;
  opacity: 0.7;
  width: 150px;
}
.isDrawing img {
  width: 100%;
}
li.ivu-list-item,
.graphWrapper {
  user-select: none;
}
</style>
