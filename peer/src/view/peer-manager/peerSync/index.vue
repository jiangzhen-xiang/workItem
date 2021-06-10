<template>
  <div>
    <Row class="row">
      <i-col>
        <Form :label-width="10" inline class="form">
          <div style="float:left">
            <FormItem>
              <Input type="text"  style="width: 100px"  placeholder="申请单名称" v-model="searchObj.applyFileName" />
            </FormItem>
            <FormItem>
              <Input type="text"  style="width: 100px"  placeholder="租户" v-model="searchObj.tenantUser" />
            </FormItem>
            <FormItem>
              <DatePicker type="date" placement="bottom-end" placeholder="投产时间" style="width: 110px" v-model="searchObj.prodBeginDate"></DatePicker> -
              <DatePicker type="date" placement="bottom-end" placeholder="投产时间" style="width: 110px" v-model="searchObj.prodEndDate"></DatePicker>
            </FormItem>
            <FormItem>
              <Select placeholder="状态" style="width:120px;" v-model="searchObj.stat">
                <Option  key="a" value="a">全选</Option>
                <Option v-for="(item,index) in stat" :key="index" :value="item.key">{{ item.value }}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="searchCon" style="margin-right: 5px">查询</Button>
            </FormItem>
          </div>
          <FormItem style="float:right;">
            <Button type="primary" @click="beforeSync" style="margin-right: 5px">执行前校验</Button>
            <Button type="primary" @click="syncAction">批量执行</Button>
          </FormItem>
        </Form>
      </i-col>
    </Row>
    <div class="listShow">
      <!-- 
          stripe=>显示斑马纹
          data=>表数据
          columns=>显示表头信息
          height=>表格高度 如果大于此值固定表头
          loading=>表格是否加载中
      -->
      <Table
        stripe
        border
        class="listContent"
        ref="tableName"
        :loading="loading"
        :data="tableData"
        :columns="tableTitle"
        :max-height="tableHeight"
        @on-selection-change="handleSelected"
      >
        <template slot-scope="{ index }" slot="watch">
          <Button type="primary" size="small"  @click="watchDetail(index)">查看详情</Button>
        </template>
        <template slot-scope="{ index }" slot="action">
          <Button type="error" size="small" @click="checkOut(index)" style="margin-right: 5px">校验</Button>
          <Button type="primary" size="small" style="margin-right: 5px" @click="carryOut(index)">执行</Button>
        </template>
      </Table> 
      <Page
        show-total
        class="listPage"
        style="text-align:right;margin-top:10px;"
        :total="totalNum"
        :page-size="pageSize"
        :current="currentPage"
        show-elevator
        show-sizer
        @on-change="pageChange"
        @on-page-size-change="onPageSize"
      />
    </div>
    <Drawer title="校验结果"  v-model="modal1" width="50" :scrollable="true" :mask-closable="false" >
        <Table border :data="outerTableData" :columns="outerTitle"></Table>
    </Drawer>
    <Drawer title="执行结果"  v-model="modal2" width="50" :scrollable="true" :mask-closable="false" >
        <Table border :data="outerTableData1" :columns="outerTitle1"></Table>
    </Drawer>
    <!-- <Modal v-model="modal1" title="查看详情" :mask-closable="false" :styles="{right:'0',top:'0',width:'50%',height:'100%'}" footer-hide>
      <Table :data="outerTableData" :columns="outerTitle"></Table>
    </Modal> -->
  </div>
</template>

