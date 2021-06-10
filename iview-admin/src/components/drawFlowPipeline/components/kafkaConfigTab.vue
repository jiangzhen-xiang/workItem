<template>
  <div>
    <div class="wrapper">
      <List>
        <ListItem>名称:&nbsp&nbsp&nbsp&nbsp{{nodeData.formSource.outputStream}}</ListItem>
        <ListItem>内部标名称:&nbsp&nbsp&nbsp&nbsp{{nodeData.formSource.nbbTableName}}</ListItem>
        <ListItem>格式:&nbsp&nbsp&nbsp&nbsp{{nodeData.formSource.format}}</ListItem>
        <ListItem style="overflow:auto;">
          schemaInfo:
          &nbsp&nbsp&nbsp&nbsp{{nodeData.formSource.schemaInfo}}
        </ListItem>
        <ListItem>groupId:&nbsp&nbsp&nbsp&nbsp{{nodeData.formSource.groupId}}</ListItem>
        <ListItem>offsetReset:&nbsp&nbsp&nbsp&nbsp{{nodeData.formSource.offsetReset}}</ListItem>
        <ListItem>并行度:&nbsp&nbsp&nbsp&nbsp{{nodeData.formSource.isParallelism}}</ListItem>
      </List>
    </div>
  </div>
</template>
<script>

export default {
  name: 'kafkaConfigTab',
  props: ['nodeData'],
  data() {
    return {
      configType: 'kafkaConfigTab'
    }
  },
  computed: {

  },
  methods: {

  },
  created() {

  },
  mounted() {

  }
}
</script>
