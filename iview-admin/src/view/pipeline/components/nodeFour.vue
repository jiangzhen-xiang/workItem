<template>
  <div>
    <div class="nodeWrapper" :style="style">
      <div class="nodeWrapper" v-if="nodeData.haveSet" @contextmenu.prevent="handleRightClick">
        <div class="relative" style="position:relative;">
          <div class="handleIcon nodeItem">
            <Icon type="ios-folder" style="color:#137ad1" />
          </div>
          <div class="handleText nodeItem">
            <div class="top">{{text}}</div>
            <div class="bottom">{{column}}</div>
          </div>
          <div class="handleArrow nodeItem"></div>
        </div>
        <div class="btnAdd" style="cursor:pointer;">
          <Button size="small" type="text" @click="handleAddNode" style="font-size:24px;">
            <Icon type="ios-add-circle-outline" />
          </Button>
        </div>
      </div>
      <div class="relative default" style="position:relative;" v-else @dblclick="handleSetStart">
        <div class="handleIcon nodeItem">
          <Icon type="ios-folder" style="color:#137ad1" />
        </div>
        <div class="handleText nodeItem"></div>
        <div class="handleArrow nodeItem"></div>
      </div>
    </div>
    <div v-show="show" :style="curStylePanel">
      <Card style="width:300px;">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>添加节点
        </p>
        <a href="#" slot="extra" @click.prevent="handleClose">
          <Icon type="ios-loop-strong"></Icon>关闭
        </a>
        <div>
          <CellGroup @on-click="handleAddNodeOne">
            <Cell title="节点1" name="One" />
            <Cell title="节点2" name="Two" />
            <Cell title="节点3" name="Three" />
            <Cell title="节点3" name="Four" />
            <Cell title="终点" name="End" />
          </CellGroup>
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'nodeFour',
  props: ['styleParent', 'index', 'nodeData'],
  data() {
    return {
      text: 'nodeFour',
      column: 'columns',
      show: false,
      curStylePanel: 'position:absolute;top:10px;right:20px;'
    }
  },
  computed: {
    stylePanel() {
      return this.curStylePanel
    }
  },
  methods: {
    handleClose() {
      this.show = false
    },
    handleAddNodeOne(num) {
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
    handleRightClick(e) {
      console.log('===========e', e)
      let left = (+this.index + 1) * 260 + 10
      let top = 10
      this.curStylePanel = 'position:absolute;top:' + top + 'px;left:' + left + 'px;'
      this.show = true
    },
    handleSetStart() {
      this.nodeData.haveSet = true
      let postData = JSON.parse(JSON.stringify(this.nodeData))
      postData.index = this.index
      this.$emit('handleSetSource', postData)
    },
    handleDelete(index) {
      this.$emit('deleteTemp', this.index)
    },
    handleAddNode(index) {
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
    style() {
      return this.styleParent
    }
  },
  created() { },
  mounted() { }
}
</script>
<style lang="less">
.nodeWrapper {
  width: 260px;
  height: 123px;
}
.btnAdd {
  position: absolute;
  bottom: -10px;
  right: -20px;
}

.nodeItem {
  float: left;
  height: 123px;
}
.handleIcon {
  width: 50px;

  text-align: center;
  line-height: 80px;
}
.handleText {
  width: 150px;

  margin-left: 2px;
  .top {
    height: 50px;
  }
}
</style>
