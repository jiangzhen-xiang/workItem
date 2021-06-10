<template>
  <div>
    <div class="test">
      <Card>
        <p slot="title">
          <Icon type="ios-list-box-outline"></Icon>
          1：生成 / 恢复 hbase 快照（自定义SQL）：
        </p>
        <a href="#" slot="extra" @click="handleFormat">
          <Icon type="ios-loop-strong"></Icon>
          格式化
        </a>

        <div class="sqlWarraper cm-s-sqlTheme .cm-s-ambiance">
          <codemirror
            ref="myCm"
            :value="code"
            :options="cmOptions"
            @ready="onCmReady"
            @focus="onCmFocus"
            @input="onCmCodeChange"
          >
          </codemirror>
        </div>
      </Card>
    </div>
    <Divider />
    <div class="test">
      <Card>
        <p slot="title">
          <Icon type="ios-list-box-outline"></Icon>
          2：Hive 支持 Update 和 Delete（自定义SQL）
        </p>
        <a href="#" slot="extra" @click="handleFormat2">
          <Icon type="ios-loop-strong"></Icon>
          格式化
        </a>

        <div class="sqlWarraper cm-s-sqlTheme .cm-s-ambiance">
          <codemirror
            ref="myCm"
            :value="code2"
            :options="cmOptions"
            @ready="onCmReady2"
            @focus="onCmFocus2"
            @input="onCmCodeChange2"
          >
          </codemirror>
        </div>
      </Card>
    </div>
    <Divider />
    <div class="test">
      <Card>
        <p slot="title">
          <Icon type="ios-list-box-outline"></Icon>
          3：支持机器学习算法（自定义 SQL，让应用团队的交互式数据探索更简单）
        </p>
        <a href="#" slot="extra" @click="handleFormat3">
          <Icon type="ios-loop-strong"></Icon>
          格式化
        </a>
        <div class="sqlWarraper cm-s-sqlTheme .cm-s-ambiance">
          <codemirror
            ref="myCm"
            :value="code3"
            :options="cmOptions"
            @ready="onCmReady3"
            @focus="onCmFocus3"
            @input="onCmCodeChange3"
          >
          </codemirror>
        </div>
      </Card>
    </div>
    <Divider />
    <div class="test">
      <Card>
        <p slot="title">
          <Icon type="ios-list-box-outline"></Icon>
          比较：使用 python 或 pyspark 的实现
        </p>
        <a href="#" slot="extra" @click="handleFormat">
          <Icon type="ios-loop-strong"></Icon>
          格式化
        </a>
        <Row :gutter="16">
          <i-col :span="12">
            <div class="sqlWarraper cm-s-sqlTheme ">
              <codemirror
                ref="myCm"
                :value="phycode"
                :options="cmOptionsPhy"
                @ready="cmOptionsPhy"
                @focus="onCmFocusPhy"
              >
              </codemirror>
            </div>
          </i-col>
          <i-col :span="12">
            <div class="sqlWarraper cm-s-sqlTheme ">
              <codemirror
                ref="myCm"
                :value="sparkcode"
                :options="cmOptionsSpark"
                @ready="cmOptionsPhy"
                @focus="onCmFocusPhy"
              >
              </codemirror>
            </div>
          </i-col>
        </Row>
      </Card>
    </div>
    <Divider />
    <div class="test">
      <Card>
        <p slot="title">
          <Icon type="ios-list-box-outline"></Icon>
          4：更多自定义 SQL 和 定制化 SQ
        </p>
        <a href="#" slot="extra" @click="handleFormat4">
          <Icon type="ios-loop-strong"></Icon>
          格式化
        </a>
        <div class="sqlWarraper cm-s-sqlTheme cm-s-ambiance">
          <codemirror
            ref="myCm"
            :value="code4"
            :options="cmOptions"
            @ready="onCmReady4"
            @focus="onCmFocus4"
            @input="onCmCodeChange4"
          >
          </codemirror>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
// import TreeSelect from "_c/tree-select";
import dedent from "dedent";

import { codemirror } from "vue-codemirror";

import "codemirror/theme/base16-dark.css";
import "codemirror/lib/codemirror.css";

import "codemirror/mode/sql/sql.js";
import "codemirror/mode/python/python.js";

import sqlFormatter from "sql-formatter";

