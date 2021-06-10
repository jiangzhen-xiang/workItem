<template>
  <div>
        <div style="padding: 10px;background: #f8f8f9">
            <Card title="Thunderbird 邮件 - wang.tuo@yoyosys.com.cn" icon="ios-options" :padding="0" shadow style="width: 100%;">
                <Card style="width:100%">
                    <p slot="title">
                        电子邮件
                    </p>
                    <!-- <a href="#" slot="extra" @click.prevent="changeLimit">
                        <Icon type="ios-loop-strong"></Icon>
                        Change
                    </a> -->
                    <ul>
                        <li><Icon type="ios-film-outline"></Icon>阅读</li>
                        <li><Icon type="ios-film-outline"></Icon>编写</li>
                        <!-- <li v-for="item in randomMovieList">
                            <a :href="item.url" target="_blank">{{ item.name }}</a>
                            <span>
                            <Icon type="ios-star" v-for="n in 4" :key="n"></Icon><Icon type="ios-star" v-if="item.rate >= 9.5"></Icon><Icon type="ios-star-half" v-else></Icon>
                            {{ item.rate }}
                            </span>
                        </li> -->
                    </ul>
                </Card>
                <Card style="width:100%">
                    <p slot="title">
                        账户
                    </p>
                    <ul>
                        <li><Icon type="ios-film-outline"></Icon>账户设置</li>
                        <li>
                            <p><Icon type="ios-film-outline"></Icon>设置账户</p>
                            <ul class="conp">
                                <li><Icon type="ios-film-outline"></Icon>电子邮件</li>
                                <li><Icon type="ios-film-outline"></Icon>电子邮件</li>
                                <li><Icon type="ios-film-outline"></Icon>电子邮件</li>
                                <li><Icon type="ios-film-outline"></Icon>电子邮件</li>
                            </ul>
                        </li>
                    </ul>
                </Card>
                <Card style="width:100%">
                    <p slot="title">
                        高级功能
                    </p>
                    <ul>
                        <li><Icon type="ios-film-outline"></Icon>账户设置</li>
                        <li><Icon type="ios-film-outline"></Icon>账户设置</li>
                        <li><Icon type="ios-film-outline"></Icon>账户设置</li>
                        <li><Icon type="ios-film-outline"></Icon>账户设置</li>
                    </ul>
                </Card>
            </Card>
        </div>
        
    <div style="height:200px;">
        <i-circle :percent="per">
            <span class="demo-Circle-inner" style="font-size:24px">80%</span>
        </i-circle>
        <!-- <Circle :percent="100" stroke-color="#5cb85c">
            <Icon type="ios-checkmark" size="60" style="color:#5cb85c"></Icon>
        </Circle>
        <Circle :percent="35" stroke-color="#ff5500">
            <span class="demo-Circle-inner">
                <Icon type="ios-close" size="50" style="color:#ff5500"></Icon>
            </span>
        </Circle> -->
    </div>
    <div>

    <button type="primary" @click="open(false)">Open notice</button>
    </div>
  </div> 
</template>

<script>
export default {
  data () {
    return {
      switchValue: true,
      per:0,
    }
  },
  methods: {
      percentChange(){
          let timer=setInterval(()=>{
              this.per++
              if(this.per>=80){
                  clearInterval(timer);
              }
          });
      },
       open (nodesc) {
                this.$Notice.open({
                    title: 'Notification title',
                    desc: nodesc ? '' : 'Here is the notification description. Here is the notification description. '
                });
            }
  },
    mounted() {
        this.percentChange();
    },
}
</script>

<style scoped>
    .demo-split{
        height: 200px;
        border: 1px solid #dcdee2;
    }
    .demo-split-pane{
        padding: 10px;
    }
    ul,ul li{
        list-style: none;
    }
    .conp{
        overflow: hidden;
        margin-left:30px;
    }
    .conp li{
        float:left;
        margin:5px 10px;
    }
</style>
