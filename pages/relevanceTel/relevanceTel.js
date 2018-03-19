// pages/relevanceTel/relevanceTel.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: app.userInfo,                     // 用户信息
    time: 60,                                   // 倒计时初始时间
    telNumber: 0,                               // 用户输入手机号
    verificationCode: 0,                        // 用户输入验证码
    areaCodes: ['+86', '+80', '+84', '+87'],    // 区号列表
    areaCodeIndex: 0                            // 默认选中区号
  },
  onLoad: function () {
    // 存有用户id
    console.log(app.userInfo)
  },
  // 输入手机号
  inputTel: function(e) {
    this.setData({
      telNumber: e.detail.value
    })
  },
  // 输入验证码
  inputVerification: function (e) {
    this.setData({
      verificationCode: e.detail.value
    })
  },
  // Picker监控
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      areaCodeIndex: e.detail.value
    })
  },
  // 点击获取验证码
  getVerificationCode: function() {
    let time = this.data.time
    const that = this
    // 正在倒计时
    if (time != 60){
      return false
    }
    // 输入手机号 为11位
    const telNumber = parseInt(this.data.telNumber)
    if (telNumber.length != 11){
      return wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
    }
    const clearTime = setInterval(function() {
      if(time == 0){
        clearInterval(clearTime)
        that.setData({
          time: 60
        })
      }else{
        time = time - 1
        that.setData({
          time: time
        })
      }
    },1000)
  },
  // 点击下一步
  next: function() {
    const telNumber = this.data.telNumber
    const verificationCode = this.data.verificationCode
    if (telNumber == 0 || verificationCode == 0){
      return wx.showToast({
        title: '请填写完成',
        icon: 'none',
        duration: 1000
      })
    }

    // 成功则提示用户，然后延时1~2秒返回个人中心 更新app存储的tel
    // app.userInfo.tel = 18735060000
    setTimeout(function() {
      wx.switchTab({
        url: "/pages/me/me"
      })
    })
  }
})