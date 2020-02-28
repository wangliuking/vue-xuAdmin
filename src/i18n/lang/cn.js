/**
 * Created by WebStorm.
 * User: nirongxu
 * Date: 2018/12/8
 * Description: 文件描述
 */
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

const cn = {
  routeName: {
    home: '地图',
    article: '业务管理',
    publishArticle: '发表文章',
    publishArticleEditor: '发表文章-富文本',
    icon: '系统管理',
    builtInIcon: '内置图标',
    shuttleBox: '穿梭框',
    demoShuttle: '穿梭框demo',
    permissions: '权限管理',
    pageControl: '页面权限',
    btnControl: '按钮权限',
    table: '配置管理',
    multiDataTable: '多选数据表格',
    userList: '用户',
    groupList: '组',
    user2groupList: '用户和组关联',
    bdList: '局向',
    group2bd: '组和局向关联',
    systemParam: '系统参数',
    gpsUser: 'GPS用户管理',
    smsList: '短信记录',
    callInfoList: '呼叫记录',
    webuserList: '账号管理',
    userBookList: '通讯录',
    structure: '组织结构',
    filterTable: '筛选表格',
    dragSort: '拖拽排序',
    upload: '上传',
    fileUpload: '文件上传',
    editor: '编辑器',
    markdown: 'markdown',
    wangeditor: 'wangeditor',
    multiDirectory: '多级目录',
    'menu2-1': '二级-1',
    'menu2-2': '二级-2',
    'menu2-3': '二级-3',
    'menu3-1': '三级-1',
    'menu3-2': '三级-2',
    'menu3-3': '三级-3',
    'menu4-1': '四级-1',
    'menu4-2': '四级-2',
    'menu5-1': '五级-1',
    systemSettings: '系统设置',
    navMenu: '导航菜单',
  },
  rightMenu: {
    close: '关闭',
    closeOther: '关闭其他',
    closeAll: '全部关闭'
  },
  role: {
    superAdmin: '超级管理员',
    admin: '管理员',
    ordinary: '普通用户'
  },
  userDropdownMenu: {
    basicInfor: '基本资料',
    changePassword: '修改密码',
    logout: '退出'
  },

  ...zhLocale   //  合并element-ui内置翻译
}

export default cn
