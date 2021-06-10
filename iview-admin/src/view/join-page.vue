<template>
  <div>
    <Card shadow >
      <div slot="title" style="height:33px;line-height:33px;">
              <Icon type="ios-list-box-outline"></Icon>
              Visual expression builder
      </div>
            <div class="btn-groups" slot="extra">
<ButtonGroup>
        <Button type="success">Expression reference documentation</Button>
        <Button icon="ios-exit-outline"></Button>
        <Button icon="ios-expand"></Button>
        <Button icon="ios-close-circle-outline"></Button>
    </ButtonGroup>
            </div>
      <row class="join-page" :gutter="32">
        <i-col span="10">

          <Card style="text-align:left">
            <p slot="title">
              <Icon type="ios-list-box-outline"></Icon>
              Functions
            </p>
            <a href="#" slot="extra" @click.prevent="changeLimit" >
              <Icon type="ios-loop-strong"></Icon>
              《
            </a>
            <div class="test">
                <div class="input" style="padding-bottom:10px;">
                   <Input placeholder="请输入" >
                      <Icon type="ios-search" slot="prefix" />
                  </Input>
                </div>

              <Tabs :animated="false">
        <TabPane label="All">
          <List  border size="small">
            <ListItem><span style="font-size:12px;margin-right:10px;">abc</span>Movie</ListItem>
            <ListItem><span style="font-size:12px;margin-right:10px;">abc</span>Title</ListItem>
            <ListItem><span style="font-size:12px;margin-right:10px;">abc</span>genres</ListItem>
        </List>
        </TabPane>
        <TabPane label="Functions">标签二的内容</TabPane>
        <TabPane label="input schema">标签三的内容</TabPane>
        <TabPane label="Parameters">标签三的内容</TabPane>
    </Tabs>
            </div>
          </Card>
        </i-col>
        <i-col span="14">
          <div class="join-page-other">
            <div class="textarea" >
                <Input v-model="value17" maxlength="100" show-word-limit type="textarea" placeholder="" style="height:250px;margin-bottom:10px;" />
            </div>
            <div class="btn-group">
              <ButtonGroup>
                  <Button type="default">+</Button>
                  <Button type="default">-</Button>
                  <Button type="default">*</Button>
                  <Button type="default">/</Button>
                  <Button type="default">||</Button>
                  <Button type="default">&&</Button>
                  <Button type="default">!</Button>
                  <Button type="default">^</Button>
                  <Button type="default">==</Button>
                  <Button type="default">===</Button>
                  <Button type="default"><=></Button>
                  <Button type="default">!=</Button>
                  <Button type="default">></Button>
                  <Button type="default"><</Button>
                  <Button type="default">>=</Button>
                  <Button type="default"><=</Button>
                  <Button type="default">[]</Button>

              </ButtonGroup>

            </div>

          </div>
        </i-col>
      </row>
      <Divider />
      <row>
        <i-col :span="24">
          <Collapse v-model="value1">
            <Panel name="1">
              Data view
              <div slot="content">
                <Table border :columns="columns1" :data="data1"></Table>
                <row>
                  <i-col :span="10" style="padding-top:10px;">

                <ButtonGroup>
                  <Button type="success">Save and finish</Button>
                  <Button type="default">Cancel</Button>
                  <Button type="default">Clear content</Button>
              </ButtonGroup>
                  </i-col>
                  <i-col :span="14">
                    <div class="pageWarapper" style="padding-top:10px;text-align:right;">
<Page :total="data1.length" show-total show-elevator />
                    </div>

                  </i-col>
                </row>

              </div>
            </Panel>
            </Panel>
          </Collapse>

        </i-col>
      </row>
      <row>
        <i-col :span="24" style="padding-top:10px;">

        </i-col>
      </row>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'join_page',
  data () {
    return {
      value1: 1,
      value17: 'year < = 1920',
      columns1: [{
        title: 'Output',
        key: 'name'
      },
      {
        title: 'year',
        key: 'age'
      } ],
      data1: [{
        name: 'X',
        age: 18,
        address: 'New York No. 1 Lake Park',
        date: '2016-10-03'
      },
      {
        name: 'X',
        age: 24,
        address: 'London No. 1 Lake Park',
        date: '2016-10-01'
      },
      {
        name: 'X',
        age: 30,
        address: 'Sydney No. 1 Lake Park',
        date: '2016-10-02'
      },
      {
        name: 'X',
        age: 26,
        address: 'Ottawa No. 2 Lake Park',
        date: '2016-10-04'
      }]
    }
  }
}
</script>
<style>
.textarea textarea{

height:100%;

}
.join-page {
  text-align: center;
}
.qq-group-img {
  width: 100%;
}
.join-page-other-icon {
  width: 20px;
  vertical-align: middle;
  margin-right: 6px;
}
.join-page-other {
  text-align: left;
}
.join-page-other .ivu-btn {
  margin-right: 6px;
}
</style>
