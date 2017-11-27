import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout';

Vue.use(Router);

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will not redirct in the levelbar
 * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
 * meta : `{ role: ['admin'] }`  will control the page role
 **/
export const constantRouterMap = [{
    path: '/login',
    component: _import('login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: _import('404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index')
    }]
  }
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});

export const asyncRouterMap = [{
    path: '/admin',
    component: Layout,
    redirect: 'noredirect',
    name: '管理员模块',
    icon: 'quanxian',
    children: [{
        path: 'setadmin',
        name: '管理员设置',
        icon: 'quanxian',
        component: _import('admin/index'),
        meta: {
          role: ['admin']
        }
      },
      {
        path: 'setrole',
        name: '角色设置',
        icon: 'quanxian',
        component: _import('admin/roleset'),
        meta: {
          role: ['admin']
        }
      },
      {
        path: 'setpermission',
        name: '权限设置',
        icon: 'quanxian',
        component: _import('admin/permissionset'),
        meta: {
          role: ['admin']
        }
      }
    ],
    meta: {
      role: ['admin']
    }
  },

  {
    path: '/baseinfo',
    component: Layout,
    redirect: 'noredirect',
    name: '基础信息模块',
    icon: 'xinrenzhinan',
    noDropdown: false,
    children: [{
      path: 'equipmentmanage',
      name: '设备管理',
      component: _import('baseinfo/equipmentmanage'),
      meta: {
        role: ['admin']
      }
    }, {
      path: 'propertymanage',
      name: '物业管理',
      component: _import('baseinfo/propertymanage'),
      meta: {
        role: ['admin']
      }
    }, {
      path: 'communitymanage',
      name: '小区管理',
      component: _import('baseinfo/communitymanage'),
      meta: {
        role: ['admin']
      }
    }, {
      path: 'npermanage',
      name: '期数管理',
      component: _import('baseinfo/npermanage'),
      meta: {
        role: ['admin']
      }
    }, {
      path: 'buildingmanage',
      name: '楼栋管理',
      component: _import('baseinfo/buildingmanage'),
      meta: {
        role: ['admin']
      }
    }, {
      path: 'unitmanage',
      name: '单元管理',
      component: _import('baseinfo/unitmanage'),
      meta: {
        role: ['admin']
      }
    }, {
      path: 'roommanage',
      name: '房间管理',
      component: _import('baseinfo/roommanage'),
      meta: {
        role: ['admin']
      }
    }, {
      path: 'usermanage',
      name: '用户管理',
      component: _import('baseinfo/usermanage'),
      meta: {
        role: ['admin']
      }
    }, {
      path: 'groupmanage',
      name: '群组管理',
      component: _import('baseinfo/groupmanage'),
      meta: {
        role: ['admin']
      }
    }],
    meta: {
      role: ['admin']
    }
  },
  {
    path: '/systemsetting',
    component: Layout,
    redirect: 'noredirect',
    name: '系统设置',
    icon: 'zujian',
    children: [{
      path: 'sleepsetting',
      name: '休眠时间设置',
      icon: 'quanxian',
      component: _import('system/sleepsetting'),
      meta: {
        role: ['admin']
      }
    }, {
      path: 'firmwaresetting',
      name: '固件设置',
      icon: 'quanxian',
      component: _import('system/firmwaresetting'),
      meta: {
        role: ['admin']
      }
    }],
    meta: {
      role: ['admin']
    }
  },
  {
    path: '/log',
    component: Layout,
    redirect: 'noredirect',
    name: '日志查看',
    icon: 'EXCEL',
    children: [{
      path: 'operationnote',
      name: '操作记录',
      icon: 'quanxian',
      component: _import('page/form'),
      meta: {
        role: ['admin']
      }
    }, {
      path: 'heartbeat',
      name: '心跳检测',
      icon: 'quanxian',
      component: _import('page/form'),
      meta: {
        role: ['admin']
      }
    }],
    meta: {
      role: ['admin']
    }
  },
  {
    path: '/advertise',
    component: Layout,
    redirect: 'noredirect',
    name: '广告编辑',
    icon: 'EXCEL',
    children: [{
      path: 'advertisement',
      name: '广告管理',
      icon: 'quanxian',
      component: _import('advertisement/advertisement'),
      meta: {
        role: ['admin']
      }
    }, {
      path: 'advertisementplace',
      name: '广告位管理',
      icon: 'quanxian',
      component: _import('advertisement/adplace'),
      meta: {
        role: ['admin']
      }
    }],
    meta: {
      role: ['admin']
    }
  },
  {
    path: '/wuye',
    component: Layout,
    redirect: 'noredirect',
    name: '物业职能',
    icon: 'wujiaoxing',
    children: [{
      path: 'notice',
      name: '小区公告',
      icon: 'quanxian',
      component: _import('wuye/notice')
    }, {
      path: 'repair',
      name: '物业报修',
      icon: 'quanxian',
      component: _import('wuye/repair')
    }, {
      path: 'expense',
      name: '费用管理',
      icon: 'quanxian',
      component: _import('wuye/expense')
    }, {
      path: 'complain',
      name: '投诉处理',
      icon: 'quanxian',
      component: _import('wuye/complain')
    }]
  },
  {
    path: '/CommunityUsers',
    component: Layout,
    redirect: 'noredirect',
    name: '社区用户管理',
    icon: 'wujiaoxing',
    children: [{
      path: 'CommunityUsersDataManage',
      name: '业主原始资料管理',
      icon: 'quanxian',
      component: _import('originaldata/originaldata')
    }, {
      path: 'LockManage',
      name: '门禁锁管理',
      icon: 'quanxian',
      component: _import('originaldata/lockmanage')
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
];
