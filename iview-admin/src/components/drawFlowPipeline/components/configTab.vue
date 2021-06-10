<template>
  <div>
    <div class="wrapper">
      <component ref="config" :nodeData="nodeData" :is="zjName"></component>
      <!-- <List>
        <ListItem>集群:&nbsp&nbsp&nbsp&nbsp{{nodeData.formSource.colony}}</ListItem>
        <ListItem>连接:&nbsp&nbsp&nbsp&nbsp{{nodeData.formSource.link}}</ListItem>
        <ListItem>主题:&nbsp&nbsp&nbsp&nbsp{{nodeData.formSource.datatopic}}</ListItem>
        <ListItem>用户:&nbsp&nbsp&nbsp&nbsp{{nodeData.formSource.username}}</ListItem>
      </List>-->
    </div>
  </div>
</template>
<script>
import hbaseConfigTab from '@/components/drawFlowPipeline/components/hbaseConfigTab'
import kafkaConfigTab from '@/components/drawFlowPipeline/components/kafkaConfigTab'
export default {
  name: 'commonForm',
  props: ['nodeData', 'type'],
  data() {
    return {
      configType: 'kafkaConfigTab'
    }
  },
  computed: {
    zjName() {
      if (this.type == 'hbase') {
        this.configType = 'hbaseConfigTab'
      } else {
        this.configType = 'kafkaConfigTab'
      }
      return this.configType
    }
  },
  components: {
    hbaseConfigTab,
    kafkaConfigTab
  },
  methods: {

  },
  created() {

  },
  mounted() {

  }
}
</script>
