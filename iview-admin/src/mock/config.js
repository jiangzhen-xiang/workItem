import Mock from 'mockjs'
Mock.mock(/\/bdap-metadata-privilege\/cluster\/getCluster/, 'post', {

  'total': 100,
  'data': [
    {
      'clusterName': '主集群',
      'clusterCode': 'prod',
      'clusterDesc': '主集群',
      'hs2Addr': 'jdbc:hive2...',
      'hs2User': 'hive',
      'hs2Pwd': '123456',
      'impalaAddr': 'jdbc:hive2...',
      'impalaUser': 'impala',
      'impalaPwd': '123456'
    }
  ],
  'code': '1',
  'msg': '成功'

})

Mock.mock(/\/bdap-metadata-privilege\/apply\/getApplyDetail/, 'post', {

  'total': 100,
  'data': [
    {
      'id': 'uuid',
      'applyFileName': '资源申请单20200101.xsl',
      'tenantUser': '租户1',
      'clusterName': '主集群',
      'component': 'hive',
      'dbName': 'bdap_db',
      'tableName': 'tab1',
      'colName': 'col1',
      'operType': '授权',
      'grantType': '查询',
      'stat': '未授权',
      'prodDate': '2020-01-20',
      'reqDate': '2020-11-10 10:00:00',
      'grantTime': '2020-11-10 10:00:00'
    },
    {
      'id': 'uuid',
      'applyFileName': '资源申请单220200101.xsl',
      'tenantUser': '租户12',
      'clusterName': '主集群2',
      'component': 'hive2',
      'dbName': 'bdap_db2',
      'tableName': 'tab12',
      'colName': 'col12',
      'operType': '授权2',
      'grantType': '查询2',
      'stat': '未授权2',
      'prodDate': '2020-01-20',
      'reqDate': '2020-11-10 10:00:00',
      'grantTime': '2020-11-10 10:00:00'
    }
  ],
  'code': '1',
  'msg': '成功'

})

Mock.mock(/\/bdap-metadata-privilege\/grant\/getGrant/, 'post', {

  'total': 100,
  'data': [
    {
      tenantUser: '租户1',
      'clusterName': '主集群',
      'component': 'hive',
      'dbName': 'bdap_db',
      'tableName': 'tab1',
      'colName': 'col1',
      'grantType': '查询'

    },
    {
      tenantUser: '租户12',
      'clusterName': '主集群3',
      'component': 'hive2',
      'dbName': 'bdap_db2',
      'tableName': 'tab12',
      'colName': 'col12',
      'grantType': '查询2'

    }
  ],
  'code': '1',
  'msg': '成功'

})

// 申请单

Mock.mock(/\/bdap-metadata-privilege\/apply\/getApply/, 'post', {

  'total': 100,
  'data': [
    {
      'id': 'uuid',
      'applyFileName': '资源申请单20200101.xsl',
      'tenantUser': '租户1',
      'prodDate': '2020-01-01',
      'contacts': '工号',
      'contactWay': '1333',
      'stat': '未授权',
      'reqUser': 'admin',
      'reqDate': '2020-11-10 10:00:00',
      'grantUser': 'admin',
      'grantTime': '2020-11-10 10:00:00'

    },
    {
      'id': 'uuid1',
      'applyFileName': '资源申请单20200101.xsl',
      'tenantUser': '租户12',
      'prodDate': '2020-01-011',
      'contacts': '工号1',
      'contactWay': '13331',
      'stat': '未授权1',
      'reqUser': 'admin1',
      'reqDate': '2020-11-10 10:00:00',
      'grantUser': 'admin',
      'grantTime': '2020-11-10 10:00:00'

    }
  ],
  'code': '1',
  'msg': '成功'

})

// 授权管理
Mock.mock(/\/bdap-metadata-privilege\/grant\/checkBeforeGrant/, 'post', [
  {
    'id': 'uuid',
    'applyFileName': '申请单名字',
    'applyDetail': [
      {
        'id': 'uuid',
        'clusterCode': 'prod',
        'component': 'hive',
        'dbName': 'db',
        'tableName': 'tab',
        'colName': 'col',
        'operType': '授权',
        'grantType': '查询',
        'state': '授权成功',
        'code': '1',
        'msg': '授权成功'
      }
    ],
    'code': '1',
    'msg': '授权成功'
  }
]
)

Mock.mock(/\/bdap-metadata-privilege\/grant\/checkAfterGrant/, 'post', [
  {
    'id': 'uuid',
    'applyFileName': '申请单名字',
    'applyDetail': [
      {
        'id': 'uuid',
        'clusterCode': 'prod',
        'component': 'hive',
        'dbName': 'db',
        'tableName': 'tab',
        'colName': 'col',
        'operType': '授权',
        'grantType': '查询',
        'state': '授权成功',
        'code': '1',
        'msg': '授权成功'
      }
    ],
    'code': '1',
    'msg': '授权成功'
  }
]
)
Mock.mock(/\/bdap-metadata-privilege\/grant\/doGrant/, 'post', [
  {
    'id': 'uuid',
    'applyFileName': '申请单名字',
    'applyDetail': [
      {
        'id': 'uuid',
        'clusterCode': 'prod',
        'component': 'hive',
        'dbName': 'db',
        'tableName': 'tab',
        'colName': 'col',
        'operType': '授权',
        'grantType': '查询',
        'state': '授权成功',
        'code': '1',
        'msg': '授权成功'
      }
    ],
    'code': '1',
    'msg': '授权成功'
  }
]
)
