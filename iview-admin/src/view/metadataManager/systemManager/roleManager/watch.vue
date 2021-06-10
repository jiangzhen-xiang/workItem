<template>
  <div>
    <Form
      ref="formValidate"
      :model="formValidate"
      :label-width="80"
      class="form"
    >
      <FormItem label="角色:" prop="roleNamesDisplay">
                <Input v-model="formValidate.roleNamesDisplay" disabled />
      </FormItem>
      <FormItem style="text-align: right; padding-top: 10px">
                <Button type="default" @click="cancel" style="margin-right: 5px">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
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