<script>
import syncCheck from '@/api/peerSync.js'
import applyAxios from '@/api/application.js';
export default {
  data: function() {
    return {
      tableTitle: [
        {
          title:'选择',
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left',
          resizable:true,
        },
        {
          title:'序号',
          // type: 'index',
          width: 80,
          align: 'center',
          resizable:true,
          fixed: 'left',
          render: (h, params) => {
            return h('span', params.index + (this.currentPage- 1) * this.pageSize + 1);
          }
        },
        {
          title: "编号",
          key: "id",
          align: "center",
          width: 100,
          tooltip:true,
          resizable:true
        },
        {
          title: "申请单名称",
          key: "applyFileName",
          align: "center",
          width: 130,
          tooltip:true,
          resizable:true
        },
        {
          title: "租户",
          key: "tenantUser",
          align: "center",
          width: 100,
          tooltip:true,
          resizable:true
        },
        {
          title: "投产时间",
          key: "prodDate",
          align: "center",
          width: 120,
          tooltip:true,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.prodDate?this.$formatTime(params.row.prodDate,"yyyy-MM-dd"):"")
            ]);
          },
          resizable:true
        },
        {
          title: "联系人",
          key:"contacts",
          align: "center",
          width: 100,
          tooltip:true,
          resizable:true
        },
        {
          title: "联系方式",
          key: "contactWay",
          align: "center",
          width: 100,
          tooltip:true,
          resizable:true
        },
        {
          title: "状态",
          key:"stat",
          align: "center",
          width: 100,
          tooltip:true,
          render: (h, params) => {
            return h('div', [
              h('span', this.stat[params.row.stat].value)
            ]);
          },
          resizable:true
        },
        {
          title: "结果信息",
          key: "synMsg",
          align: "center",
          tooltip:true,
          width: 100,
          resizable:true
        },
        {
          title: "申请人",
          key: "reqUser",
          align: "center",
          width: 120,
          tooltip:true,
          resizable:true
        },
        {
          title: "申请时间",
          key:"reqTime",
          align: "center",
          width: 100,
          tooltip:true,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.reqTime?this.$formatTime(params.row.reqTime,"yyyy-MM-dd HH:mm:ss"):"")
            ]);
          },
          resizable:true
        },
        {
          title: "同步人",
          key: "synUser",
          align: "center",
          width: 100,
          tooltip:true,
          resizable:true
        },
        {
          title: "同步时间",
          key: "synTime",
          align: "center",
          minWidth: 120,
          tooltip:true,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.synTime?this.$formatTime(params.row.synTime,"yyyy-MM-dd HH:mm:ss"):"")
            ]);
          },
          // resizable:true
        },
        {
          title:"详情",
          slot:'watch',
          align:"center",
          fixed: "right",
          width:90,
          tooltip:true,
          resizable:true
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          fixed: "right",
          width: 180,
          tooltip:true,
          resizable:true
        },
      ],
      tableData: [],
      totalNum:0,
      pageSize:10, //每页几条数据
      currentPage:1,
      modal1:false,
      modal2:false,
      loading:false,
      outerTitle:[ //弹出的表格
        {
          type: 'expand',
          width: 50,
          // fixed: 'left',
          render: (h, params) => {
              return h('Table', {
                  attrs: {
                      data: this.detailTableData[params.index],
                      columns:this.detailTitle
                  }
              })
          },
          resizable:true,
        },
        {
          title: "编号",
          key: "id",
          align: "center",
          width: 160,
          tooltip:true,
          resizable:true,
          // fixed: 'left'
        },
        {
          title: "申请单名称",
          key: "applyFileName",
          align: "center",
          width: 200,
          tooltip:true,
          resizable:true,
          // fixed: 'left'
        },
        // {
        //   title: "检查前信息",
        //   key: "beCheckMsg",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        // },
        // {
        //   title: "code",
        //   key: "code",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        // },
        // {
        //   title: "联系方式",
        //   key: "contactWay",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        // },
        // {
        //   title: "联系人",
        //   key: "contacts",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        // },
        // {
        //   title: "校验后信息",
        //   key: "feCheckMsg",
        //   align: "center",
        //   width: 130,
        // },
        // {
        //   title: "信息",
        //   key: "message",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        // },
        // {
        //   title: "投产开始时间",
        //   key: "prodBeginDate",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', params.row.prodDate?this.$formatTime(params.row.prodDate,"yyyy-MM-dd"):"")
        //     ]);
        //   }
        // },
        // {
        //   title: "投产时间",
        //   key: "prodDate",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', params.row.prodDate?this.$formatTime(params.row.prodDate,"yyyy-MM-dd"):"")
        //     ]);
        //   }
        // },
        // {
        //   title: "投产结束时间",
        //   key: "prodEndDate",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', params.row.prodDate?this.$formatTime(params.row.prodDate,"yyyy-MM-dd HH:mm:ss"):"")
        //     ]);
        //   }
        // },
        // {
        //   title: "备注",
        //   key: "remark",
        //   align: "center",
        //   width: 120,
        //   tooltip:true,
        // },
        // {
        //   title: "申请人",
        //   key: "reqUser",
        //   align: "center",
        //   width: 120,
        //   tooltip:true,
        // },
        // {
        //   title: "申请时间",
        //   key:"reqTime",
        //   align: "center",
        //   width: 100,
        //   tooltip:true,
        //    render: (h, params) => {
        //     return h('div', [
        //       h('span', params.row.reqTime?this.$formatTime(params.row.reqTime,"yyyy-MM-dd HH:mm:ss"):"")
        //     ]);
        //   }
        // },
        // {
        //   title: "状态",
        //   key:"stat",
        //   align: "center",
        //   width: 100,
        //   tooltip:true,
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', this.stat[params.row.stat].value)
        //     ]);
        //   }
        // },
        {
          title: "校验结果",
          key: "synMsg",
          align: "center",
          width: 200,
          tooltip:true,
          // fixed: 'left',
          render: (h, params) => {
            if(params.row.synMsg.search("成功")==-1){
              return h('div', [
                h('span', 
                  {style:{
                    color:'#FF3300',
                  }},
                  params.row.synMsg),
              ]);
            }else{
              return h('div', [
                h('span', 
                  {style:{
                    color:'#008000',
                  }},
                  params.row.synMsg),
              ]);
            }
          },
          resizable:true,
        },
        // {
        //   title: "同步时间",
        //   key: "synTime",
        //   align: "center",
        //   width: 120,
        //   tooltip:true,
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', params.row.synTime?this.$formatTime(params.row.synTime,"yyyy-MM-dd HH:mm:ss"):"")
        //     ]);
        //   }
        // },
        // {
        //   title: "同步人",
        //   key: "synUser",
        //   align: "center",
        //   width: 120,
        //   tooltip:true,
        // },
        {
          title: "租户",
          key: "tenantUser",
          align: "center",
          width: 200,
          // fixed:"right",
          tooltip:true,
          resizable:true,
        },
      ],
      outerTableData:[],
      detailTitle:[
        {
          title: '提示',
          width: 60,
          align: "center",
          fixed: 'left',
          render: (h, params) => {
            if(params.row.stat==1){
              return h('div', [
                  h('Icon', {
                      props: {
                        type: 'md-checkmark-circle'
                      },
                      style:{
                        color:'#008000'
                      }
                  }),
              ]);
            }else{
              return h('div', [
                  h('Icon', {
                      props: {
                          type: 'md-close'
                      },
                      style:{
                        color:'#FF3300'
                      }
                  }),
              ]);
            }
          },
          resizable:true,
        },
        {
          title: "编号",
          key: "id",
          align: "center",
          width: 100,
          tooltip:true,
          resizable:true,
          // fixed: 'left'
        },
        // {
        //   title: "申请单名称",
        //   key: "applyFileName",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        //   // fixed: 'left'
        // },
        {
          title: "校验结果",
          key: "synMsg",
          align: "center",
          width: 130,
          tooltip:true,
          // fixed: 'left',
          render: (h, params) => {
            if(params.row.synMsg.search("成功")==-1){
              return h('div', [
                h('span', 
                  {style:{
                    color:'#FF3300',
                  }},
                  params.row.synMsg),
              ]);
            }else{
              return h('div', [
                h('span', 
                  {style:{
                    color:'#008000',
                  }},
                  params.row.synMsg),
              ]);
            }
          },
          resizable:true,
        },
        // {
        //   title: "申请单ID",
        //   key: "applyId",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        // },
        // {
        //   title: "检查前信息",
        //   key: "beCheckMsg",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        // },
        // {
        //   title: "code",
        //   key: "code",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        // },
        {
          title: "命名空间",
          key: "nameSpace",
          align: "center",
          width: 130,
          tooltip:true,
          resizable:true,
        },
        {
          title: "表名",
          key: "tableName",
          align: "center",
          width: 130,
          tooltip:true,
          resizable:true,
        },
        {
          title: "列簇",
          key: "colFamily",
          align: "center",
          width: 130,
          tooltip:true,
          resizable:true,
        },
        // {
        //   title: "校验后信息",
        //   key: "feCheckMsg",
        //   align: "center",
        //   width: 130,
        // },
        // {
        //   title: "信息",
        //   key: "message",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        // },
        {
          title: "操作类型",
          key: "operType",
          align: "center",
          width: 130,
          tooltip:true,
          render: (h, params) => {
            return h('div', [
              h('span', this.operType[params.row.operType-1])
            ]);
          },
          resizable:true,
        },
        // {
        //   title: "投产开始时间",
        //   key: "prodBeginDate",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', params.row.prodDate?this.$formatTime(params.row.prodDate,"yyyy-MM-dd HH:mm:ss"):"")
        //     ]);
        //   }
        // },
        // {
        //   title: "投产时间",
        //   key: "prodDate",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', params.row.prodDate?this.$formatTime(params.row.prodDate,"yyyy-MM-dd"):"")
        //     ]);
        //   }
        // },
        // {
        //   title: "投产结束时间",
        //   key: "prodEndDate",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', params.row.prodDate?this.$formatTime(params.row.prodDate,"yyyy-MM-dd"):"")
        //     ]);
        //   }
        // },
        // {
        //   title: "申请人",
        //   key: "reqUser",
        //   align: "center",
        //   width: 120,
        //   tooltip:true,
        // },
        // {
        //   title: "申请时间",
        //   key:"reqTime",
        //   align: "center",
        //   width: 100,
        //   tooltip:true,
        //    render: (h, params) => {
        //     return h('div', [
        //       h('span', params.row.reqTime?this.$formatTime(params.row.reqTime,"yyyy-MM-dd HH:mm:ss"):"")
        //     ]);
        //   }
        // },
        // {
        //   title: "源集群名称",
        //   key: "sourceClusterName",
        //   align: "center",
        //   width: 130,
        // },
        {
          title: "状态",
          key:"stat",
          align: "center",
          width: 100,
          tooltip:true,
          render: (h, params) => {
            return h('div', [
              h('span', this.stat[params.row.stat].value)
            ]);
          },
          resizable:true,
        },
        // {
        //   title: "同步时间",
        //   key: "synTime",
        //   align: "center",
        //   width: 120,
        //   tooltip:true,
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', params.row.synTime?this.$formatTime(params.row.synTime,"yyyy-MM-dd HH:mm:ss"):"")
        //     ]);
        //   }
        // },
        {
          title: "源集群",
          key: "sourceClusterCode",
          align: "center",
          width: 130,
          tooltip:true,
          resizable:true,
        },
        {
          title: "目标集群",
          key: "targetClusterCode",
          align: "center",
          width: 130,
          tooltip:true,
          resizable:true,
        },
        // {
        //   title: "目标集群名称",
        //   key: "targetClusterName",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        // },
      ],
      detailTableData:[],
      detailTitle1:[
        {
          title: '提示',
          width: 60,
          align: "center",
          fixed: 'left',
          render: (h, params) => {
            console.log("执行的状态",params.row.stat);
            if(params.row.stat==3){
              return h('div', [
                  h('Icon', {
                      props: {
                        type: 'md-checkmark-circle'
                      },
                      style:{
                        color:'#008000'
                      }
                  }),
              ]);
            }else{
              return h('div', [
                  h('Icon', {
                      props: {
                          type: 'md-close'
                      },
                      style:{
                        color:'#FF3300'
                      }
                  }),
              ]);
            }
          },
          resizable:true,
        },
        {
          title: "编号",
          key: "id",
          align: "center",
          width: 100,
          tooltip:true,
          resizable:true,
          // fixed: 'left'
        },
        // {
        //   title: "申请单名称",
        //   key: "applyFileName",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        //   // fixed: 'left'
        // },
        {
          title: "执行结果",
          key: "synMsg",
          align: "center",
          width: 130,
          tooltip:true,
          // fixed: 'left',
          render: (h, params) => {
            if(params.row.synMsg.search("成功")==-1){
              return h('div', [
                h('span', 
                  {style:{
                    color:'#FF3300',
                  }},
                  params.row.synMsg),
              ]);
            }else{
              return h('div', [
                h('span', 
                  {style:{
                    color:'#008000',
                  }},
                  params.row.synMsg),
              ]);
            }
          },
          resizable:true,
        },
        // {
        //   title: "申请单ID",
        //   key: "applyId",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        // },
        // {
        //   title: "检查前信息",
        //   key: "beCheckMsg",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        // },
        // {
        //   title: "code",
        //   key: "code",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        // },
        {
          title: "命名空间",
          key: "nameSpace",
          align: "center",
          width: 130,
          tooltip:true,
          resizable:true,
        },
        {
          title: "表名",
          key: "tableName",
          align: "center",
          width: 130,
          tooltip:true,
          resizable:true,
        },
        {
          title: "列簇",
          key: "colFamily",
          align: "center",
          width: 130,
          tooltip:true,
          resizable:true,
        },
        // {
        //   title: "校验后信息",
        //   key: "feCheckMsg",
        //   align: "center",
        //   width: 130,
        // },
        // {
        //   title: "信息",
        //   key: "message",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        // },
        {
          title: "操作类型",
          key: "operType",
          align: "center",
          width: 130,
          tooltip:true,
          render: (h, params) => {
            return h('div', [
              h('span', this.operType[params.row.operType-1])
            ]);
          },
          resizable:true,
        },
        // {
        //   title: "投产开始时间",
        //   key: "prodBeginDate",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', params.row.prodDate?this.$formatTime(params.row.prodDate,"yyyy-MM-dd"):"")
        //     ]);
        //   }
        // },
        // {
        //   title: "投产时间",
        //   key: "prodDate",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', params.row.prodDate?this.$formatTime(params.row.prodDate,"yyyy-MM-dd"):"")
        //     ]);
        //   }
        // },
        // {
        //   title: "投产结束时间",
        //   key: "prodEndDate",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', params.row.prodDate?this.$formatTime(params.row.prodDate,"yyyy-MM-dd"):"")
        //     ]);
        //   }
        // },
        // {
        //   title: "申请人",
        //   key: "reqUser",
        //   align: "center",
        //   width: 120,
        //   tooltip:true,
        // },
        // {
        //   title: "申请时间",
        //   key:"reqTime",
        //   align: "center",
        //   width: 100,
        //   tooltip:true,
        //    render: (h, params) => {
        //     return h('div', [
        //       h('span', params.row.reqTime?this.$formatTime(params.row.reqTime,"yyyy-MM-dd HH:mm:ss"):"")
        //     ]);
        //   }
        // },
        // {
        //   title: "源集群名称",
        //   key: "sourceClusterName",
        //   align: "center",
        //   width: 130,
        // },
        {
          title: "状态",
          key:"stat",
          align: "center",
          width: 100,
          tooltip:true,
          render: (h, params) => {
            return h('div', [
              h('span', this.stat[params.row.stat].value)
            ]);
          },
          resizable:true,
        },
        // {
        //   title: "同步时间",
        //   key: "synTime",
        //   align: "center",
        //   width: 120,
        //   tooltip:true,
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', params.row.synTime?this.$formatTime(params.row.synTime,"yyyy-MM-dd HH:mm:ss"):"")
        //     ]);
        //   }
        // },
        {
          title: "源集群",
          key: "sourceClusterCode",
          align: "center",
          width: 130,
          tooltip:true,
          resizable:true,
        },
        {
          title: "目标集群",
          key: "targetClusterCode",
          align: "center",
          width: 130,
          tooltip:true,
          resizable:true,
        },
        // {
        //   title: "目标集群名称",
        //   key: "targetClusterName",
        //   align: "center",
        //   width: 130,
        //   tooltip:true,
        // },
      ],
      detailTableData1:[],
      outerTitle1:[ //弹出的表格
        {
          type: 'expand',
          width: 50,
          // fixed: 'left',
          render: (h, params) => {
              return h('Table', {
                  attrs: {
                      data: this.detailTableData1[params.index],
                      columns:this.detailTitle1
                  }
              })
          },
          resizable:true,
        },
        {
          title: "编号",
          key: "id",
          align: "center",
          width: 160,
          tooltip:true,
          // fixed: 'left'
          resizable:true,
        },
        {
          title: "申请单名称",
          key: "applyFileName",
          align: "center",
          width: 200,
          tooltip:true,
          // fixed: 'left'
          resizable:true,
        },
        {
          title: "执行结果",
          key: "synMsg",
          align: "center",
          width: 200,
          tooltip:true,
          // fixed: 'left',
          render: (h, params) => {
            if(params.row.synMsg.search("成功")==-1){
              return h('div', [
                h('span', 
                  {style:{
                    color:'#FF3300',
                  }},
                  params.row.synMsg),
              ]);
            }else{
              return h('div',[
                h('span',{
                  style:{
                    color:'#008000',
                  }
                },params.row.synMsg)
              ])
            }
          },
          resizable:true,
        },
        {
          title: "租户",
          key: "tenantUser",
          align: "center",
          width: 200,
          // fixed:"right",
          tooltip:true,
          resizable:true,
        },
      ],
      outerTableData1:[],
      searchObj:{},
      stat:[],
      watchItem:[],
      selectedItem:[],
      operType:["同步","取消同步"],
      tableHeight:0
    }
  },
  methods: {
    // 查询
    async searchCon(){
      this.loading=true;
      console.log("OK",this.searchObj);
      let reg=/^\d{4}-\d{2}-\d{2}$/;
      if(this.searchObj.prodBeginDate&&!reg.test(this.searchObj.prodBeginDate)){
        this.searchObj.prodBeginDate=this.$formatTime(this.searchObj.prodBeginDate.getTime(),"yyyy-MM-dd");
      }
      if(this.searchObj.prodEndDate&&!reg.test(this.searchObj.prodEndDate)){
        this.searchObj.prodEndDate=this.$formatTime(this.searchObj.prodEndDate.getTime(),"yyyy-MM-dd");
      }
      if(this.searchObj.stat=="a"){
        this.searchObj.stat="";
      }
      // console.log(this.searchObj);
      // console.log(this.searchObj,"搜索信息");
      // this.searchObj={};
      let req=await applyAxios.applySearch({
        "applyFileName":this.searchObj.applyFileName,          // "资源申请单20200101.xsl",
        "tenantUser": this.searchObj.tenantUser,               //"租户1",
        "prodBeginDate": this.searchObj.prodBeginDate,         //"2020-01-01",
        "prodEndDate": this.searchObj.prodEndDate,             //"2020-01-30",
        "stat": this.searchObj.stat,                           //"0",
        "pageNum": this.currentPage,
        "pageSize": this.pageSize,
      })
      console.log(req);
      if(req.data.code==1){
        this.loading=false;
        this.tableData=req.data.data;
        this.totalNum=req.data.total;
        this.$Message.success(req.data.message);
        // this.searchObj={};
      }else{
        this.$Message.error(req.data.message)
      }
           
    },
    // 执行
    async carryOut(index){
      console.log("点击执行");
      this.handleSpinCustom();
      let res={};
      if(Array.isArray(index)){
        console.log(index);
        res=await syncCheck.carrySync(index)
      }else{
        console.log(index);
        let arr=[];
        arr.push(this.tableData[index])
        res=await syncCheck.carrySync(arr);
      }
      console.log(res);
      if(res.data.code==1){
        this.$Spin.hide();
        this.$Message.success(res.data.message)
        let arr1=res.data.data; 
        this.outerTableData1=arr1;
        console.log(this.outerTableData1,"执行弹出表数据");
        this.detailTableData1=[];
        arr1.forEach((item)=>{
          this.detailTableData1.push(item.applyDetailList); //此处超过一条
        })
        console.log(this.detailTableData1,"执行嵌套表数据");
        this.modal2=true;
        await this.reflesh();
      }else{
        this.$Message.error(res.data.message)
      }
    },
    // 校验
    async checkOut(index){
      // this.loading=true;
      this.handleSpinCustom();
      let res={};
      console.log("点击校验"); 
      if(Array.isArray(index)){
        console.log(index);
        res=await syncCheck.checkBeforeSync(index);
      }else{
        console.log(index);
        let arr=[];
        arr.push(this.tableData[index])
        res=await syncCheck.checkBeforeSync(arr);
      }
      console.log(res,"校验返回数据");
      if(res.data.code==1){
        // this.loading=false;
        this.$Spin.hide();
        this.$Message.success(res.data.message)
        let arr1=res.data.data; 
        this.outerTableData=arr1;
        console.log(this.outerTableData,"弹出表数据");
        this.detailTableData=[];
        arr1.forEach((item)=>{
          this.detailTableData.push(item.applyDetailList); //此处超过一条
        })
        console.log(this.detailTableData,"嵌套表数据");
        this.modal1=true;
        await this.reflesh();
      }else{
        this.$Message.error(res.data.message)
      }
    },
    // 换页
    pageChange(val){
      console.log(val);
      this.currentPage=val;
      this.reflesh();
    },
    // 每页条数改变
    onPageSize(val){
      console.log(val);
      this.pageSize=val;
      this.reflesh();
    },
    // 校验
    beforeSync(){
      if(this.selectedItem.length<=0){
        this.$Message.error("请选中数据后再校验");
        return;
      }
      this.checkOut(this.selectedItem);
    },
    // 执行
    syncAction(){
      if(this.selectedItem.length<=0){
        this.$Message.error("请选中数据后再执行");
        return;
      }
      this.carryOut(this.selectedItem);
    },
    // 选中某一行触发
    //@params selection已选项
    //@params row刚选项的项
    handleSelected(selection){
      this.selectedItem=selection;
      console.log("选中",selection);     
    },
   
    async getStat(){
      let req=await applyAxios.getApplyStat();
      console.log(req,"状态列表");
      this.stat=req.data;
    },
    // 换页
    pageChange(val){
      console.log(val);
      this.currentPage=val;
      this.reflesh();
    },
    // 每页条数改变
    onPageSize(val){
      console.log(val);
      this.pageSize=val;
      this.reflesh();
    },
  //   // 调用接口数据获取数据
    async reflesh(){
      this.loading=true;
      console.log("点击更新查询页面数据")
      let reg=/^\d{4}-\d{2}-\d{2}$/;
      if(this.searchObj.prodBeginDate!=""&&!reg.test(this.searchObj.prodBeginDate)){
        console.log(this.searchObj.prodBeginDate);
        this.searchObj.prodBeginDate=this.$formatTime(this.searchObj.prodBeginDate.getTime(),"yyyy-MM-dd");
      }
      if(this.searchObj.prodEndDate!=""&&!reg.test(this.searchObj.prodEndDate)){
        console.log(this.searchObj.prodEndDate);
        this.searchObj.prodEndDate=this.$formatTime(this.searchObj.prodEndDate.getTime(),"yyyy-MM-dd");
      }
      if(this.searchObj.stat=="a"){
        this.searchObj.stat="";
      }
      let req=await applyAxios.applySearch({
          "applyFileName":this.searchObj.applyFileName,          // "资源申请单20200101.xsl",
          "tenantUser": this.searchObj.tenantUser,               //"租户1",
          "prodBeginDate": this.searchObj.prodBeginDate,         //"2020-01-01",
          "prodEndDate": this.searchObj.prodEndDate,             //"2020-01-30",
          "stat": this.searchObj.stat,                           //"0",
          "pageNum": this.currentPage,
          "pageSize": this.pageSize,
      })
      // console.log(req);
      if(req.data.code==1){
        this.loading=false;
        this.tableData=req.data.data;
        this.totalNum=req.data.total;
        // this.$Message.success(req.data.message)
      }
    },
    // 查看详情
    watchDetail(index){
      this.watchItem=this.tableData[index];
      console.log(this.watchItem);  
      this.$router.push({
        path:'/appDetail/'+this.watchItem.id,
      });    
    },
    // 全局加载中
    handleSpinCustom () {
      this.$Spin.show({
          render: (h) => {
              return h('div', [
                  h('Icon', {
                      'class': 'demo-spin-icon-load',
                      props: {
                          type: 'ios-loading',
                          size: 18
                      }
                  }),
                  h('div', 'Loading')
              ])
          }
      });
      // setTimeout(() => {
      //     this.$Spin.hide();
      // }, 3000);
    },
    getTableHeight(){
		  this.tableHeight = window.innerHeight - this.$refs.tableName.$el.offsetTop - 170;
	  }
  },
  watch:{
    currentPage:function(newval){
      this.pageChange(newval)
    },
    pageSize:function(newval){
      this.onPageSize(newval)
    }
  },
  mounted() {
    window.addEventListener('resize', this.getTableHeight);
    this.getTableHeight();
    this.getStat();
    this.reflesh();
    document.getElementsByClassName('ivu-page-options-elevator')[0].children[0].setAttribute('id', 'pageInput')
    document.getElementById('pageInput').addEventListener('blur', (res) => {
    if (Number(res.target.value)>=1&&Number(res.target.value) <= Math.ceil(this.totalNum / this.pageSize)) {
      console.log(Number(res.target.value));
        this.currentPage = Number(res.target.value);
      }else{
        this.currentPage = 1;
      }
    })
  },
  created() {}
}
</script>
<style lang='less' scoped>
  .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
</style>
