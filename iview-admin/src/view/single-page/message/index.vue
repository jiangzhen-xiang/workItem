<template>
  <div class="serverWrapper">
    该功能开发中...
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
const listDic = {
  unread: "messageUnreadList",
  readed: "messageReadedList",
  trash: "messageTrashList"
};
export default {
  name: "message_page",
  data() {
    return {
      listLoading: true,
      contentLoading: false,
      currentMessageType: "unread",
      messageContent: "",
      showingMsgItem: {}
    };
  },
  computed: {
    ...mapState({
      messageUnreadList: state => state.user.messageUnreadList,
      messageReadedList: state => state.user.messageReadedList,
      messageTrashList: state => state.user.messageTrashList,
      messageList() {
        return this[listDic[this.currentMessageType]];
      },
      titleClass() {
        return {
          "not-unread-list": this.currentMessageType !== "unread"
        };
      }
    }),
    ...mapGetters([
      "messageUnreadCount",
      "messageReadedCount",
      "messageTrashCount"
    ])
  },
  methods: {
    ...mapMutations([
      //
    ]),
    ...mapActions([
      "getContentByMsgId",
      "getMessageList",
      "hasRead",
      "removeReaded",
      "restoreTrash"
    ]),
    stopLoading(name) {
      this[name] = false;
    },
    handleSelect(name) {
      this.currentMessageType = name;
    },
    handleView(msg_id) {
      this.contentLoading = true;
      this.getContentByMsgId({ msg_id })
        .then(content => {
          this.messageContent = content;
          const item = this.messageList.find(item => item.msg_id === msg_id);
          if (item) this.showingMsgItem = item;
          if (this.currentMessageType === "unread") this.hasRead({ msg_id });
          this.stopLoading("contentLoading");
        })
        .catch(() => {
          this.stopLoading("contentLoading");
        });
    },
    removeMsg(item) {
      item.loading = true;
      const msg_id = item.msg_id;
      if (this.currentMessageType === "readed") this.removeReaded({ msg_id });
      else this.restoreTrash({ msg_id });
    }
  },
  mounted() {
    this.listLoading = true;
    // 请求获取消息列表
    this.getMessageList()
      .then(() => this.stopLoading("listLoading"))
      .catch(() => this.stopLoading("listLoading"));
  }
};
</script>

<style lang="less">
.message-page {
  &-con {
    height: ~"calc(100vh - 176px)";
    display: inline-block;
    vertical-align: top;
    position: relative;
    &.message-category-con {
      border-right: 1px solid #e6e6e6;
      width: 200px;
    }
    &.message-list-con {
      border-right: 1px solid #e6e6e6;
      width: 230px;
    }
    &.message-view-con {
      position: absolute;
      left: 446px;
      top: 16px;
      right: 16px;
      bottom: 16px;
      overflow: auto;
      padding: 12px 20px 0;
      .message-view-header {
        margin-bottom: 20px;
        .message-view-title {
          display: inline-block;
        }
        .message-view-time {
          margin-left: 20px;
        }
      }
    }
    .category-title {
      display: inline-block;
      width: 65px;
    }
    .gray-dadge {
      background: gainsboro;
    }
    .not-unread-list {
      .msg-title {
        color: rgb(170, 169, 169);
      }
      .ivu-menu-item {
        .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only {
          display: none;
        }
        &:hover {
          .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only {
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>
