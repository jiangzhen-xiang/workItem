<template>
  <div>
    <div id="chartWarraper" style="width:100%;height:500px;"></div>
    <Divider style="margin:10px 0" />
    <Row class="margin-top-10" :gutter="8">
      <i-col span="24">
        <Card>
          <p slot="title"></p>
          <div class="" slot="extra">
            <ButtonGroup>
              <Button type="primary">新增同步</Button>
              <Button type="success">管理同步</Button>
              <Button type="info">快照拷贝</Button>
            </ButtonGroup>
          </div>
          <div class="wrapper">
            <Table :columns="tableTitle1" :data="tableData1" border></Table>
          </div>
        </Card>
        <Divider style="margin:10px 0" />
        <Card>
          <p slot="title"></p>
          <div class="" slot="extra">
            <ButtonGroup>
              <Button type="primary">新增同步</Button>
              <Button type="success">管理同步</Button>
              <Button type="info">快照拷贝</Button>
            </ButtonGroup>
          </div>
          <div class="wrapper">
            <Table :columns="tableTitle1" :data="tableData1" border></Table>
          </div>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
import excel from "@/libs/excel";
let hba1 = require("@/assets/images/jh1.png");
let hba2 = require("@/assets/images/jh2.png");
let hba3 = require("@/assets/images/jh3.png");
let hba4 = require("@/assets/images/jh4.png");

export default {
  name: "KafkaToKuduWithIUD",
  data() {
    return {
      exportLoading: false,
      tableTitle: [
        {
          title: "DataSet",
          key: "category1"
        },
        {
          title: " ",
          key: "category2"
        }
      ],
      tableTitle1: [
        {
          title: "表",
          key: "category1"
        },
        {
          title: "同步状态",
          key: "category2"
        },
        {
          title: "统计",
          key: "category3"
        },
        {
          title: "操作",
          key: "action",
          width: 120,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  }
                },
                "start"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  }
                },
                "stop"
              )
            ]);
          }
        }
      ],
      tableTitle2: [
        {
          title: "Src",
          key: "category1"
        },
        {
          title: "/YYY/@{dateformat(...)}",
          key: "category2"
        }
      ],
      tableData1: [
        {
          category1: "T1",
          category2: "Primary to Second(RealSync Normal)",
          category3: "10G / 1000h"
        },
        {
          category1: "T2",
          category2: "Primary to Second (SnapshotSync Complete)",
          category3: "1T / 3h"
        }
      ],
      tableData: [
        {
          category1: "Name",
          category2: "ForEachA"
        },
        {
          category1: "Acts",
          category2: "[sql1,copy,sql2]"
        }
      ],
      tableData2: [
        {
          category1: " ",
          category2: "Path必须包含日期"
        },
        {
          category1: "Dst",
          category2: "/ZZZ/@{...}"
        }
      ]
    };
  },
  methods: {
    init() {
      let option = {
        backgroundColor: "#fff",
        tooltip: {
          show: false
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            type: "graph",
            layout: "none",
            symbolSize: 100,
            roam: true,
            label: {
              show: true,
              position: "top"
            },
            symbol: (a, b) => {
              console.log("aaaaa====", a, b, hba1);
              let img = "image://";

              console.log("img====", b.data.img);
              switch (b.data.img) {
                case 2:
                  img += hba2;
                  break;
                case 3:
                  img += hba3;
                  break;
                case 4:
                  img += hba4;
                  break;
                default:
                  img += hba1;
                  break;
              }
              return img;
            },
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20
            },
            data: [
              {
                name: "1",
                img: 1,
                x: 10,
                y: 200,
                label: {
                  show: false,
                  position: "top"
                }
              },
              {
                name: "2",
                img: 2,
                x: 290,
                y: 200,
                label: {
                  show: false,
                  position: "top"
                }
              },
              {
                name: "3",
                img: 3,
                x: 10,
                y: 300,
                label: {
                  show: false,
                  position: "top"
                }
              },
              {
                name: "4",
                img: 4,
                x: 290,
                y: 300,
                label: {
                  show: false,
                  position: "top"
                }
              }
            ],
            // links: [],
            links: [
              {
                source: "1",
                target: "2"
              },
              {
                source: "1",
                target: "3"
              },
              {
                source: "3",
                target: "4"
              }
            ],
            lineStyle: {
              color: "#23cdfd",
              opacity: 3.9,
              width: 2,
              curveness: 0
            }
          }
        ]
      };
      let myChart = this.$echarts.init(
        document.getElementById("chartWarraper")
      );
      myChart.setOption(option);
    },
    exportExcel() {
      if (this.tableData.length) {
        this.exportLoading = true;
        const params = {
          title: ["一级分类", "二级分类", "三级分类"],
          key: ["category1", "category2", "category3"],
          data: this.tableData,
          autoWidth: true,
          filename: "分类列表"
        };
        excel.export_array_to_excel(params);
        this.exportLoading = false;
      } else {
        this.$Message.info("表格数据不能为空！");
      }
    }
  },
  created() {},
  mounted() {
    this.init();
  }
};
</script>
