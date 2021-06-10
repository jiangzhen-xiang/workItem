<template>
  <div>
    <div class="wrapper">
      <List>
        <ListItem>集群:&nbsp&nbsp&nbsp&nbsp{{nodeData.formLink.colony}}</ListItem>
        <ListItem>连接:&nbsp&nbsp&nbsp&nbsp{{nodeData.formLink.link}}</ListItem>
        <ListItem>主题:&nbsp&nbsp&nbsp&nbsp{{nodeData.formLink.datatopic}}</ListItem>
        <ListItem>用户:&nbsp&nbsp&nbsp&nbsp{{nodeData.formLink.username}}</ListItem>
      </List>
    </div>
  </div>
</template>
<script>

export default {
  name: 'commonForm',
  props: ['nodeData'],
  data() {
    return {

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
