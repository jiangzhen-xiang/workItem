import TableNew from './TableNew.vue'
export default TableNew


/**
 * @description 二次封装的表格分页组合
 * @params data 表格数据，结构同iview（必填）
 *
 * @params title 表格表头，结构同iview（必填）
 *         title中之前控制多选列和操作列的项，现在依旧控制，但多选默认为有记忆性的，操作列中具体按钮由 tableOperation 属性控制。
 *
 * @params tableOperation 控制表格中的操作列按钮（title中有操作列是必填，下方例1）
 *         Array类型 每个控件都是一个对象，包含在其中。在直接调用表格的时候可以写在tableOperation属性编辑对象中的formList中。
 *         title：button文字，（String，必填）
 *         typeBtn：button类型，info、error等同iview（String，必填）
 *         clickBtn：button事件，编辑、删除、其他，固定的（String，必填）
 *         formList：编辑按钮调用弹窗是用（Array，编辑按钮必填）
 *
 * @params deleteText 删除提示语（可选，默认‘确认删除！’）
 *         String类型
 *
 * @params pageShow 分页是否展示,(可选，默认‘展示’)
 *         Boolean true展示/false隐藏
 *
 * @params totalPage 分页数据总条数（展示分页是必填，）
 *         Number
 *
 * @事件   changePage 分页切换事件（包括换页，切换条数）
 *         function类型 返回值是对象
 *         pageSize: 页面条数,
 *         pageNum: 页数,
 *
 * @事件   editorData 编辑返回事件（）
 *         function类型 返回值是对象
 *         type: 按钮事件类型（默认'editor'）
 *         index: 修改数据所在下标,
 *         newData: 修改后的数据,
 *         oldData: 修改前的数据（后期可以考虑不传，有下标啊）
 *
 * @事件   deleteData 删除返回事件（）
 *         function类型 返回值是对象
 *         type: 按钮事件类型（默认'delete'）,
 *         index: 删除数据所在下标,
 *         boolean: true/false，在点击删除按钮时返回第一次值false，此时利于后台校验，并返回校验信息，展示后用户仍确定删除，返回第二次直true。
 *
 * @事件   otherBtnClick 其他按钮事件（编辑删除传入相应值后有对应弹框，其他按钮事件没有）
 *         type: 按钮事件类型（用户传入的按钮title）,
 *         index: 操作数据所在下标,
 */

//好多数据是死的，比如按钮的事件，编辑、删除加的事件我写的死的，按说用户可以不填，但是现在还要填，有待优化

// 弹框展示页有点问题，将v-if换成v-show不能正常展示，但是频繁点击编辑，用v-if是不是不太好


// 举例1
// [
//   {
//     title: '编辑',
//     typeBtn: 'info',
//     clickBtn: 'editorTab(row,index)',
//     formList: [
//       {
//         title: '姓名',
//         filedEn: 'tableNameEn',
//         type: 'input',
//         isVerify: true,
//         ruleVerify: [{ required: true, message: 'The name cannot be empty', trigger: 'blur' }],
//       },
//     ]
//   },
//   {
//     title: '删除',
//     typeBtn: 'error',
//     clickBtn: 'deleteTab(row,index)'
//   },
//   {
//     title: '其他',
//     typeBtn: 'info',
//     clickBtn: 'btnClick(row,index)'
//   }
// ]