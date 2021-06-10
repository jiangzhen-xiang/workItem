<template>
  <div style="position:relative;z-index:0;">
    <div style="display:none">getIconClass</div>
    <div class="ivu-card-head" style="margin-bottom: 10px;">
      <div>
        <span v-show="type == 'source'">
          <svg-icon icon-class="source" class-name="source" style="font-size:14px;" />
        </span>
        <span v-show="type == 'nodeOne'">
          <svg-icon icon-class="nodeOne" class-name="nodeOne" style="font-size:14px;" />
        </span>
        <span v-show="type == 'target'">
          <svg-icon icon-class="target" class-name="target" style="font-size:14px;" />
        </span>
        <span style="color:#2178ED">{{pipeline.drawData[paramIndex].pipeline}}</span>
      </div>
      <div class="ivu-card-extra" style="top:5px;">
        <a href="#" @click="showNodeData">
          <i class="ivu-icon ivu-icon-ios-loop-strong"></i>&gt;&gt;
        </a>
      </div>
    </div>
    <div class="wrapper">
      <Collapse :active-key="key" accordion>
        <Panel key="1">
          数据集
          <div slot="content">
            <div class="wrapper">
              <clusterTab :nodeData="pipeline.drawData[paramIndex]" />
            </div>
          </div>
        </Panel>
        <Panel key="2">
          设置
          <div slot="content">
            <configTab :nodeData="pipeline.drawData[paramIndex]" :type="pipeline.type" />
          </div>
        </Panel>
        <Panel key="3">
          数据格式
          <div slot="content">
            <formatTab :nodeData="pipeline.drawData[paramIndex]" :pageSize="pageSize" />
          </div>
        </Panel>
        <Panel key="4">
          元数据
          <div slot="content">
            <div class="wrapper">
              <dataMeta :nodeData="pipeline.drawData[paramIndex]" :pageSize="pageSize" />
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
  </div>
</template>
<script>
import clusterTab from '@/components/drawFlowPipeline/components/clusterTab'
import configTab from '@/components/drawFlowPipeline/components/configTab'
import formatTab from '@/components/drawFlowPipeline/components/formatTab'
import dataMeta from '@/view/pipeline/components/dataMeta'
export default {
  name: 'nodeDetail',
  props: ['pipeline'],
  data() {
    return {
      key: 1,
      pageSize: true,
      paramIndex: 1,
      type: 'source'
    }
  },
  components: {
    dataMeta,
    clusterTab,
    configTab,
    formatTab
  },
  computed: {
    getIconClass() {
      if (this.pipeline.drawData[this.paramIndex].start) {
        this.type = 'source'
      } else if (this.pipeline.drawData[this.paramIndex].nodeOne) {
        this.type = 'nodeOne'
      } else {
        this.type = 'target'
      }
      return this.type
    }
  },
  created() {
    this.$bus.on('fireShowNodeData', this.handleShowNodeData)
  },
  methods: {
    handleShowNodeData(postData) {
      this.paramIndex = postData.index
      // this.showNodeData
    },
    showNodeData() {
      if ((this.paramIndex == 0) || (this.paramIndex == (this.pipeline.drawData.length - 1))) {
        this.paramIndex = 1
      } else if (this.paramIndex < (this.pipeline.drawData.length - 1)) {
        this.paramIndex += 1
      } else {

      }
      this.$bus.emit('fireSetActivedIndex', { index: this.paramIndex })
    },
    changeLimit() {

    }
  }
}
</script>
