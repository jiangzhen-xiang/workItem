<template>
  <div class="topWarraper">
    <div style="padding-top: 30.6%;position: relative;">
      <div class="wrapperLink">
        <h4 class="h4">快速开始</h4>
        <div class="flex top">
          <div class="flex-item"
               v-for="(item, index) in topArr">
            <div class="round"
                 :class="index == 1?'handleDisabled':''"
                 @click="handleRouteTo(item,index)">
              <img :src="item.icon"
                   alt
                   srcset />
            </div>
            <div class="name">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <Row>
      <i-col span="24">
        <div class="typeWrapper">
          <div class="flex"
               style="padding: 0 8.66%;">
            <div class="flex-item"
                 v-for="(item, index) in linkArr">
              <!-- <img :src="item.icon" alt srcset /> -->
              <div class="borderWrapper">
                <div class="iconWrapper"
                     :class="item.background"
                     style="tont-size:48px;">
                  <img :src="item.icon"
                       alt
                       srcset />
                </div>
                <div class="name">{{item.name}}</div>
                <Icon type="ios-checkbox-outline"
                      v-if="item.isChoose" />
              </div>
            </div>
          </div>
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      topArr: [
        {
          name: '流式Pipeline',
          icon: require('@/assets/images/create1.png')
        },
        {
          name: '批量Pipeline',
          icon: require('@/assets/images/create2.png')
        },
        {
          name: '数据连接',
          icon: require('@/assets/images/create3.png')
        },
        {
          name: '元数据',
          icon: require('@/assets/images/create4.png')
        }
      ],
      linkArr: [
        {
          name: 'hive',
          icon: require('@/assets/images/hive.png'),
          background: 'f5bc08'
        },
        {
          name: 'hbase',
          icon: require('@/assets/images/hbase.png'),
          background: 'ce634e'
        },
        {
          name: 'impla',
          icon: require('@/assets/images/impla.png'),
          background: 'ed4a2'

        },
        {
          name: 'kudu',
          icon: require('@/assets/images/kudu.png'),
          background: 'bb3be'
        },
        {
          name: 'kafka',
          icon: require('@/assets/images/kafka.png'),
          background: 'a29d9c'
        },
        {
          name: 'redis',
          icon: require('@/assets/images/redis.png'),
          background: 'dbdd2'
        },
        {
          name: 'hdfs',
          icon: require('@/assets/images/hdfs.png'),
          background: 'dc7d'
        }
      ],
      configData: [
        {
          text: 'Platform变量',
          class: 'ios-cog'
        },
        {
          text: ' 更新变量',
          class: 'ios-refresh'
        }
      ],
      serveData: [
        {
          text: '数据统计',
          class: 'ios-pie-outline'
        },
        {
          text: ' 数据依赖',
          class: 'ios-podium-outline'
        },
        {
          text: '影响分析',
          class: 'ios-analytics'
        },
        {
          text: ' SQL性能',
          class: 'ios-pulse-outline'
        }
      ],
      ruleData: [
        {
          text: '创建业务规则',
          class: 'ios-book-outline'
        },
        {
          text: ' 规则统计&监控',
          class: 'ios-pie-outline'
        }
      ],
      flowData: [
        {
          text: '创建 SQLFlow',
          class: 'ios-pulse-outline'
        },
        {
          text: ' CopyBulk / 增量',
          class: 'ios-pulse-outline'
        },
        {
          text: 'Copy堡垒机HDFS',
          class: 'ios-pulse-outline'
        },
        {
          text: 'hbase replication',
          class: 'ios-pulse-outline'
        },
        {
          text: '创建 SQLFlowFlink)',
          class: 'ios-pulse-outline'
        },
        {
          text: 'kafka mirror',
          class: 'ios-pulse-outline'
        },
        {
          text: 'kudu replication',
          class: 'ios-pulse-outline'
        },
        {
          text: 'ES replication',
          class: 'ios-pulse-outline'
        }
      ],
      countTop: [
        {
          text: '帮助',
          class: 'ios-help-circle-outline'
        },
        {
          text: '功能',
          class: 'ios-information-circle-outline'
        },
        {
          text: '概念',
          class: 'ios-text-outline'
        }
      ],
      createData: [
        {
          text: '批量Pipeline',
          class: 'ios-cube-outline'
        },
        {
          text: '流式Pipeline',
          class: 'ios-cube-outline'
        },
        {
          text: 'StopTheWorld',
          class: 'ios-radio-button-off'
        },
        {
          text: 'ResumeTheWorld',
          class: 'ios-refresh-circle-outline'
        }
      ],
      tabData: [
        {
          text: 'Hive 连接',
          class: 'ios-attach'
        },
        {
          text: 'HBase 连接',
          class: 'ios-attach'
        },
        {
          text: 'Impala 连接',
          class: 'ios-attach'
        },
        {
          text: 'kudu 连接',
          class: 'ios-attach'
        },
        {
          text: 'Kafka 连接',
          class: 'ios-attach'
        },
        {
          text: 'Redis 连接',
          class: 'ios-attach'
        }
      ],

      tabData2: [
        {
          text: 'HDFS集群 拓扑',
          class: 'ios-git-network'
        },
        {
          text: 'hbase集群 拓扑',
          class: 'ios-git-network'
        },
        {
          text: 'kafka集群 拓扑',
          class: 'ios-git-network'
        },
        {
          text: 'kudu集群 拓扑',
          class: 'ios-git-network'
        }
      ],
      pieData: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      },
      current: 0
    }
  },
  methods: {
    handleRouteTo (item, index) {
      if (index == 0) {
        // this.$router.push({
        //   name: 'flink'
        // })
      } else if (index == 1) {
        // this.$router.push({
        //   name: 'translate'
        // })
      } else if (index == 2) {
        // this.$router.push({
        //   name: 'colony'
        // })
      } else {
        // this.$router.push({
        //   name: 'administrationManager'
        // })
      }
    },
    next () {
      if (this.current == 3) {
        this.current = 0
      } else {
        this.current += 1
      }
    }
  }
}
</script>
<style lang="less" scoped>
.wrapperLink {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding-left: 10.9%;
  padding-right: 10.9%;
  padding-top: 5.5%;
}
.borderWrapper {
  border-radius: 10px;
  overflow: hidden;
  background: #fff8f5;
  border: 1px solid #ddd;
  box-shadow: 2px 4px 4px rgba(221, 221, 221, 0.8);
  padding-top: 91%;
  position: relative;
  height: 0;
  .iconWrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 70%;
    display: -webkit-flex;
    display: flex;
    justify-content: center;
    padding: 20px;

    svg {
      font-size: 100px;
      margin-top: 25px;
    }
  }
  .f5bc08 {
    background: #f5bc08;
  }
  .ce634e {
    background: #ce634e;
  }
  .ed4a2 {
    background: #0ed4a2;
  }
  .ed4a2 {
    background: #0ed4a2;
  }
  .bb3be {
    background: #8bb3be;
  }
  .a29d9c {
    background: #a29d9c;
  }
  .dbdd2 {
    background: #4dbdd2;
  }
  .dc7d {
    background: #23dc7d;
  }
}
/* ======= */
.round {
  display: inline-block;
  cursor: pointer;
  border-radius: 50%;
  background-color: #fff;
  overflow: hidden;
  margin: 20px;
  padding: 20px;
  display: inline-block;
  border-radius: 50%;
  background-color: #fff;
  overflow: hidden;
  margin: 20px;
  padding: 20px;
  width: 45.8%;
  padding: 0;
  padding-top: 45.8%;
  height: 0;
  position: relative;
  z-index: 0;
}
.round.handleDisabled {
  cursor: not-allowed;
}
.round img {
  width: 66.7% !important;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  color: #fff;
}

