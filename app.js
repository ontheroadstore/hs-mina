//app.js
// data数据不区分大小写

App({
  onLaunch: function() {
    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 存储手机型号
    const that = this
    wx.getSystemInfo({
      success: function (res) {
        that.systemInfo = res
        if(res.model.indexOf('iPhone X') >= 0){
          that.isIphoneX = true
        }
      }
    })
  },
  onShow: function() {
    console.log('onShow');
  },
  onHide: function() {
    console.log('onHide');
  },
  onError: function() {
    console.log('onError');
  },
  systemInfo: null,
  isIphoneX: false,
  // 保存用户基本信息（id，名称，头像，手机号）
  userInfo: null
})