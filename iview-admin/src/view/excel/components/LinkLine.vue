<template>
  <div class="line" :style="getLineType.lineStyle" :class="getLineType.className">
    <div class="left lineItem" :style="getLineType.leftStyle"></div>
    <div class="right lineItem" :style="getLineType.rightStyle"></div>
  </div>
</template>
<script>
export default {
  name: 'LinkLine',
  props: ['styleParent', 'index', 'linkData'],
  data() {
    return {
      isLinking: false

    }
  },
  computed: {
    // 在这里要计算出每个标准下的线
    getLineType() {
      // z 型 源点在上，目标节点在下，远点在左，目标节点在有
      let outPut = {
        className: '',
        linePosition: '', // 先记下，不一定用
        leftStyle: '',
        middleStyle: '',
        rightStyle: '',
        lineStyle: ''
      }
      if (this.linkData.sourcePoint.y < this.linkData.targetPoint.y) {
        // 注意，坐标轴圆点在左上角
        // z行
        if (this.linkData.sourcePoint.x < this.linkData.targetPoint.x) {
          outPut.className = 'lineZRight ' + this.linkData.lineType
          outPut.className += (this.linkData.isLinking == 'isLinking' ? ' isLinking' : ' linked')
          console.log('========getLineType', outPut)
          let rangeWidth = (this.linkData.targetPoint.x - this.linkData.sourcePoint.x)
          let rangeHeight = (this.linkData.targetPoint.y - this.linkData.sourcePoint.y)
          let leftWidth = rangeWidth / 2
          let leftStr = 'width:' + leftWidth + 'px;top:0;left:0;height:' + rangeHeight / 2 + 'px;border-left:0;border-bottom:0;border-top-right-radius:10px;'

          let rightStr = 'width:' + leftWidth + 'px;bottom:0;right:1px;height:' + rangeHeight / 2 + 'px;border-top:0;border-right:0;border-bottom-left-radius:10px;'
          let lineStr = 'width:' + leftWidth * 2 + 'px;height:' + rangeHeight + 'px;left:' + this.linkData.position.x + 'px;top:' + this.linkData.position.y + 'px;'
          outPut.leftStyle = leftStr
          outPut.rightStyle = rightStr
          outPut.lineStyle = lineStr
        } else if (this.linkData.sourcePoint.x > this.linkData.targetPoint.x) {
          // 倒z型（_|-），从右向左的箭头
          outPut.className = 'lineUnZLeft ' + this.linkData.lineType
          outPut.className += this.linkData.isLinking == 'isLinking' ? ' isLinking' : ' linked'
          let rangeWidth = (this.linkData.sourcePoint.x - this.linkData.targetPoint.x)
          let rangeHeight = (this.linkData.targetPoint.y - this.linkData.sourcePoint.y)
          let leftWidth = rangeWidth / 2
          let leftStr = 'width:' + leftWidth + 'px;top:0;right:1px;height:' + rangeHeight / 2 + 'px;border-right:0;border-bottom:0;border-top-right-radius:10px;'
          let rightStr = 'width:' + leftWidth + 'px;bottom:0;left:0;height:' + rangeHeight / 2 + 'px;border-left:0;border-top:0;border-bottom-right-radius:10px;'
          let lineStr = 'width:' + leftWidth * 2 + 'px;height:' + rangeHeight + 'px;left:' + (this.linkData.position.x - leftWidth * 2) + 'px;top:' + this.linkData.position.y + 'px;'
          outPut.leftStyle = leftStr
          outPut.rightStyle = rightStr
          outPut.lineStyle = lineStr
        } else {
          outPut.className = 'lineVBottom ' + this.linkData.lineType
          outPut.className += this.linkData.isLinking == 'isLinking' ? ' isLinking' : ' linked'
          // TODO 这里要想想怎么实现
        }
      } else if (this.linkData.sourcePoint.y > this.linkData.targetPoint.y) {
        // 源在下，目标在上
        // 倒z型(_|-) 自左向右
        if (this.linkData.sourcePoint.x < this.linkData.targetPoint.x) {
          let rangeWidth = (this.linkData.targetPoint.x - this.linkData.sourcePoint.x)
          let rangeHeight = (this.linkData.sourcePoint.y - this.linkData.targetPoint.y)
          outPut.className = 'lineUnZRight ' + this.linkData.lineType
          outPut.className += this.linkData.isLinking == 'isLinking' ? ' isLinking' : ' linked'
          let leftWidth = rangeWidth / 2
          let leftStr = 'width:' + leftWidth + 'px;left:1px;bottom:0;height:' + rangeHeight / 2 + 'px;border-top:0;border-left:0;border-bottom-right-radius:10px;'

          let rightStr = 'width:' + leftWidth + 'px;top:0;right:1px;height:' + rangeHeight / 2 + 'px;border-bottom:0;border-right:0;border-top-left-radius:10px;'
          let lineStr = 'width:' + leftWidth * 2 + 'px;height:' + rangeHeight + 'px;left:' + this.linkData.position.x + 'px;top:' + (this.linkData.position.y - rangeHeight) + 'px;'

          outPut.leftStyle = leftStr

          outPut.rightStyle = rightStr
          outPut.lineStyle = lineStr
        } else if (this.linkData.sourcePoint.x > this.linkData.targetPoint.x) {
          // 源在下，目标在上,源在右，目标在左
          // z 型（-|_） 从右向左
          // TODO 可能有问题
          outPut.className = 'lineZLeft ' + this.linkData.lineType
          outPut.className += this.linkData.isLinking == 'isLinking' ? ' isLinking' : ' linked'
          let rangeWidth = (this.linkData.sourcePoint.x - this.linkData.targetPoint.x)
          let rangeHeight = (this.linkData.sourcePoint.y - this.linkData.targetPoint.y)
          let leftWidth = rangeWidth / 2
          let leftStr = 'width:' + leftWidth + 'px;bottom:0;right:1px;border-top:0;border-right:0;border-bottom-left-radius:10px;'

          let rightStr = 'width:' + leftWidth + 'px;top:-' + rangeHeight + 'px;left:0;'
          let lineStr = 'width:' + leftWidth * 2 + 'px;height:' + rangeHeight + 'px;left:' + (this.linkData.position.x - leftWidth * 2) + 'px;top:' + (this.linkData.position.y - rangeHeight) + 'px;'
          outPut.leftStyle = leftStr

          outPut.rightStyle = rightStr
          outPut.lineStyle = lineStr
        } else {
          outPut.className = 'lineVTop ' + this.linkData.lineType
          outPut.className += this.linkData.isLinking == 'isLinking' ? ' isLinking' : ' linked'
        }
      } else { // y 轴相等，在同一个水平线上
        if (this.linkData.sourcePoint.x < this.linkData.targetPoint.x) {
          outPut.className = 'lineUnHRight ' + this.linkData.lineType
          outPut.className += this.linkData.isLinking == 'isLinking' ? ' isLinking' : ' linked'
        } else if (this.linkData.sourcePoint.x > this.linkData.targetPoint.x) {
          outPut.className = 'lineUnHLeft ' + this.linkData.lineType
          outPut.className += this.linkData.isLinking == 'isLinking' ? ' isLinking' : ' linked'
        } else {
          outPut.className = 'lineCover ' + this.linkData.lineType
          outPut.className += this.linkData.isLinking == 'isLinking' ? ' isLinking' : ' linked'
        }
      }
      return outPut
    }

  },
  methods: {
    handleMouseDown(e) {
      console.log('=========mouseDown', e)

      e.stopPropagation()
    },
    handleMouseDown(e) {
      console.log('=========mouseDown', e)
    },
    handleMouseMove(e) {

    },
    // draw 画图
    handleDelete(index) {
      this.$emit('deleteTemp', this.index)
    }
  },
  created() { },
  mounted() { }
}
</script>
<style lang="less" scoped>
.line {
  z-index: 1;
  position: absolute;
}
.isLinking .lineItem {
  border-style: dashed !important;
}
.linked .lineItem {
  border-style: solid !important;
}
.lineItem {
  position: absolute;
  border: solid 1px #4d8b52;
}
.info .lineItem {
  border-color: #3399ff;
}
.info .right.lineItem::before {
  background: #3399ff;
}
.info .right.lineItem::after {
  background: #3399ff;
}
.success .right.lineItem::before {
  background: #00cc66;
}
.success .right.lineItem::after {
  background: #00cc66;
}
.success .lineItem {
  border-color: #00cc66;
}
.warning .lineItem {
  border-color: #ff9900;
}
.warning .right.lineItem::before {
  background: #ff9900;
}
.warning .right.lineItem::after {
  background: #ff9900;
}
.error .lineItem {
  border-color: #ff6600;
}
.error .right.lineItem::before {
  background: #ff6600;
}
.error .right.lineItem::after {
  background: #ff6600;
}
.lineZRight .left {
  position: absolute;
  top: 0;
  left: 0;
}

.lineZRight .right {
  position: absolute;
  bottom: 0;
  right: 0;
}

.lineUnZLeft .left {
  right: 0;
  top: 0;
}
.lineUnZLeft .middle {
  top: 0;
}
.lineUnZLeft .right {
  bottom: 0;
}
.right.lineItem::before {
  display: block;
  content: " ";
  width: 10px;
  height: 1px;
  position: absolute;
  right: 0px;
  bottom: -1px;
  transform-origin: right;
  background: #4d8b52;
  transform: rotate(25deg);
  -webkit-transform: rotate(25deg);
}

.right.lineItem::after {
  display: block;
  content: " ";
  width: 10px;
  height: 1px;
  position: absolute;
  right: 0px;
  bottom: -1px;
  background: #4d8b52;
  transform: rotate(-30deg);
  /* -webkit-transform: rotate(-25deg); */
  border-top: 0;
  transform-origin: right;
}
.lineUnZRight .lineItem::after {
  top: -1px;
}
.lineUnZRight .lineItem::before {
  top: -1px;
}
</style>