export default {
  name: "tree_select_page",
  components: {
    sqlFormatter,
    codemirror
  },
  data() {
    return {
      code2: "",
      code3: "",
      code4: "",
      code: "",
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: "text/x-mysql",
        theme: "base16-dark",
        lineNumbers: true,
        line: true
        // more codemirror options, 更多 codemirror 的高级配置...
      },
      sparkcode: "del 'For' spark",
      phycode: "python",
      cmOptionsSpark: {
        // codemirror options
        tabSize: 4,
        mode: "text/x-python",
        theme: "base16-dark",
        lineNumbers: true,
        line: true
        // more codemirror options, 更多 codemirror 的高级配置...
      },
      cmOptionsPhy: {
        // codemirror options
        tabSize: 4,
        mode: "text/x-python",
        theme: "base16-dark",
        lineNumbers: true,
        line: true
        // more codemirror options, 更多 codemirror 的高级配置...
      },
      treeSelected: [112, 113],
      treeData: []
    };
  },
  mounted() {},
  computed: {
    codemirror() {
      return this.$refs.myCm.codemirror;
    }
  },
  methods: {
    handleFormat() {
      // let keyCode = e.keyCode || e.which || e.charCode;
      // let ctrlKey = e.ctrlKey || e.metaKey;
      // if (ctrlKey && keyCode == 13) {
      //   this.code = sqlFormatter.format(this.code);
      // }

      this.code = sqlFormatter.format(this.code);
    },
    handleFormat2() {
      // let keyCode = e.keyCode || e.which || e.charCode;
      // let ctrlKey = e.ctrlKey || e.metaKey;
      // if (ctrlKey && keyCode == 13) {
      //   this.code = sqlFormatter.format(this.code);
      // }

      this.code2 = sqlFormatter.format(this.code2);
    },
    handleFormat3() {
      // let keyCode = e.keyCode || e.which || e.charCode;
      // let ctrlKey = e.ctrlKey || e.metaKey;
      // if (ctrlKey && keyCode == 13) {
      //   this.code = sqlFormatter.format(this.code);
      // }

      this.code3 = sqlFormatter.format(this.code3);
    },
    handleFormat4() {
      // let keyCode = e.keyCode || e.which || e.charCode;
      // let ctrlKey = e.ctrlKey || e.metaKey;
      // if (ctrlKey && keyCode == 13) {
      //   this.code = sqlFormatter.format(this.code);
      // }

      this.code4 = sqlFormatter.format(this.code4);
    },
    onCmReady(cm) {
      console.log("the editor is readied!", cm);
      this.code = sqlFormatter.format(this.code);
    },
    onCmFocus(cm) {
      console.log("the editor is focus!", cm);
    },
    onCmReady2(cm) {
      console.log("the editor is readied!", cm);
      this.code = sqlFormatter.format(this.code);
    },
    onCmFocus2(cm) {
      console.log("the editor is focus!", cm);
    },
    onCmReady3(cm) {
      console.log("the editor is readied!", cm);
      this.code = sqlFormatter.format(this.code);
    },
    onCmFocus3(cm) {
      console.log("the editor is focus!", cm);
    },
    onCmCodeChange(newCode) {
      console.log("this is new code", newCode);
      this.code = newCode;
      // this.code = sqlFormatter.format(newCode);
    },
    onCmCodeChange2(newCode) {
      console.log("this is new code", newCode);
      this.code2 = newCode;
      // this.code = sqlFormatter.format(newCode);
    },
    onCmCodeChange3(newCode) {
      console.log("this is new code", newCode);
      this.code3 = newCode;
      // this.code = sqlFormatter.format(newCode);
    },
    onCmReady4(cm) {
      console.log("the editor is readied!", cm);
      this.code4 = sqlFormatter.format(this.code4);
    },
    onCmFocus4(cm) {
      console.log("the editor is focus!", cm);
    },
    onCmCodeChange4(newCode) {
      console.log("this is new code", newCode);
      this.code4 = newCode;
      // this.code4 = sqlFormatter.format(newCode);
    },
    onCmReadyPhy(cm) {
      console.log("the editor is readied!", cm);
      this.code = sqlFormatter.format(this.code);
    },
    onCmFocusPhy(cm) {
      console.log("the editor is focus!", cm);
    },
    onCmCodeChangePhy(newCode) {
      console.log("this is new code", newCode);
      // this.code = newCode;
      this.phycode = newCode;
    }
  }
};
</script>

<style lang="less" scoped>
/*选中区域*/
.cm-s-sqlTheme {
  /deep/.CodeMirror-activeline-background {
    background: #d7d4f0;
  }
  /deep/ .CodeMirror-selected {
    background: #d7d4f0;
  }
  /deep/ .CodeMirror-linenumber {
    color: #aeaeae;
  }
  /deep/ .cm-quote {
    color: #090;
  }
}
.cm-s-sqlTheme .CodeMirror-selected {
  background: #d7d4f0;
}
.cm-s-sqlTheme .CodeMirror-linenumber {
  color: #aeaeae;
} /*行号数字*/
.cm-s-sqlTheme .cm-quote {
  color: #090;
} /*引号*/
.cm-s-sqlTheme .cm-keyword {
  color: #3300cc;
} /*关键字，例如：SELECT*/
.cm-s-sqlTheme .cm-number {
  color: #333333;
} /*数字*/
.cm-s-sqlTheme .cm-variable-2 {
  color: #333333;
} /*变量2，例如：a.id中的.id*/
.cm-s-sqlTheme .cm-comment {
  color: #009933;
} /*注释*/
.cm-s-sqlTheme .cm-string {
  color: #009933;
} /*字符串*/
.cm-s-sqlTheme .cm-string-2 {
  color: #009933;
} /*字符串*/
</style>
