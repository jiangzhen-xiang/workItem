<template>
  <div>
    <Form
      ref="formValidate"
      :model="formValidate"
      :label-width="80"
      class="form"
    >
      <FormItem label="角色">
        <CheckboxGroup v-model="formValidate.checkbox">
            <Checkbox v-for="(item,index) in roleList" :label="item.name" :key="index" :disabled="true"></Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem style="text-align: right; padding-top: 10px">
        <Button type="default" @click="cancel" style="margin-right: 5px">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  props:['roleList'],
  data: function() {
    return {
        formValidate:{},
    }
  },
  methods: {
      cancel(){
          this.$emit("handleCancle","modal2");
      }
  },
  created() {}
}
</script>

<style lang='less' scoped>
</style>
