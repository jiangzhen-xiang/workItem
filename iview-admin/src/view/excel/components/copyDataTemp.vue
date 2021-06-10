<template>
  <div>
    <div :id="copyData.nodeId" :style="style" class="linkWrapper nodeWrapper">
      <span
        class="link"
        :class="'link'+(index+1)+' '+item.lineType"
        v-for="(item,index) in linkDataArr"
      ></span>
      <div class style="text-align:right">
        <i
          class="icon"
          style="display:inline-block;width:20px;height:20px;border:solid 2px red;border-radius:50%;clear:both;"
        ></i>
      </div>
      <div class="templateNode" @click.stop="handleSetCurTab">
        <div
          class="title"
          @mousedown.stop="handleDragStart"
          style="background:#1a73d7;height:30px;color:#fff;line-height:30px;padding-left:20px;font-size:14px;"
        >{{copyData.text}}</div>
        <div
          class="title"
          style="height:50px;background:#ddf0fe;padding-left:20px;line-height:50px;"
        >{{copyData.text}}</div>
        <div class="btn" style="background:#ddf0fe;">
          <Button
            type="text"
            icon="ios-trash-outline"
            style="font-size: 18px;"
            @click="handleDelete"
          ></Button>

          <Button type="text" icon="ios-sync" style="font-size: 18px;" @click="handleDelete"></Button>

          <Button type="text" icon="ios-search" style="font-size: 18px;" @click="handleDelete"></Button>

          <Button
            type="text"
            icon="ios-add-circle-outline"
            style="font-size: 18px;float:right;"
            @click="handleAddLinkData"
          ></Button>
        </div>
      </div>
    </div>
    <div :style="lineTypeStyle" v-if="showLineType">
      <Card style="width:300px;">
        <div slot="title">
          <div style="width:220px">
            <Input placeholder="请输入" size="small">
              <Icon type="ios-search" slot="suffix" />
            </Input>
          </div>
        </div>
        <div slot="extra" class="btnClosePanel">
          <Button type="primary" size="small" @click.stop="handleCancel">关闭</Button>
        </div>
        <div>
          <lineType @handleOk="handleAdd" />
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
import lineType from './lineType.vue'
export default {
  name: 'copyDataTemp',
  props: ['styleParent', 'index', 'copyData'],
  data() {
    return {
      isDraging: false,
      // 记录刚开始的位置，以便拖拽回退
      startPoint: {
        x: 0,
        y: 0
      },
      // 记录鼠标刚开始点击的位置，计算偏移量
      curDrawPoint: {
        x: 0,
        y: 0
      },
      showLineType: false,
      isLinking: false,
      lineTypeStyle: 'position:absolute;left:0;top:0;',
      linkDataArr: [],
      curLink: {
        isLinking: 'isLinking',
        isLink: true,
        sourceId: this.copyData.nodeId,
        targetId: 0,
        lineType: 'success',
        position: {
          x: 0,
          y: 0
        },
        sourcePoint: {
          x: 0,
          y: 0
        },
        targetPoint: {
          x: 0,
          y: 0
        }
      }

    }
  },
  beforeDestroy() {
    this.handleBlindRemove()
  },
  methods: {
    handleDragStart(e) {
      this.isDraging = true
      this.startPoint.x = this.copyData.position.x
      this.startPoint.y = this.copyData.position.y
      // 记录下鼠标点击的位置
      this.curDrawPoint.x = (e.pageX - e.pageX % 1) / 1
      this.curDrawPoint.y = (e.pageY - e.pageY % 1) / 1

      e.stopPropagation()
    },
    handleDragMove(e) {
      if (this.isDraging) {
        // 这里要做很多事情
        // 1:修改本节点当前的位置
        // 2:获取以这个节点为目标的线，然后更改连线的目标点的位置
        // 3:获取以这个节点为源的线，然后更改连线的目标节点
        let moveX = (e.pageX - e.pageX % 1) / 1 - this.curDrawPoint.x
        let moveY = (e.pageY - e.pageY % 1) / 1 - this.curDrawPoint.y

        // 先做第一步
        // let position = this.calLayout(e.pageX, e.pageY)

        // this.copyData.position.x = position.x
        // this.copyData.position.y = position.y
        // 设置边界规则，position.x 最小值为0，position.y 的最小值为0
        let xValue = this.startPoint.x + moveX
        let yValue = this.startPoint.y + moveY
        if (xValue <= 0) { // 左边界确定
          xValue = 0
        }
        if (yValue <= 0) { // 有边界确定
          yValue = 0
        }
        console.log('xValue+e.target.offsetWidth', xValue + e.target.offsetWidth)
        let maxWidth = document.querySelectorAll('.graphWrapper')[0].offsetWidth
        maxWidth = (maxWidth - maxWidth % 1) / 1
        let maxHeight = document.querySelectorAll('.graphWrapper')[0].offsetHeight
        maxHeight = (maxHeight - maxHeight % 1) / 1

        if ((xValue + e.target.offsetWidth) >= maxWidth) {
          document.querySelectorAll('.graphWrapper')[0].style.width = (xValue + 170) + 'px'
          document.querySelectorAll('.graphWrapper')[0].parentElement.scrollLeft = (xValue + 170) - document.querySelectorAll('.graphWrapper')[0].parentElement.clientWidth
        }
        if ((yValue + 150) >= maxHeight) {
          document.querySelectorAll('.graphWrapper')[0].style.height = (yValue + 150) + 'px'
          document.querySelectorAll('.graphWrapper')[0].parentElement.scrollTop = (yValue + 150) - document.querySelectorAll('.graphWrapper')[0].parentElement.clientHeight
        }
        this.copyData.position.x = xValue
        this.copyData.position.y = yValue

        console.log('this.copyData.postion', this.copyData.position)
        // 开始做第2步

        this.$emit('handleDragMove', this.copyData, this.index)
      } else {

      }
    },
    handleDragDrop(e) {
      if (this.isDraging) {
        if (e.target.className == 'title') {
          this.$emit('handleDragMove', this.copyData, this.index)
          this.$emit('handleDragDrop', this.copyData, this.index)
        } else {
          this.copyData.position.x = this.startPoint.x
          this.copyData.position.y = this.startPoint.y
        }
        this.isDraging = false
      } else {
        // 啥也不干
      }
    },
    handleCancel() {
      this.showLineType = false
    },
    handleAdd(lineType) {
      this.linkDataArr.push({
        lineType: lineType.type,
        isLinking: 'isLinking',
        isLink: true,
        sourceId: this.copyData.nodeId,
        targetId: '0',
        position: {
          x: 0,
          y: 0
        },
        sourcePoint: {
          x: 0,
          y: 0
        },
        targetPoint: {
          x: 0,
          y: 0
        }
      })
      this.$nextTick(() => {
        this.handleBlindRemove()
        this.initDraw()
      })
      this.showLineType = false
    },
    handleBlindRemove() {
      let nodeWrapper = document.querySelector('#' + this.copyData.nodeId)
      if (nodeWrapper) {
        let linkArr = document.querySelectorAll('.link')
        let drawContainer = document.querySelectorAll('.graphWrapper')
        this.handleRemoveListener(linkArr, 'mousedown', this.handleMouseDown)
        this.handleRemoveListener(document, 'mousemove', this.handleMouseMove)
        this.handleRemoveListener(document, 'mouseup', this.handleMouseUp)

        this.handleRemoveListener(document, 'mousemove', this.handleDragMove)
        this.handleRemoveListener(document, 'mouseup', this.handleDragDrop)
      }
    },
    handleAddLinkData(e) {
      let clientRect = e.target.getBoundingClientRect()
      this.lineTypeStyle = 'position:fixed;z-index:9999;left:' + clientRect.left + 'px;top:' + clientRect.top + 'px;'
      this.showLineType = true
    },
    handleSetCurTab() {
      this.$emit('handleSetActive', this.copyData)
    },
    calLayout(pageX, pageY) {
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
    handleAddListener(btn, type, handle) {
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
    handleRemoveListener(btn, type, handle) {
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
    handleMouseDown(e) {


      this.isLinking = true
      // 根据点击的节点类型判断这是第几个，设置线的初始点
      let lineType = e.target.className.split(' ')[2]
      let index = 0
      this.linkDataArr.map((item, idx) => {
        item.lineType == lineType && (index = (idx))
      })

      this.curLink.sourcePoint.x = this.copyData.position.x + 180
      this.curLink.sourcePoint.y = this.copyData.position.y + 10 + 50 + 5 + (5 + 15) * index
      this.curLink.position.x = this.copyData.position.x + 180
      this.curLink.position.y = this.copyData.position.y + 10 + 50 + 5 + (5 + 15) * index
      this.curLink.targetPoint.x = this.copyData.position.x + 180
      this.curLink.targetPoint.y = this.copyData.position.y + 180 + 50 + 5 + (5 + 15) * index
      this.curLink.isLinking = 'isLinking'
      this.curLink.lineType = lineType
      this.$emit('handleAddLine', this.curLink)
      e.stopPropagation()
    },
    getTargetDom(e) {
      if (e.target.className.indexOf('nodeWrapper') != '-1') {
        return e.target
      } else if (e.target.parentElement.className.indexOf('nodeWrapper') != '-1') {
        return e.target.parentElement
      } else if (e.target.parentElement.parentElement.className.indexOf('nodeWrapper') != '-1') {
        return e.target.parentElement.parentElement
      } else if (e.target.parentElement.parentElement.parentElement.className.indexOf('nodeWrapper') != '-1') {
        return e.target.parentElement.parentElement.parentElement
      } else if (e.target.parentElement.parentElement.parentElement.parentElement.className.indexOf('nodeWrapper') != '-1') {
        return e.target.parentElement.parentElement.parentElement.parentElement
      } else if (e.target.parentElement.parentElement.parentElement.parentElement.parentElement.className.indexOf('nodeWrapper') != '-1') {
        return e.target.parentElement.parentElement.parentElement.parentElement.parentElement
      } else {
        return null
      }
    },
    handleMouseMove(e) {
      if (!this.isLinking) {

      } else {
        // 在这里需要判断
        // 1:如果当前div的class为graphWarraper，就是e.pageX,e.pageY.2:如果id是node_* 等就计算出一个动态位置

        let targetDom = this.getTargetDom(e)
        console.log('lineTargetPoint', targetDom)
        if (e.target.className == 'graphWrapper') {
          let position = this.calLayout(e.pageX, e.pageY)
          this.curLink.targetPoint.x = position.x
          this.curLink.targetPoint.y = position.y
        } else if (targetDom) {
          let lineTargetPoint = targetDom.getBoundingClientRect()
          console.log('lineTargetPoint', lineTargetPoint)
          let position = this.calLayout(lineTargetPoint.x, lineTargetPoint.y)
          this.curLink.targetPoint.x = position.x
          this.curLink.targetPoint.y = position.y + 65
        } else {
          let position = this.calLayout(e.pageX, e.pageY)
          this.curLink.targetPoint.x = position.x
          this.curLink.targetPoint.y = position.y
        }
      }
    },
    handleMouseUp(e) {
      if (this.isLinking) {
        if (e.target.className == 'templateNode' || e.target.parentElement.className == 'templateNode' || e.target.parentElement.parentElement.className == 'templateNode' || e.target.parentElement.parentElement.parentElement.className == 'templateNode') {
          let targetDom = this.getTargetDom(e)
          this.isLinking = false
          this.curLink.isLinking = 'linked'
          this.curLink.targetId = targetDom.id
          this.$emit('handleUpdateLine', JSON.parse(JSON.stringify(this.curLink)))
          // 已经放进去了，暂时先不管
        } else {
          // 把放进去的线取出来
          this.$emit('handleRemoveLine')
          this.curLink = {
            isLink: true,
            position: {
              x: 0,
              y: 0
            },
            sourcePoint: {
              x: 0,
              y: 0
            },
            targetPoint: {
              x: 0,
              y: 0
            }
          }
        }
      } else {

      }
    },

    // draw 画图
    initDraw() {
      let nodeWrapper = document.querySelector('#' + this.copyData.nodeId)
      if (nodeWrapper) {
        let linkArr = nodeWrapper.querySelectorAll('.link')
        let drawContainer = document.querySelectorAll('.graphWrapper')
        this.handleAddListener(linkArr, 'mousedown', this.handleMouseDown)
        this.handleAddListener(document, 'mousemove', this.handleMouseMove)
        this.handleAddListener(document, 'mouseup', this.handleMouseUp)

        this.handleAddListener(document, 'mousemove', this.handleDragMove)
        this.handleAddListener(document, 'mouseup', this.handleDragDrop)
      }
    },
    handleDelete(index) {
      this.$emit('deleteTemp', this.index)
    }
  },
  components: {
    lineType
  },
  computed: {
    style() {
      let styleStr = 'position:absolute;left:' + this.copyData.position.x + 'px;top:' + this.copyData.position.y + 'px'
      return styleStr
    },
    getId() {
      return 'template_' + new Date().getTime()
    },
    getLineStatus() {
      return this.idLinking ? 'isLinking' : 'linked'
    }
  },
  created() { },
  mounted() {
    this.$nextTick(() => {
      this.initDraw()
    })
  }
}
</script>
<style >
.graphWrapper .ivu-card-extra {
  top: 6px;
}
</style>
<style lang="less" scoped>
.ivu-card-extra {
  top: 6px;
}
.nodeWrapper {
  z-index: 2;
}
.link {
  position: absolute;
  right: -10px;
  width: 10px;
  height: 15px;
}

.info {
  background: #3399ff;
}
.success {
  background: #00cc66;
}
.warning {
  background: #ff9900;
}
.error {
  background: #ff6600;
}
.link1 {
  top: 60px;
}
.link2 {
  top: 80px;
}
.link3 {
  top: 100px;
}
.link4 {
  top: 120px;
}

.templateNode {
  border: solid 1px #ddd;
  border-radius: 5px;
  overflow: hidden;
}
.ivu-btn-icon-only {
  padding: 5px 10px 6px;
}
</style>
