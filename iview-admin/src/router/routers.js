import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [{

  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录',
    hideInMenu: true
  },
  component: () => import('@/view/login/login.vue')
},
{
  path: '/',
  name: '_home',
  redirect: '/home',
  component: Main,
  meta: {
    // hideInMenu: true,
    hideInBread: true,
    notCache: true,
    title: "首页"
  },
  children: [{
    path: '/home',
    name: 'home',
    meta: {
      // hideInMenu: true,
      hideInBread: true,
      title: '首页',
      notCache: true,
      // icon: 'md-home'
      icon: 'home1'
    },
    component: () => import('@/view/single-page/home')
    //  =============nrdp ===========
    // component: () => import('@/view/authority/apply/apply.vue')
    // component: () => import('@/view/authority/config/config.vue')
    // component: () => import('@/view/authority/author/author.vue')
    // component: () => import('@/view/authority/record/record.vue')
    // component: () => import('@/view/authority/welcome/welcome.vue')
    // component: () => import('@/view/authority/implement/implement.vue')
  }]
},
// {
//   path: '/IncrementCopy',
//   name: 'IncrementCopy',
//   meta: {
//     icon: 'flowtype',
//     title: '流式pipeline'
//   },
//   component: Main,
//   children: [{
//     path: 'flink',
//     name: 'flink',
//     meta: {
//       icon: 'flink',
//       showTag: true,
//       title: 'flink'
//     },
//     component: () => import('@/view/pipeline/IncrementCopy.vue')
//   },
//   {
//     path: 'flowDetail',
//     name: 'flowDetail',
//     meta: {
//       icon: 'flink',
//       showTag: true,
//       hideInMenu: true,
//       title: 'flink'
//     },
//     component: () => import('@/view/pipeline/components/flowDetail.vue')
//   },
//   {
//     path: 'spark',
//     name: 'spark',
//     meta: {
//       icon: 'sparkStreaming',
//       showTag: true,
//       title: 'spark Streaming'
//     },
//     component: () => import('@/view/pipeline/IncrementCopy.vue')
//   }
//   ]
// },

// 注视掉的==== start===
// {
//   path: '/excel1',
//   name: 'excel1',
//   meta: {
//     icon: 'batch',
//     title: '批量pipeline'
//   },
//   component: Main,
//   children: [{
//     path: 'export-excel',
//     name: 'export-excel',
//     meta: {
//       icon: 'pipeline1',
//       showTag: true,
//       title: 'pipeline'
//     },
//     component: () => import('@/view/excel/export-excel.vue')
//   },
//   {
//     path: 'detail',
//     name: 'detail',
//     meta: {
//       icon: 'pipeline1',
//       showTag: true,
//       hideInMenu: true,
//       title: 'pipeline'
//     },
//     component: () => import('@/view/excel/upload-excel.vue')
//   },
//   {
//     path: 'translate',
//     name: 'translate',
//     meta: {
//       icon: 'spark',
//       showTag: true,
//       title: 'spark'
//     },
//     component: () => import('@/view/excel/export-excel.vue')
//   }
//   ]
// },
// 注视掉的==== end ===
// {
//   path: '/multilevel',
//   name: 'multilevel',
//   meta: {
//     icon: 'colony',
//     title: '连接和集群'
//   },
//   component: Main,
//   children: [{
//     path: 'colony',
//     name: 'colony',
//     meta: {
//       icon: 'colony',
//       showTag: true,
//       title: '集群'
//     },
//     component: () => import('@/view/multilevel/level-2-3.vue')
//   },
//   {
//     path: 'link',
//     name: 'link',
//     meta: {
//       icon: 'connect',
//       showTag: true,

