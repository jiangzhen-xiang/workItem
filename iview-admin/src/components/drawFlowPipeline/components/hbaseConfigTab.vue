<template>
  <div>
    <div class="wrapper">
      <List>
        <ListItem>集群:&nbsp&nbsp&nbsp&nbsp{{nodeData.formSource.colony}}</ListItem>
        <ListItem>连接:&nbsp&nbsp&nbsp&nbsp{{nodeData.formSource.link}}</ListItem>
        <ListItem>主题:&nbsp&nbsp&nbsp&nbsp{{nodeData.formSource.datatopic}}</ListItem>
        <ListItem>用户:&nbsp&nbsp&nbsp&nbsp{{nodeData.formSource.username}}</ListItem>
      </List>
    </div>
  </div>
</template>
<script>

export default {
  name: 'hbaseConfigTab',
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
