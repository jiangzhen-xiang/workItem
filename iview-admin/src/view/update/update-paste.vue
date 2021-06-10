<template>
  <div>11123</div>
</template>

<script>
export default {
  name: "update_paste_page",
  components: {
    PasteEditor
  },
  data() {
    return {
      pasteDataArr: [],
      columns: [],
      tableData: [],
      validated: true,
      errorIndex: 0
    };
  },
  methods: {
    handleSuccess() {
      this.validated = true;
    },
    handleError(index) {
      this.validated = false;
      this.errorIndex = index;
    }
  }
};
</script>

<style lang="less" scoped>
.update-paste {
  &-con {
    height: 350px;
  }
  &-btn-con {
    box-sizing: content-box;
    height: 30px;
    padding: 15px 0 5px;
  }
}
.paste-tip {
  color: #19be6b;
}
</style>
