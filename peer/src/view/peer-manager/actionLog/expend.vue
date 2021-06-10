<template>
  <div>
    <Collapse @on-change="isShow" >
        <Panel>
            {{msg}}
            <p slot="content">{{optDesc}}</p>
        </Panel>
    </Collapse>
  </div>
</template>

<script>
export default {
  props:['optDesc'],
  data () {
    return {
      msg: '点击展开',
      flag:false
    }
  },
  methods: {
      isShow(){
        //   console.log(1);
          if(this.flag){
              this.msg='点击展开';
          }else{
              this.msg='点击收起';
          }
          this.flag=!this.flag;
      }
  }
}
</script>

<style scoped>

</style>
