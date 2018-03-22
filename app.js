//app.js
// data数据不区分大小写
import { req } from './utils/api.js';
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
    }
  )},
  onShow: function() {},
  onHide: function() {},
  onError: function() {},

  globalData: {
    bastUrl: null,
    isIphoneX: false,
    userInfo: null,
    systemInfo: null
  }
})