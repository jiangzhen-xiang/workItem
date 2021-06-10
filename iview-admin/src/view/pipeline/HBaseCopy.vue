<template>
  <div>
    <div id="chartWarraper" style="width:100%;height:500px;"></div>
    <Row class="margin-top-10" :gutter="8">
      <i-col span="8">
        <Card>
          <p slot="title">
            Lookup 元数据
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle" :data="tableData"></Table>
          </div>
        </Card>
      </i-col>
      <i-col span="8">
        <Card>
          <p slot="title">
            Foreach 元数据
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle1" :data="tableData1"></Table>
          </div>
        </Card>
        <Divider style="margin:10px 0" />
        <Card>
          <p slot="title">
            恢复 hbase 快照（自定义 SQL） ：
          </p>
          <div class="wrapper">
            <textarea name="" id="" style="width:100%;" rows="10">
restore snapshot xxx to @{activity.ForEachA.output.targetTableName} </textarea
            >
          </div>
        </Card>
      </i-col>
      <i-col span="8">
        <Card>
          <p slot="title">
            恢复 hbase 快照（自定义 SQL） ：
          </p>
          <div class="wrapper">
            <textarea name="" id="" style="width:100%;" rows="10">
make snapshot xxx from @{activity.ForEachA.output.tableName}
make snapshot xxx from @{activity.ForEachA.output.targetTableName} </textarea
            >
          </div>
        </Card>
        <Divider style="margin:10px 0" />
        <Card>
          <p slot="title">
            Copy 元数据
          </p>
          <div class="wrapper">
            <Table :columns="tableTitle2" :data="tableData2"></Table>
          </div>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
import excel from "@/libs/excel";
let hba1 = require("@/assets/images/hba1.png");
let hba2 = require("@/assets/images/hba2.png");
let hba3 = require("@/assets/images/hba3.png");
let hba4 = require("@/assets/images/hba4.png");
let hba5 = require("@/assets/images/pie3.png");
let hba6 = require("@/assets/images/hba6.png");

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
          title: "Items",
          key: "category1"
        },
        {
          title: "activity.LookUpA.output.value",
          key: "category2"
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
      tableData: [
        {
          category1: "Source",
          category2: " ",
          category3: 3
        },
        {
          category1: "Name",
          category2: "LookUpA",
          category3: 6
        }
      ],
      tableData1: [
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
                case 5:
                  img += hba5;
                  break;
                case 6:
                  img += hba6;
                  break;
                default:
                  img += hba1;
                  break;
              }
              return img;
            },
            edgeSymbol: ["circle"],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20
            },
            data: [
              {
                name: "1",
                img: 1,
                x: 10,
                y: 200
              },
              {
                name: "2",
                img: 2,
                x: 150,
                y: 200,
                label: {
                  show: false,
                  position: "top"
                }
              },
              {
                name: "3",
                img: 3,
                x: 290,
                y: 200,
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
              },
              {
                name: "5",
                img: 5,
                x: 150,
                y: 300,
                label: {
                  show: false,
                  position: "top"
                }
              },
              {
                name: "6",
                img: 6,
                x: 10,
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
                source: "2",
                target: "3"
              },
              {
                source: "3",
                target: "4"
              },
              {
                source: "4",
                target: "5"
              },
              {
                source: "5",
                target: "6"
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