//       title: '链接'
//     },
//     component: () => import('@/view/multilevel/link.vue')
//   },
//   {
//     path: 'environment',
//     name: 'environment',
//     meta: {
//       icon: 'environment',
//       showTag: true,
//       title: '环境'
//     },
//     component: () => import('@/view/multilevel/environment.vue')
//   },
//   {
//     path: 'user',
//     name: 'user',
//     meta: {
//       icon: 'accountNumber',
//       showTag: true,
//       title: '账号'
//     },
//     component: () => import('@/view/multilevel/user.vue')
//   },
//   {
//     path: 'team',
//     name: 'team',
//     meta: {
//       icon: 'team',
//       showTag: true,
//       title: '团队'
//     },
//     component: () => import('@/view/multilevel/team.vue')
//   },
//   {
//     path: 'member',
//     name: 'member',
//     meta: {
//       icon: 'member',
//       hideInMenu: true,
//       showTag: true,
//       title: '团队成员管理'
//     },
//     component: () => import('@/view/multilevel/member.vue')
//   }
//   ]
// },
// {
//   path: '/ImportAndExport',
//   name: 'importAndExport',
//   component: Main,
//   meta: {
//     // hideInBread: true,
//     // hideInMenu: true
//     icon: 'md-menu',
//     title: '帮助'
//   },

//   children: [{
//     path: 'ImportAndExport',
//     name: 'importAndExport',
//     meta: {
//       icon: 'ExportImport',
//       title: '帮助'
//     },
//     component: () => import('@/view/io/importAndExport.vue')
//   }]
// },
// {
//   path: '/monitor',
//   name: 'monitor',
//   component: Main,
//   meta: {
//     title: '监控',
//     icon: 'monitor'
//   },
//   children: [{
//     path: 'chart',
//     name: 'chart',
//     meta: {
//       icon: 'chart',
//       title: '图表'
//     },
//     component: () => import('@/view/monitor/chart.vue')
//   },
//   {
//     path: 'run',
//     name: 'run',
//     meta: {
//       icon: 'run',
//       title: '运行'
//     },
//     component: () => import('@/view/monitor/run.vue')
//   },
//   {
//     path: 'details',
//     name: 'details',
//     meta: {
//       icon: 'md-notifications',
//       title: '运行详情',
//       hideInMenu: true
//     },
//     component: () => import('@/view/monitor/components/details.vue')
//   },
//   {
//     path: 'warning',
//     name: 'warning',
//     meta: {
//       icon: 'warning',
//       title: '告警'
//     },
//     component: () => import('@/view/monitor/warning.vue')
//   }
//   ]
// },
// 权限管理
// {
//   path: '/authority',
//   name: 'authority',
//   component: Main,
//   meta: {
//     title: '权限',
//     icon: 'monitor'
//   },
//   children: [
//     {
//       path: '/welcome',
//       name: 'welcome',
//       meta: {
//         icon: 'chart',
//         title: '权限申请'
//       },
//       component: () => import('@/view/authority/welcome/welcome.vue')
//     }, {
//       path: '/apply',
//       name: 'apply',
//       meta: {
//         icon: 'chart',
//         title: '权限申请'
//       },
//       component: () => import('@/view/authority/apply/apply.vue')
//     }, {
//       path: 'config',
//       name: 'config',
//       meta: {
//         icon: 'chart',
//         title: '集群配置'
//       },
//       component: () => import('@/view/authority/config/config.vue')
//     },
//     {
//       path: 'record',
//       name: 'record',
//       meta: {
//         icon: 'chart',
//         title: '权限记录管理'
//       },
//       component: () => import('@/view/authority/record/record.vue')
//     },
//     {
//       path: 'author',
//       name: 'author',
//       meta: {
//         icon: 'chart',
//         title: '权限记录管理'
//       },
//       component: () => import('@/view/authority/author/author.vue')
//     },
//     {
//       path: 'implement',
//       name: 'implement',
//       meta: {
//         icon: 'chart',
//         title: '授权执行'
//       },
//       component: () => import('@/view/authority/implement/implement.vue')
//     }