.typeWrapper .name {
  font-size: 16px;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  height: 30%;
  text-align: center;
  width: 80%;
  text-align: center;
  margin: 0 20px;
}
.typeWrapper .name::after {
  display: inline-block;
  height: 100%;
  width: 0;
  vertical-align: middle;

  content: " ";
}
.top .name {
  color: #fff;
  font-size: 16px;
}
.round img {
  width: 100%;
}
.h4 {
  font-size: 48px;
  line-height: 42px;
  color: #fff;
}
.topWarraper {
  background: url("../../../assets/images/bj.png") no-repeat center top;
  background-size: 100% auto;
  display: none;
}
.flex {
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}
.top .flex-item {
  padding: 20px;
  width: 25%;
  text-align: center;
  cursor: pointer;
}
.flex-item {
  padding: 0 3.18% 6.37% 3.18%;
  width: 33%;
  text-align: center;
  cursor: pointer;
}
.typeWrapper .flex-item:hover {
  transform: scale(1.1);
  transition: all 0.5s ease-in-out;
}

.flex-item img {
  max-width: 100%;
  border-radius: 10px;
}
.tile-stats {
  position: relative;
  display: block;
  background: #303641;
  padding: 20px;
  margin-bottom: 10px;
  overflow: hidden;
  -webkit-border-radius: 5px;
  -webkit-background-clip: padding-box;
  -moz-border-radius: 5px;
  -moz-background-clip: padding;
  border-radius: 5px;
  background-clip: padding-box;
  -webkit-transition: all 300ms ease-in-out;
  -moz-transition: all 300ms ease-in-out;
  -o-transition: all 300ms ease-in-out;
  transition: all 300ms ease-in-out;
}
.tile-stats.tile-red {
  background: #f56954;
}
.tile-stats.tile-blue {
  background: #0073b7;
}
.tile-stats.tile-aqua {
  background: #00c0ef;
}
.tile-stats.tile-green {
  background: #00a65a;
}
.tile-stats.tile-red .num,
.tile-stats.tile-red h3,
.tile-stats.tile-red p {
  color: #fff;
}
.tile-stats h3 {
  font-size: 17px;
  margin-top: 5px;
}
.tile-stats.tile-green .num,
.tile-stats.tile-green h3,
.tile-stats.tile-green p {
  color: #fff;
}
.tile-stats.tile-aqua .num,
.tile-stats.tile-aqua h3,
.tile-stats.tile-aqua p {
  color: #fff;
}
.tile-stats.tile-blue .num,
.tile-stats.tile-blue h3,
.tile-stats.tile-blue p {
  color: #fff;
}
.flex::after {
  content: "";

  flex: auto;
}
</style>
<style>
/* .flex::after {
  content: "";

  flex: auto;
} */
</style>
