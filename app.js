//app.js
// data数据不区分大小写

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
        this.globalData.bastUrl = res.platform == 'devtools' ? 'https://apitest.ontheroadstore.com/' : 'https://api.ontheroadstore.com/'
      }
    })
    // 登录
    wx_login(this.globalData.bastUrl).then(res => {
      req(this.globalData.bastUrl, 'appv4/user/simple').then(res => {
        this.globalData.userInfo = res.data
      })
    })

  },
  onShow: function() {


  },
  onHide: function() {},
  onError: function() {},

  globalData: {
    bastUrl: null,
    isIphoneX: false,
    userInfo: null,
    systemInfo: null
  }
})