//   ]
// },
{
  path: '/metadataManager',
  name: 'metadataManager',
  component: Main,
  meta: {
    title: '元数据',
    icon: 'metadataManager'
  },
  children: [{
    path: 'order',
    name: 'order',
    component: parentView,
    meta: {
      icon: 'metadataManager',
      title: '需求申请单'
    },
    component: () => import('@/view/metadataManager/kafka/order/order.vue')
  },

  // {
  //   path: 'kafkaMeta',
  //   name: 'kafkaMeta',
  //   component: parentView,
  //   meta: {
  //     icon: 'metadataManager',
  //     title: '组织'
  //   },
  //   children: [{
  //     path: 'topic',
  //     name: 'topic',
  //     meta: {
  //       icon: 'metadataManager',
  //       title: '组织'
  //     },
  //     component: () => import('@/view/metadataManager/kafka/topic/topic.vue')
  //   },
  //   {
  //     path: 'topicHistory',
  //     name: 'topicHistory',
  //     meta: {
  //       icon: 'metadataManager',
  //       title: '组织'
  //     },
  //     component: () => import('@/view/metadataManager/kafka/topic/history/topicHistory.vue')
  //   },
  //   {
  //     path: 'group',
  //     name: 'group',
  //     meta: {
  //       icon: 'metadataManager',
  //       title: '组织'
  //     },
  //     component: () => import('@/view/metadataManager/kafka/group/group.vue')
  //   },
  //   {
  //     path: 'operation',
  //     name: 'operation',
  //     meta: {
  //       icon: 'metadataManager',
  //       title: '主题'
  //     },
  //     component: () => import('@/view/metadataManager/kafka/operation/operation.vue')
  //   }
  //   ]

  // },
  {
    path: 'flinkMeta',
    name: 'flinkMeta',
    component: parentView,
    meta: {
      icon: 'metadataManager',
      title: '组织'
    },
    children: [{
      path: 'flinkMetaData',
      name: 'flinkMetaData',
      meta: {
        icon: 'metadataManager',
        title: '组织'
      },
      component: () => import('@/view/metadataManager/flink/cluster/flinkMetaData.vue')
    },
    {
      path: 'flinkApp',
      name: 'flinkApp',
      meta: {
        icon: 'metadataManager',
        title: '组织'
      },
      component: () => import('@/view/metadataManager/flink/app/flinkApp.vue')
    }
    ]

  },
  // {
  //   path: 'kafkaApply',
  //   name: 'kafkaApply',
  //   component: parentView,
  //   meta: {
  //     icon: 'metadataManager',
  //     title: 'kafka资源申请'
  //   },
  //   children: [
  //     {
  //       path: 'applyKafka',
  //       name: 'applyKafka',
  //       meta: {
  //         // title: '抽取表表管理',
  //         title: 'kafka资源申请',
  //         hideInMenu: false,
  //       },
  //       component: () => import('@/view/metadataManager/kafkaApply/apply/apply.vue'),
  //     },
  //     {
  //       path: 'authorKafka',
  //       name: 'authorKafka',
  //       meta: {
  //         title: 'kafka资源查询',
  //         hideInMenu: false,
  //       },
  //       component: () => import('@/view/metadataManager/kafkaApply/author/author.vue'),
  //     },
  //     {
  //       path: 'implementKafka',
  //       name: 'implementKafka',
  //       meta: {
  //         title: '操作管理',
  //         hideInMenu: false,
  //       },
  //       component: () => import('@/view/metadataManager/kafkaApply/implement/implement.vue'),
  //     },
  //     {
  //       path: 'recordKafka',
  //       name: 'recordKafka',
  //       meta: {
  //         title: '操作记录管理',
  //         hideInMenu: false,
  //       },
  //       component: () => import('@/view/metadataManager/kafkaApply/record/record.vue'),
  //     },
  //   ]

  // },
  // {
  //   path: 'oggMeta',
  //   name: 'oggMeta',
  //   component: parentView,
  //   meta: {
  //     icon: 'metadataManager',
  //     title: 'ogg元数据'
  //   },
  //   children: [
  //     {
  //       path: 'extractTableManage',
  //       name: 'extractTableManage',
  //       meta: {
  //         // title: '抽取表表管理',
  //         title: '源表管理',
  //         hideInMenu: false,
  //       },
  //       component: () => import('@/view/metadataManager/oggManager/extractTableManage/index.vue'),
  //     },
  //     {
  //       path: 'tableStructure',
  //       name: 'tableStructure',
  //       meta: {
  //         title: '源表管理-表结构',
  //         hideInMenu: true,
  //       },
  //       component: () => import('@/view/metadataManager/oggManager/extractTableManage/tableStructure.vue'),
  //     },
  //     {
  //       path: 'versionHistory',
  //       name: 'versionHistory',
  //       meta: {
  //         title: '源表管理-历史版本',
  //         hideInMenu: true,
  //       },
  //       component: () => import('@/view/metadataManager/oggManager/extractTableManage/versionHistory.vue'),
  //     },
  // {
  //   path: 'oggProcessManage',
  //   name: 'oggProcessManage',
  //   meta: {
  //     title: 'ogg进程管理',
  //     hideInMenu: false,
  //   },
  //   component: () => import('@/view/metadataManager/oggManager/oggProcessManage/index.vue'),
  // },
  //     {
  //       path: 'oggProcessDetail',
  //       name: 'oggProcessDetail',
  //       meta: {
  //         title: 'ogg进程管理-进程详情',
  //         hideInMenu: true,
  //       },
  //       component: () => import('@/view/metadataManager/oggManager/oggProcessManage/oggProcessDetail.vue'),
  //     },
  //     {
  //       path: 'mappingManage',
  //       name: 'mappingManage',
  //       meta: {
  //         // title: '映射管理',
  //         title: 'ogg运行管理',
  //         hideInMenu: false,
  //       },
  //       component: () => import('@/view/metadataManager/oggManager/mappingManage/index.vue'),
  //     },
  //     {
  //       path: 'oggCollectConfig',
  //       name: 'oggCollectConfig',
  //       meta: {
  //         hideInMenu: false,
  //         title: 'ogg采集端配置',
  //       },
  //       component: () => import('@/view/metadataManager/oggManager/oggCollectConfig/index.vue'),
  //     },
  //     {
  //       path: 'sourceSysManage',
  //       name: 'sourceSysManage',
  //       meta: {
  //         title: '源系统管理',
  //         hideInMenu: false,
  //       },
  //       component: () => import('@/view/metadataManager/oggManager/sourceSysManage/index.vue'),
  //     },
  //     {
  //       path: 'clusterManage',
  //       name: 'clusterManage',
  //       meta: {
  //         // title: '集群管理',
  //         title: 'ogg目标端管理',
  //         hideInMenu: false,
  //       },
  //       component: () => import('@/view/metadataManager/oggManager/clusterManage/index.vue'),
  //     }
  //   ]
  // },


  // {
  //   path: 'group',
  //   name: 'group',
  //   meta: {
  //     icon: 'group',
  //     title: '组织'
  //   },
  //   component: () => import('@/view/metadataManager/kafka/group/group.vue')
  // },
  // {
  //   path: 'operation',
  //   name: 'operation',

  //   meta: {
  //     icon: 'operation',
  //     title: '主题'
  //   },
  //   component: () => import('@/view/metadataManager/kafka/operation/operation.vue')
  // },
  {
    path: '/kafka',
    name: 'kafka',
    component: parentView,
    meta: {
      icon: 'datasetManager',
      title: '连接应用'
    },
    children: [
      //   {
      //   path: 'clusterMeta',
      //   name: 'clusterMeta',
      //   meta: {
      //     icon: 'colony',
      //     title: '集群'
      //   },
      //   component: () =>
      //     import(
      //       '@/view/metadataManager/kafka/cluster/cluster.vue'
      //     )
      // },
      {
        path: 'appUser',
        name: 'appUser',
        meta: {
          icon: 'accountNumber',
          title: '集群'
        },
        component: () =>
          import(
            '@/view/metadataManager/kafka/organization/organization.vue'
          )
      }
    ]
  },
  {
    path: '/datasetManager',
    name: 'datasetManager',
    component: parentView,
    meta: {
      icon: 'datasetManager',
      title: '数据集'
    },
    children: [{
      path: 'administrationManager',
      name: 'administrationManager',
      meta: {
        icon: 'administrationManager',
        title: '管理'
      },
      component: () =>
        import(
          '@/view/metadataManager/datasetManager/administrationManager.vue'
        )
    },
    {
      path: 'changeManager',
      name: 'changeManager',
      meta: {
        icon: 'changeManager',
        title: '变更',
        hideInMenu: true
      },
      component: () =>
        import('@/view/metadataManager/datasetManager/changeManager.vue')
    },
    {
      path: 'textSearchManager',
      name: 'textSearchManager',
      meta: {
        icon: 'pipelineManager',
        title: 'textSearchManager'
      },
      component: () =>
        import(
          '@/view/metadataManager/datasetManager/textSearchManager.vue'
        )
    },
    {
      path: 'recordManager',
      name: 'recordManager',
      meta: {
        icon: 'recordManager',
        title: 'recordManager'
      },
      component: () =>
        import('@/view/metadataManager/datasetManager/recordManager.vue')
    }
    ]
  },
  {
    path: '/diagramManager',
    name: 'diagramManager',
    component: parentView,
    meta: {
      icon: 'diagramManager',
      title: '血缘管理'
    },
    children: [{
      path: 'diagramPipelineManager',
      name: 'diagramPipelineManager',
      meta: {
        icon: 'diagramPipelineManager',
        title: 'pipeline'
      },
      component: () =>
        import(
          '@/view/metadataManager/diagramManager/diagramPipelineManager.vue'
        )
    },
    {
      path: 'dataManager',
      name: 'dataManager',
      meta: {
        icon: 'dataManager',
        title: '数据'
      },
      component: () =>
        import('@/view/metadataManager/diagramManager/dataManager.vue')
    }
    ]
  },
  {
    path: '/analysisManager',
    name: 'analysisManager',
    meta: {
      icon: 'analysisManager',
      title: '影响分析'
    },
    component: () => import('@/view/metadataManager/analysisManager.vue')
  }
  ]
},
{
  path: '/systemManager',
  name: 'systemManager',
  component: Main,
  meta: {
    title: '系统管理',
    icon: 'xitongshezhi'
  },
  children: [
    {
      path: 'userManager',
      name: 'userManager',
      meta: {
        icon: 'yonghuguanli',
        title: '用户管理'
      },
      component: () => import('@/view/metadataManager/systemManager/userManager/index.vue')
    },
    {
      path: 'roleManager',
      name: 'roleManager',
      meta: {
        icon: 'jiaoseguanli',
        title: '角色管理'
      },
      component: () => import('@/view/metadataManager/systemManager/roleManager/index.vue')
    },
    {
      path: 'menuApply/:id',
      name: 'menuApply',
      meta: {
        title: '菜单授权'
      },
      component: () => import('@/view/metadataManager/systemManager/roleManager/menuApply.vue')
    },
  ]
},
{
  path: '/oggMeta',
  name: 'oggMeta',
  component: Main,
  meta: {
    icon: 'metadataManager',
    title: 'ogg元数据'
  },
  children: [
    {
      path: 'extractTableManage',
      name: 'extractTableManage',
      meta: {
        // title: '抽取表表管理',
        title: '源表管理',
        hideInMenu: false,
      },
      component: () => import('@/view/metadataManager/oggManager/extractTableManage/index.vue'),
    },
    {
      path: 'tableStructure',
      name: 'tableStructure',
      meta: {
        title: '源表管理-表结构',
        hideInMenu: true,
      },
      component: () => import('@/view/metadataManager/oggManager/extractTableManage/tableStructure.vue'),
    },
    {
      path: 'versionHistory',
      name: 'versionHistory',
      meta: {
        title: '源表管理-历史版本',
        hideInMenu: true,
      },
      component: () => import('@/view/metadataManager/oggManager/extractTableManage/versionHistory.vue'),
    },
    {
      path: 'oggProcessManage',
      name: 'oggProcessManage',
      meta: {
        title: 'ogg进程管理',
        hideInMenu: false,
      },
      component: () => import('@/view/metadataManager/oggManager/oggProcessManage/index.vue'),
    },
    {
      path: 'oggProcessDetail',
      name: 'oggProcessDetail',
      meta: {
        title: 'ogg进程管理-进程详情',
        // hideInMenu: true,
      },
      component: () => import('@/view/metadataManager/oggManager/oggProcessManage/oggProcessDetail.vue'),
    },
    {
      path: 'mappingManage',
      name: 'mappingManage',
      meta: {
        // title: '映射管理',
        title: 'ogg运行管理',
        hideInMenu: false,
      },
      component: () => import('@/view/metadataManager/oggManager/mappingManage/index.vue'),
    },
    {
      path: 'oggCollectConfig',
      name: 'oggCollectConfig',
      meta: {
        hideInMenu: false,
        title: 'ogg采集端配置',
      },
      component: () => import('@/view/metadataManager/oggManager/oggCollectConfig/index.vue'),
    },
    {
      path: 'sourceSysManage',
      name: 'sourceSysManage',
      meta: {
        title: '源系统管理',
        hideInMenu: false,
      },
      component: () => import('@/view/metadataManager/oggManager/sourceSysManage/index.vue'),
    },
    {
      path: 'clusterManage',
      name: 'clusterManage',
      meta: {
        // title: '集群管理',
        title: 'ogg目标端管理',
        hideInMenu: false,
      },
      component: () => import('@/view/metadataManager/oggManager/clusterManage/index.vue'),
    }
  ]

},
{
  path: '/kafkaMeta',
  name: 'kafkaMeta',
  component: Main,
  meta: {
    icon: 'metadataManager',
    title: '组织'
  },
  children: [
    //   {
    //   path: 'topic',
    //   name: 'topic',
    //   meta: {
    //     icon: 'metadataManager',
    //     title: '组织'
    //   },
    //   component: () => import('@/view/metadataManager/kafka/topic/topic.vue')
    // },
    {
      path: 'topicHistory',
      name: 'topicHistory',
      meta: {
        icon: 'metadataManager',
        title: '组织'
      },
      component: () => import('@/view/metadataManager/kafka/topic/history/topicHistory.vue')
    },
    // {
    //   path: 'group',
    //   name: 'group',
    //   meta: {
    //     icon: 'metadataManager',
    //     title: '组织'
    //   },
    //   component: () => import('@/view/metadataManager/kafka/group/group.vue')
    // },
    {
      path: 'operation',
      name: 'operation',
      meta: {
        icon: 'metadataManager',
        title: '主题'
      },
      component: () => import('@/view/metadataManager/kafka/operation/operation.vue')
    }
  ]

},
// {
//   path: '/kafkaApply',
//   name: 'kafkaApply',
//   component: Main,
//   // component: parentView,
//   meta: {
//     icon: 'metadataManager',
//     title: 'kafka资源申请'
//   },
//   children: [
//     {
//       path: 'applyKafka',
//       name: 'applyKafka',
//       component: parentView,
//       meta: {
//         // title: '抽取表表管理',
//         title: 'kafka资源申请',
//         hideInMenu: false,
//       },
//       component: () => import('@/view/metadataManager/kafkaApply/apply/apply.vue'),
//     },
    {
      path: '/authorKafka',
      name: 'authorKafka',
      component: Main,
      meta: {
        icon: 'metadataManager',
        title: 'kafka资源查询'
      //  hideInMenu: false,
      },
      // component: () => import('@/view/metadataManager/kafkaApply/author/author.vue'),
      children: [
        {
          path: 'clusterMeta',
          name: 'clusterMeta',
         // component: parentView,
          meta: {
            icon: 'colony',
            title: '集群连接',
            hideInMenu: false,
          },
          component: () => import('@/view/metadataManager/kafka/cluster/cluster.vue')
        },
        {
          path: 'topic',
          name: 'topic',
          meta: {
            icon: 'metadataManager',
            title: 'topic运行状态',
            hideInMenu: false,
          },
          component: () => import('@/view/metadataManager/kafka/topic/topic.vue')
        },
        {
          path: 'group',
          name: 'group',
          meta: {
            icon: 'metadataManager',
            title: 'GROUP',
            hideInMenu: false,
          },
          component: () => import('@/view/metadataManager/kafka/group/group.vue')
        }
      ]
    },
