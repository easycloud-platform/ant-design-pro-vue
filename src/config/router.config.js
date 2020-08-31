// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: 'dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
        children: [
          {
            path: 'workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: 'analysis/:pageNo([1-9]\\d*)?',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '分析页', keepAlive: false, permission: [ 'dashboard' ] }
          }
        ]
      },
      // system
      {
        path: '/sys',
        redirect: '/sys/user',
        component: PageView,
        meta: { title: '组织机构', icon: 'team' },
        children: [
          {
            path: '/sys/user',
            name: 'user',
            component: () => import('@/views/sys/user/user'),
            meta: { title: '用户管理', keepAlive: true }
          },
          // {
          //   path: '/sys/dept',
          //   name: 'dept',
          //   component: () => import('@/views/sys/dept/dept'),
          //   meta: { title: '组织机构', keepAlive: true }
          // },
          {
            path: '/sys/role',
            name: 'role',
            component: () => import('@/views/sys/role/role'),
            meta: { title: '角色管理', keepAlive: true }
          },
          {
            path: '/sys/permission',
            name: 'permission',
            component: () => import('@/views/sys/permission/permission'),
            meta: { title: '权限管理', keepAlive: true }
          }
        ]
      },
       // 系统监控
       {
        path: '/monitor',
        redirect: '/monitor/log',
        component: RouteView,
        meta: { title: '系统监控', icon: 'desktop' },
        children: [
          {
            path: '/monitor/log',
            name: 'log',
            component: () => import('@/views/sys/monitor/log/log'),
            meta: { title: '在线日志', keepAlive: true }
          },
          {
            path: '/monitor/task',
            name: 'task',
            component: () => import('@/views/sys/monitor/task/task'),
            meta: { title: '定时任务', keepAlive: true }
          },
          {
            path: 'http://106.15.102.223:9180/doc.html',
            name: 'doc',
            meta: { title: '接口文档', target: '_blank' }
          }
        ]
      },
      {
        path: '/config',
        redirect: '/sys/dict',
        component: RouteView,
        meta: { title: '系统设置', icon: 'tool' },
        children: [
          {
            path: '/sys/dict',
            name: 'dict',
            component: () => import('@/views/sys/dict/dict'),
            meta: { title: '字典管理', keepAlive: true }
          },
          {
            path: '/sys/parameter',
            name: 'parameter',
            component: () => import('@/views/sys/parameter/parameter'),
            meta: { title: '系统配置', keepAlive: true, permission: [ 'user' ] }
          },
          {
            path: '/sys/interface',
            name: 'interface',
            component: () => import('@/views/sys/interface/interface'),
            meta: { title: '接口管理', keepAlive: true, permission: [ 'user' ] }
          },
          {
            path: '/sys/file',
            name: 'file',
            component: () => import('@/views/sys/file/file'),
            meta: { title: '文件管理', keepAlive: true, permission: [ 'user' ] }
          },
          {
            path: '/sys/message',
            name: 'message',
            component: () => import('@/views/sys/message/message'),
            meta: { title: '消息管理', keepAlive: true }
          }
        ]
      },
      {
        path: '/app',
        redirect: '/app/cat/level',
        component: RouteView,
        meta: { title: '猫星球', icon: 'gold' },
        children: [
          {
            path: '/app/article',
            name: 'article',
            component: () => import('@/views/app/article/article'),
            meta: { title: '文章管理', keepAlive: true }
          },
          {
            path: '/app/store',
            name: 'store',
            component: () => import('@/views/app/store/store'),
            meta: { title: '猫店管理', keepAlive: true }
          },
          {
            path: '/app/cat/cat',
            name: 'cat',
            component: () => import('@/views/app/cat/cat/cat'),
            meta: { title: '猫咪管理' }
          },
          {
            path: '/app/cat/level',
            name: 'level',
            component: () => import('@/views/app/cat/level/level'),
            meta: { title: '等级设置' }
          },
          {
            path: '/app/cat/breed',
            name: 'breed',
            component: () => import('@/views/app/cat/breed/breed'),
            meta: { title: '品种介绍' }
          }
        ]
      },
      {
        path: '/miniprogram',
        redirect: '/miniprogram/banner',
        component: RouteView,
        meta: { title: '小程序管理', icon: 'tool' },
        children: [
          {
            path: '/miniprogram/banner',
            name: 'banner',
            component: () => import('@/views/app/banner/banner'),
            meta: { title: '轮播图管理', keepAlive: true }
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  },
  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
