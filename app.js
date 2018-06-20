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
  globalData: {
    bastUrl: null,
    isIphoneX: false,
    userInfo: null,
    systemInfo: null,
    authorizationStatus: false
  }
})