//     {
//       path: 'implementKafka',
//       name: 'implementKafka',
//       meta: {
//         title: '操作管理',
//         hideInMenu: false,
//       },
//       component: () => import('@/view/metadataManager/kafkaApply/implement/implement.vue'),
//     },
//     {
//       path: 'recordKafka',
//       name: 'recordKafka',
//       meta: {
//         title: '操作记录管理',
//         hideInMenu: false,
//       },
//       component: () => import('@/view/metadataManager/kafkaApply/record/record.vue'),
//     },
//   ]

// },
{
  path: '/flinkMeta',
  name: 'flinkMeta',
  component: Main,
  // component: parentView,
  meta: {
    icon: 'metadataManager',
    title: 'flink元数据'
  },
  children: [
    {
      path: 'flinkMonitorConfig',
      name: 'flinkMonitorConfig',
      // component: parentView,
      meta: {
        title: 'flink监控配置',
        hideInMenu: false,
      },
      component: () => import('@/view/metadataManager/flinkMonitor/flinkMonitorConfig.vue'),
    },
    {
      path: 'flinkMonitorLog',
      name: 'flinkMonitorLog',
      // component: parentView,
      meta: {
        title: 'flink监控日志',
        hideInMenu: false,
      },
      component: () => import('@/view/metadataManager/flinkMonitor/flinkMonitorLog.vue'),
    },
  ]
},

