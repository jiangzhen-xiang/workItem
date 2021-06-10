<template>
  <div>
    <Tabs value="name1">
      <TabPane label="基本" name="name1">
        <div class="tabConten">
          <Form ref="formBasic" :model="formBasic" :rules="ruleValidate" :label-width="80">
            <FormItem label="名称" prop="dataSetName">
              <Input v-model="formBasic.dataSetName" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="描述" prop="desc">
              <Input
                v-model="formBasic.desc"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="请输入"
              ></Input>
            </FormItem>
            <FormItem label="标签" prop="annotions">
              <Input
                v-model="formBasic.annotions"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="请输入"
              ></Input>
            </FormItem>
          </Form>
        </div>
      </TabPane>
      <TabPane label="连接" name="name2">
        <Form ref="formLink" :model="formLink" :rules="ruleValidate" :label-width="80">
          <FormItem label="HTTP连接" prop="url">
            <Input v-model="formValidate.url" placeholder="请输入"></Input>
          </FormItem>

          <FormItem label="服务是否验证" prop="isValidte">
            <RadioGroup v-model="formValidate.isValidte">
              <Radio label="0">否</Radio>
              <Radio label="1">是</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="身份验证类型" prop="validteType">
            <Select v-model="formValidate.validteType" placeholder="请选择">
              <Option value="0">普通</Option>
              <Option value="1">口令</Option>
            </Select>
          </FormItem>
          <FormItem label="用户名" prop="username" v-if="formValidate.validteType == '0'">
            <Input v-model="formValidate.username" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="密码" prop="password" v-if="formValidate.validteType == '0'">
            <Input v-model="formValidate.password" type="password"></Input>
          </FormItem>
          <FormItem label="口令" prop="command" v-if="formValidate.validteType == '1'">
            <Input v-model="formValidate.command" placeholder="请输入"></Input>
          </FormItem>

          <FormItem label="描述" prop="annotions">
            <Input
              v-model="formValidate.annotions"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="请输入"
            ></Input>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="参数" name="name3">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="名称" prop="dataSetName">
            <Input v-model="formValidate.dataSetName" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="类别" prop="type">
            <Select v-model="formValidate.type" placeholder="请选择">
              <Option value="mongodb">mongodb</Option>
              <Option value="kafka">kafka</Option>
              <Option value="hive">hive</Option>
            </Select>
          </FormItem>
          <FormItem label="HTTP连接" prop="url">
            <Input v-model="formValidate.url" placeholder="请输入"></Input>
          </FormItem>

          <FormItem label="服务是否验证" prop="isValidte">
            <RadioGroup v-model="formValidate.isValidte">
              <Radio label="0">否</Radio>
              <Radio label="1">是</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="身份验证类型" prop="validteType">
            <Select v-model="formValidate.validteType" placeholder="请选择">
              <Option value="0">普通</Option>
              <Option value="1">口令</Option>
            </Select>
          </FormItem>
          <FormItem label="用户名" prop="username" v-if="formValidate.validteType == '0'">
            <Input v-model="formValidate.username" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="密码" prop="password" v-if="formValidate.validteType == '0'">
            <Input v-model="formValidate.password" type="password"></Input>
          </FormItem>
          <FormItem label="口令" prop="command" v-if="formValidate.validteType == '1'">
            <Input v-model="formValidate.command" placeholder="请输入"></Input>
          </FormItem>

          <FormItem label="描述" prop="annotions">
            <Input
              v-model="formValidate.annotions"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="请输入"
            ></Input>
          </FormItem>
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
export default {
  name: 'pipeline',
  data() {
    return {
      formBasic: {
        dataSetName: '',
        desc: '',
        annotions: ''
      }

    }
  },
  methods: {},
  created() { },
  mounted() { }
}
</script>
