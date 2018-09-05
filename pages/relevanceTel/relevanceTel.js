// pages/relevanceTel/relevanceTel.js
const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'


Page({
  data: {
    userInfo: app.globalData.userInfo,                     // 基本用户信息
    time: 60,                                   // 倒计时初始时间
    telNumber: '',                               // 用户输入手机号
    verificationCode: '',                        // 用户输入验证码
    areaCodes: ['+86', '+80', '+84', '+87'],    // 区号列表
    areaCodeIndex: 0,                            // 默认选中区号
    getUserInfoStatus: false,                     //是否显示授权获取用户信息弹窗
    loading: false,                               //点击next的loading
  },
  onLoad: function (options) {
    // 存有用户id
    // console.log(app.globalData.hsUserInfo)
    //获取用户信息
    this.getBaseInfo();
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
    // 输入手机号 为11位
    if (this.data.telNumber.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    // 正在倒计时
    if (this.data.time != 60) {
      return false
    }

    req(app.globalData.bastUrl, 'appv4/signings/codes', {
      phone: this.data.telNumber
    }).then(res => {
      if (res.code == 1) {

        let time = this.data.time;
        const clearTime = setInterval(() => {
          if (time == 0) {
            clearInterval(clearTime)
            this.setData({
              time: 60
            })
          } else {
            time = time - 1
            this.setData({
              time: time
            })
          }
        }, 1000)
      } else {
        wx.showToast({
          title: res.data,
        })
      }
    })


  },
  // 点击下一步
  next: function() {
    // setTimeout(() => {
    //   console.log('backkkkk:', typeof this.data.backurl)
    //   wx.navigateBack({})
    // }, 1000)

    const telNumber = '' + this.data.telNumber
    const verificationCode = '' + this.data.verificationCode
    if (telNumber.length == 0 || verificationCode.length == 0){
      wx.showToast({
        title: '请填写完成',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    wx.showLoading();
    this.getLoginCode().then((code)=>{
      //绑定手机号
      req(app.globalData.bastUrl, 'appv5_2/wechat/register', {
        wxappcode: code,
        device_type: 1,
        user_info:{
          user_name: this.data.userInfo.nickName,
          avatar: this.data.userInfo.avatarUrl,
          sex: this.data.userInfo.gender,
          city: this.data.userInfo.city,
          province: this.data.userInfo.province,
          country: this.data.userInfo.country,
        },
        phone: this.data.telNumber,
        code: this.data.verificationCode
      }, 'POST').then(res => {
        if (res.code == 1) {
          // 成功则提示用户，然后延时1~2秒返回个人中心 更新app存储的tel

          app.globalData.hsUserInfo = res.data.user.user_info

          wx.setStorageSync('token', res.data.token)
          app.globalData.token = res.data.token
          //后退到前一页
          wx.showToast({
            title: '登录成功'
          })
          setTimeout(() => {
            wx.navigateBack({})
          },500)
        } else {
          wx.showToast({
            title: res.data,
          })
        }
      })

    }).then(()=>{
      wx.hideLoading();
    },()=>{
      wx.hideLoading();
    })
    

    // req(app.globalData.bastUrl, 'appv4/signings/bindings', {
    //   phone: this.data.telNumber,
    //   code: this.data.verificationCode
    // }, 'POST').then(res => {
    //   if (res.code == 1) {
    //     // 成功则提示用户，然后延时1~2秒返回个人中心 更新app存储的tel
    //     app.userInfo.telNumber = this.data.telNumber

    //     setTimeout(function () {
    //       wx.switchTab({
    //         url: "/pages/me/me"
    //       })
    //     },2000)
    //   } else {
    //     wx.showToast({
    //       title: res.data,
    //     })
    //   }
    // })

  },
  // 获取loginCode
  getLoginCode: function(){
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          let code = res.code
          resolve(code);
        },
        fail: (res) => {
          wx.showToast({ title: '微信登陆失败！', icon: 'loading', duration: 2000 })
          reject()
        }
      })
    })
  },
  // 获取用户基本信息
  getBaseInfo: function(){
    //获取用户基本信息
    this.getSetting().then(() => {
      //用户授权过,直接获取
      this.getUserInfo();
    }, () => {
      //用户未授权,弹窗获取
      this.setData({
        getUserInfoStatus: true,
      })
    });
  },
  // 获取用户基本信息接口
  getUserInfo: function() {
    return new Promise( (resolve, reject) => {

          wx.getUserInfo({
            lang: 'zh_CN',
            success: (res) => {
              // 获取用户基本信息成功
              this.setData({
                getUserInfoStatus: false,
                userInfo: res.userInfo,
              })
              wx.setStorageSync('userInfo', res.userInfo);
            },
            fail: (res) => {
              //静默授权失败，弹出窗口授权 
              console.log('getuserinfo faile:', res)
            }
          })

    })
  },
  // 绑定手机号接口
  bindPhone: function(){
    request({
      url: baseUrl + 'appv5_2/wechat/wechatAppLogin',
      data: {
        wxappcode: code,
        user_info: {
          user_name: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl,
          sex: res.userInfo.gender,
          city: res.userInfo.city,
          province: res.userInfo.province,
          country: res.userInfo.country,
        }
      },
      method: 'POST'
    })
      .then(res => {
        let data = res.data.data;
        switch (res.data.status) {
          case 1:
            wx.setStorageSync('token', res.data.data.token)
            if (data.user) {
              // 已登录
              wx.setStorageSync('loginStatus', 1)
              if (data.user.telphone) {
                //已绑定手机号
              }

            } else {
              wx.setStorageSync('loginStatus', 0)
            }
            resolve()
            break;
          default:
            wx.showToast({ title: '截图给客服，登陆接口坏了。', icon: 'none', duration: 2000 })
            reject()
        }
      })
  },
  // 获取用户设置接口
  getSetting: function(){
    return new Promise( (resolve, reject) => {

      wx.getSetting({
        success: (res) => {
          // console.log('getsetting success: ', res)
          if (res.authSetting["scope.userInfo"]) {
            //授权过用户信息，可以直接使用wx.getUserInfo
            resolve()
          } else {
            //未授权用户信息，使用弹窗获取用户信息
            reject()
          }
        }, 
        fail: (res) => {
          // console.log('getsetting fail: ', res)
          reject()
        }
      })
    })

  },
  // 授权弹窗成功回调
  bindgetuserinfo: function (res) {
    if (res.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        getUserInfoStatus: false,
        userInfo: res.detail.userInfo,
      })
      wx.setStorageSync('userInfo', res.detail.userInfo);
    }
    // console.log('get user info ok: ', res.detail.userInfo)
  },
  //授权弹窗失败回调
  repulseGetUserInfo: function () {
    this.setData({
      getUserInfoStatus: false
    })
  },

})