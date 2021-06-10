<template>
  <div>
    <div class="listShow">
      <div class="fenge"></div>
      <Table
        class="listContent"
        width="700" 
        ref="tableName"
        :data="tableData"
        :columns="tableTitle"
      >
        <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button type="primary" size="small" style="margin-right: 5px" @click="updata(row,index)"  >编辑</Button>
          </div>
        </template>
      </Table>
 
    </div>
    <Modal v-model="modal1" :title="tip" footer-hide  :closable="false" :mask-closable="false">
      <editUrl
        ref="urlEdit"
        @handleCancle="AfterCancle($event)"
        @handleOk="AfterOk($event)"
        @handleUp="refresh"
      ></editUrl>
    </Modal>
  </div>
</template>

<script>

import editUrl from './info'
import { getOozieUrl } from '@/api/oozieTask'

export default {
  data: function() {
    return {
      tableTitle: [
        // {
        //   title: "序号",
        //   type: 'index',
        //   width: 80,
        //   align: "center",
        // },
        {
          title: "hue地址",
          key: "url",
          align: "left",
          Width: 500,
          tooltip: true
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          fixed: "right",
          width: 200
        }
      ],
      tableData: [],
      item:{},
      modal1:false,
      tip:"",
    }
  },
  components:{
    editUrl
  },
  methods: {


    initData(){
      getOozieUrl().then(res => {
              if (res.data.status === 1) {
              this.tableData = eval(res.data.data);
              console.log(this.tableData)
            }else{
               this.tableData = null
            }
        })
    },
  
  
    // 修改
    updata(row, index) {
        console.log("index:"+index)
        console.log("row.url:"+row.url)
        this.tip="编辑";
        this.item.url = row.url;
        this.$refs.urlEdit.formValidate=this.item;
        this.modal1=true;
    },
    refresh(){
        this.initData();
    },
    AfterCancle(val){
      this[val]=false;
    },
    async AfterOk(val){
      this[val]=false;
    },

    
  },
  watch:{
  },
  created(){
  },
  mounted() {
     this.initData();
  },
  computed:{
 
  }
}
</script>
<style lang='less' scoped>
.row{
  margin:10px 0;
  background-color:#fff;
  padding:10px 20px 0;
  height:52px;
}
.btn{
  float:left;
}
.form{
  float: right;
}
.listShow{
  background-color:#fff;
}
.listTitle,.listContent,.listPage{
  margin:10px 20px;
}
.listTitle{
  padding-top:10px;
}
.span{
  width:25px;
  height:25px;
  font-size:20px;
  border-radius: 50%;
  background-color: #efefef;
  text-align: center;
  line-height: 25px;
  margin-right:10px;
  cursor: pointer;
}
.spanTitle{
  font-size:14px;
  font-weight:bold;
  color:#000;
}
.span:hover{
  color:rgb(10, 186, 230);
  border:1px solid rgb(10, 186, 230);
}
.fenge{
  width:100%;
  border-top:1px solid #efefef;
}
</style>

