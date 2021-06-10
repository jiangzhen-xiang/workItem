export const mockMenuData = [
    {
      'path': '/multilevel',
      'name': 'multilevel',
      'meta': {
        'icon': 'md-menu',
        'title': '多级菜单'
      },
      'component': 'Main',
      'children': [
        {
          'path': '/level_2_1',
          'name': 'level_2_1',
          'meta': {
            'icon': 'md-funnel',
            'title': '二级-1'
          },
          'component': 'multilevel/level-2-1'
        },
        {
          'path': '/level_2_2',
          'name': 'level_2_2',
          'meta': {
            'icon': 'md-funnel',
            'showAlways': true,
            'title': '二级-2'
          },
          'component': 'parentView',
          'children': [
            {
              'path': '/level_2_2_1',
              'name': 'level_2_2_1',
              'meta': {
                'icon': 'md-funnel',
                'title': '三级'
              },
              'component': 'multilevel/level-2-2/level-2-2-1'
            },
            {
              'path': '/level_2_2_2',
              'name': 'level_2_2_2',
              'meta': {
                'icon': 'md-funnel',
                'title': '三级'
              },
              'component': 'multilevel/level-2-2/level-2-2-2'
            }
          ]
        },
        {
          'path': '/level_2_3',
          'name': 'level_2_3',
          'meta': {
            'icon': 'md-funnel',
            'title': '二级-3'
          },
          'component': 'multilevel/level-2-3'
        }
      ]
    },
    {
      'path': '/auth',
      'name': 'auth',
      'meta': {
        'icon': 'md-menu',
        'title': '权限设置',
        'access': ['super_admin']
      },
      'component': 'Main',
      'children': [
        {
          'path': '/role',
          'name': 'role',
          'meta': {
            'icon': 'ios-paper-outline',
            'title': '角色'
          },
          'component': 'auth/role',
          'permission': ['add', 'edit']
        },
        {
          'path': '/cmenu',
          'name': 'cmenu',
          'meta': {
            'icon': 'ios-paper-outline',
            'title': '菜单'
          },
          'component': 'auth/cmenu',
          'permission': ['add', 'del']
        },
        {
          'path': '/account',
          'name': 'account',
          'meta': {
            'icon': 'ios-paper-outline',
            'title': '账号'
          },
          'component': 'auth/account'
        }
      ]
    },
    {
      'path': '/lesmessage',
      'name': 'lesmessage',
      'meta': {
        'icon': 'ios-paper',
        'title': '留言管理'
      },
      'component': 'Main',
      'children': [
        {
          'path': '/list',
          'name': 'list',
          'meta': {
            'icon': 'ios-paper',
            'title': '数据列表'
          },
          'component': 'lesmessage/list'
        }
      ]
    }
  ]

  export const getMockMenuData = req => {
    return mockMenuData
  }