{
  path: '/oozieMeta',
  name: 'oozieMeta',
  component: Main,
  // component: parentView,
  meta: {
    icon: 'metadataManager',
    title: 'oozie元数据'
  },
  children: [
    {
      path: 'hueUrl',
      name: 'hueUrl',
      // component: parentView,
      meta: {
        title: 'hue地址维护',
        hideInMenu: false,
      },
      component: () => import('@/view/metadataManager/oozieMonitor/hueUrl.vue')
    },
    {
      path: 'oozieTask',
      name: 'oozieTask',
      // component: parentView,
      meta: {
        title: 'oozie任务查询',
        hideInMenu: false,
      },
      component: () => import('@/view/metadataManager/oozieMonitor/oozieTask.vue')
    }
  ]
},


// {
//   path: '/join',
//   name: 'join',
//   component: Main,
//   meta: {
//     icon: 'rule',
//     title: '规则表达式'
//   },
//   children: [{
//       path: 'join_page',
//       name: 'join_page',
//       meta: {
//         icon: 'exepress',
//         showTag: true,
//         title: '表达式编辑器'
//       },
//       component: () => import('@/view/join-page.vue')
//     },
//     {
//       path: 'tools_methods_page',
//       name: 'tools_methods_page',
//       meta: {
//         icon: 'ruler',
//         title: '业务规则',
//         beforeCloseName: 'before_close_normal'
//       },
//       component: () => import('@/view/tools-methods/tools-methods.vue')
//     }
//   ]
// },
// {
//   path: '/data',
//   name: 'data',
//   component: Main,
//   meta: {
//     // hideInBread: true,
//     // hideInMenu: true
//     icon: 'dataserve',
//     title: '数据服务'
//   },
//   children: [{
//     path: 'serve',
//     name: 'serve',
//     meta: {
//       icon: 'dataserve',
//       title: '数据服务'
//     },
//     component: () => import('@/view/single-page/message/index.vue')
//   }]
// },

// {
//   path: '/help',
//   name: 'help',
//   component: Main,
//   meta: {
//     // hideInBread: true,
//     // hideInMenu: true
//     icon: 'md-menu',
//     title: '帮助'
//   },

//   children: [{
//     path: 'help',
//     name: 'help',
//     meta: {
//       icon: 'help',
//       title: '帮助'
//     },
//     component: () => import('@/view/single-page/message/index.vue')
//   }]
// },
// {
//   path: '/jar',
//   name: 'jar',
//   component: Main,
//   meta: {
//     // hideInBread: true,
//     // hideInMenu: true
//     icon: 'md-menu',
//     title: 'jar帮助'
//   },

//   children: [{
//     path: 'jar',
//     name: 'jar',
//     meta: {
//       icon: 'help',
//       title: '帮助'
//     },
//     component: () => import('@/view/member/member.vue')
//   }]
// },

{
  path: '/401',
  name: 'error_401',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/401.vue')
},
{
  path: '/500',
  name: 'error_500',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/500.vue')
},
{
  path: '*',
  name: 'error_404',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/404.vue')
}
]
