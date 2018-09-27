//app.js
// data数据不区分大小写
import util from './utils/util.js'
import { wx_login, req } from './utils/api.js'
// 网易云信相关引用
var imutil = require('./imutils/util.js')
var config = require('./imutils/config.js')
var subscriber = require('./imutils/event.js')

App({
  onLaunch: function() {
    // 存储手机型号
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
        if (res.model.indexOf('iPhone X') >= 0) {
          this.globalData.isIphoneX = true
        }
        // 判断当前环境，填写baseUrl
        // this.globalData.bastUrl = res.platform == 'devtools' ? 'https://api.ontheroadstore.com/' : 'https://api.ontheroadstore.com/'
        this.globalData.bastUrl = res.platform == 'devtools' ? 'https://apitest.ontheroadstore.com/' : 'https://apitest.ontheroadstore.com/'
      }
    })
    this.login()
  },
  onShow: function() {},
  onHide: function() {},
  onError: function() {},
  login: function(callback) {
    // 登录
    wx_login(this.globalData.bastUrl).then(res => {
      req(this.globalData.bastUrl, 'appv4/user/simple', {}, "GET", true).then(res => {
        this.globalData.userInfo = res.data
        this.globalData.authorizationStatus = true
        if (callback){
          callback()
        }
      })
    })
  },
  ifLogin: function (succback, failback, ifGoBind){
    let globalUserInfo = this.globalData.userInfo;
    if (globalUserInfo && globalUserInfo.telphone) {
      if (succback){
        succback(globalUserInfo);
      }
    } else {
      if (failback){
        failback();
      }
      if (ifGoBind) {
        wx.navigateTo({
          url: '/pages/relevanceTel/relevanceTel',
        })
      }
    }
  },
  /*获取当前页url*/
  getCurrentPageUrl: function (){
    let pages = getCurrentPages()    //获取加载的页面
    let currentPage = pages[pages.length - 1]    //获取当前页面的对象
    let url = currentPage.route    //当前页面url
    return url
  },
  globalData: {
    bastUrl: null,
    isIphoneX: false,
    userInfo: null,
    systemInfo: null,
    authorizationStatus: false,
    token:'',
    //网易云信相关
    isLogin: false, // 当前是否是登录状态
    currentChatTo: '', // 记录当前聊天对象account，用于标记聊天时禁止更新最近会话unread
    loginUser: {},//当前登录用户信息
    friends: [],//好友列表，
    friendsWithCard: {}, // 带有名片信息的好友列表（转发时使用）
    friendsCard: {},//带有名片信息的好友列表
    onlineList: {},//在线人员名单 account: status
    blackList: {},//黑名单列表
    config,//存储appkey信息
    nim: {},//nim连接实例
    subscriber, //消息订阅器
    notificationList: [], // 通知列表
    recentChatList: {},//最近会话列表
    rawMessageList: {}, //原生的所有消息列表(包含的字段特别多)
    messageList: {}//处理过的所有的消息列表
  }
})