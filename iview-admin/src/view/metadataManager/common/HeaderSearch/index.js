import HeaderSearch from './HeaderSearch.vue'
export default HeaderSearch


/**
 * @description 页面顶部搜索部分
 * @params headerTitle 展示参数
 *                  headerTitle:{
 *                      //搜索条件
 *                      titleInput:[{
 *                          models:'name',
 *                          placeholder:'姓名',
 *                          type:'select',
 *                          options:[
 *                              {name:'1',value:'_1'}
 *                          ]
 *                      },
 *                      {
 *                          models:'timer',
 *                          placeholder:'时间',
 *                          type:'date'
 *                      },
 *                      {
 *                          models:'address',
 *                          placeholder:'住址',
 *                      }],
 *
 *                      //上传按钮
 *                      titleUpload: ['上传', '上传2'],
 *
 *                      //其他按钮
 *                      titleBtn: ['校验', '新增']
 *                  }
 *
 *
 * @事件   searchClick 取消/确认返回在统一事件中了
 *
 *         类型function 返回值是对象
 *         返回值参数{}：搜索条件
 *
 * @事件   btnClick 取消/确认返回在统一事件中了
 *
 *         类型function 返回值是对象
 *         返回值参数type：按钮类型
 */