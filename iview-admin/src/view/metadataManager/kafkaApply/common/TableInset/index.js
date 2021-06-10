import TableInsert from './TableInsert.vue'
export default TableInsert



/**
 * @description 新增或者编辑的时候，可用于渲染弹框及其中的form控件
 * @params tableInsertShow 控制显示隐藏（必填）
 *         Boolean类型     true展示/false隐藏
 *
 * @params titleData 控制form表单控件类型和参数（必填，下方例1）
 *         Array类型 每个控件都是一个对象，包含在其中。在直接调用表格的时候可以写在 tableOperation 属性编辑对象中的 formList 中。
 *         title：控件title，（String，必填）
 *         filedEn：控件绑定属性，（String，必填）
 *         type：控件类型，如input，select，datetime，date，time，radio，checkbox，textarea（String，必填）
 *         isVerify：控件输入值是否进行校验，（boolean，选填，默认false）
 *         ruleVerify：控件校验规则，（[{}],需要校验时必填）
 *         selectedData：控件类型type为select时的数据，（[{title:'',value:''}],type为selectedData时必填）
 *
 * @params tableInsertData 控制反显数据（可选，仅编辑情况下）
 *         Object类型 你要展示的那些反显数据，或者直接所有数据
 *
 * @事件   tableInsert 取消/确认返回在统一事件中了
 *         function类型 返回值是对象
 *         status：ok确定/fail取消
 *         data：[],（成功是数组中有值，失败空数组）
 */


//例1
// [
//   {
//     title: '地址',
//     filedEn: 'platType',
//     type: 'select',
//     isVerify: true,
//     ruleVerify: [{
//       required: true,
//       message: 'Please select the city',
//       trigger: 'change'
//     }],
//     selectedData: [{
//       title: 'B1',
//       value: 'B1'
//     }, {
//       title: 'B2',
//       value: 'B2'
//     }]
//   }
// ]
