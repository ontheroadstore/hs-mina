// pages/me/me.js
const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'

Page({
  data: {
    userInfo: null,
    userTel: 0,
    getUserInfoStatus: false
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    const that = this
    that.setData({
      getUserInfoStatus: false
    })
    wx.getUserInfo({
      success: function() {
        var userTel = String(app.globalData.userInfo.telphone)
        var userTelArr = userTel.split("");
        for (let i = 3; i < 7; i++) {
          userTelArr[i] = '*'
        }
        userTel = userTelArr.join("")
        that.setData({
          userInfo: app.globalData.userInfo,
          userTel: userTel
        })
      },
      fail: function() {
        that.setData({
          getUserInfoStatus: true
        })
      }
    })
    
  },
  bindgetuserinfo: function(res) {
    if (res.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        getUserInfoStatus: false
      })
      app.login(this.onShow)
    }
  },
  repulseGetUserInfo: function () {
    this.setData({
      getUserInfoStatus: false
    })
  }
})