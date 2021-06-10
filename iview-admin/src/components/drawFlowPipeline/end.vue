<template>
  <div :class="getClassName">
    <div class="nodeWrapper linkWrapper" :style="style">
      <div class="nodeWrapper endNode" @click.stop="handleClick">
        <div class="relative" style="position:relative;">
          <div class="handleIcon nodeItem" style="text-indent:20px;">
            <svg-icon
              icon-class="target"
              class-name="target"
              style="font-size:26px;color: #348fed;"
            />
          </div>
          <div class="handleText nodeItem">
            <div class="top">{{nodeData.formSource.outputStream}}</div>
            <div class="bottom">columns({{nodeData.tableDataInspect.length}})</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let time = null
let clickNum = 0
export default {
  name: 'end',
  props: ['styleParent', 'index', 'nodeData', 'activedIndex'],
  data () {
    return {
      text: this.nodeData.formSource.outputStream,
      column: 'columns',
      show: false,
      curStylePanel: 'position:absolute;top:10px;right:20px;'
    }
  },
  methods: {
    handleClick () {
      clickNum = clickNum + 1
      time = setTimeout(() => {
        if (clickNum == 1) {
          clickNum = 0
          this.handleSetEnd()
        } else {
          // this.handleDelete()
          // clickNum = 0
          // clearTimeout(time)
        }
      }, 200)
    },
    handleClose () {
      this.show = false
    },
    handleAddNodeOne (num) {
      let left = (+this.index + 1) * 260
      let nodeData = {
        index: this.index,
        haveSet: false,
        tabType: 'node' + num + 'Tab',
        style: 'position:absolute;left:' + left + 'px;top:10px;'
      }
      nodeData['node' + num] = true

      this.$emit('addNodeTemp', nodeData)
      this.show = false
    },
    handleRightClick (e) {
      console.log('===========e', e)
      let left = (+this.index + 1) * 260 + 10
      let top = 10
      this.curStylePanel = 'position:absolute;top:' + top + 'px;left:' + left + 'px;'
      this.show = true
    },
    // handleSetStart() {
    //   this.nodeData.haveSet = true
    //   let postData = JSON.parse(JSON.stringify(this.nodeData))
    //   postData.tabType = 'endTab'
    //   postData.nodeOne = true
    //   postData.index = this.index
    //   this.$emit('handleSetSource', postData)
    // },
    handleSetEnd () {
      let postData = JSON.parse(JSON.stringify(this.nodeData))
      postData.tabType = 'endTab'
      postData.nodeEnd = true
      postData.index = this.index
      this.$emit('handleSetEnd', postData)
      this.$emit('handleSetActivedIndex', this.index)
    },
    handleDelete () {
      this.$emit('handleDelete', this.index)
    },
    handleAddNode (index) {
      let left = (+this.index + 1) * 260
      let nodeData = {
        start: true,
        index: this.index,
        haveSet: false,
        tabType: 'startTab',
        style: 'position:absolute;left:' + left + 'px;top:10px;'
      }
      this.$emit('addNodeTemp', nodeData)
    }
  },
  computed: {
    style () {
      console.log('=======nodeData', this.nodeData)
      let left = (this.nodeData.leftIndex - 1) * (260 + 10) + 10
      let top = (this.nodeData.topIndex - 1) * (125 + 10) + 10
      let styleStr = ('position:absolute;left:' + left + 'px;top:' + top + 'px;')
      return styleStr
    },
    getClassName () {
      return this.activedIndex == this.index ? 'isCurIndex' : 'fock'
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="less" scoped>
.linkWrapper::before {
  display: block;
  content: "";
  height: 15px;
  width: 26px;
  background: #d2e7f8;
  top: 54px;
  position: absolute;
  left: -10px;
  z-index: 1;
}
.nodeWrapper {
  width: 260px;
  height: 123px;
}
.endNode .nodeItem {
  float: left;
  height: 123px;
}

.endNode .handleText {
  width: 150px;

  margin-left: 2px;
  position: relative;
  z-index: 2;
  .top {
    height: 50px;
  }
}
</style>
