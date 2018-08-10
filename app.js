//app.js
// data数据不区分大小写
import util from './utils/util.js'
import { wx_login, req } from './utils/api.js'

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
        this.globalData.bastUrl = res.platform == 'devtools' ? 'https://api.ontheroadstore.com/' : 'https://api.ontheroadstore.com/'
        // this.globalData.bastUrl = res.platform == 'devtools' ? 'https://apitest.ontheroadstore.com/' : 'https://apitest.ontheroadstore.com/'
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
  }
})