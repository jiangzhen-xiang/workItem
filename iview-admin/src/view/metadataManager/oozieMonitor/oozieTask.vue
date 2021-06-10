<template>
  <div style="min-width: 720px;">


  </div>
</template>

<script>

import { getOozieUrl } from '@/api/oozieTask'
import {userInfo} from '@/api/userManager'
let Base64 = require('js-base64').Base64;


export default {
  data () {
    return {

      url: ''
    }
  },
  components: {
  },
  mounted () {

      getOozieUrl().then(res => {
            if (res.data.status === 1) {

            this.url = res.data.data[0].url;
            userInfo.addUser().then(res =>{

              if(res.data.status=="ok"){ 
                let token = "&token="+Base64.encode(res.data.data.password+"|+|"+res.data.data.username);
                this.url += token;
              }

            console.log("===oozie任务跳转url===2:"+this.url);
            //跳转到oozie任务查询界面
            window.open(this.url,"_blank");

            })

      
          }else{
            this.$Message.error("查询失败")
          }
      }).catch(err =>{
            console.log("=================err.response============:"+err.response) 
            this.$Message.error("查询失败")
        }
      )

      



  
  },
  created () {
  },
  computed: {},
  methods: {
  }
}
</script>

<style lang="less" scoped>
.process_content {
  width: 100%;
}
</style>
