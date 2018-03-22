//app.js
// data数据不区分大小写
import { req } from './utils/api.js';
App({
  onLaunch: function() {
    // 存储手机型号
    wx.getSystemInfo({
      success: (res) => {
        this.systemInfo = res
        if (res.model.indexOf('iPhone X') >= 0) {
          this.isIphoneX = true
        }
        // 判断当前环境，填写baseUrl
        this.globalData.bastUrl = res.platform == 'devtools' ? 'https://apitest.ontheroadstore.com/' : 'https://api.ontheroadstore.com/'
      }
    }
  )},
  onShow: function() {
    req(this.globalData.bastUrl, 'appv2_2/orders','GET').then(res => {
      console.log(res)
    })
  },
  onHide: function() {},
  onError: function() {},
  systemInfo: null,
  isIphoneX: false,
  // 保存用户基本信息（id，名称，头像，手机号）
  userInfo: null,
  globalData: {
    bastUrl: null,
  }
})