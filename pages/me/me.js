// pages/me/me.js
const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'

Page({
  data: {
    userInfo: null,
    userTel: 0
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    var userTel = String(app.globalData.userInfo.telphone)
    var userTelArr = userTel.split("");
    for (let i = 3; i < 7; i++) {
      userTelArr[i] = '*'
    }
    userTel = userTelArr.join("")
    this.setData({
      userInfo: app.globalData.userInfo,
      userTel: userTel
    })
  },
  bindgetuserinfo: function(res) {
    if (res.detail.errMsg == 'getUserInfo:ok') {
      app.login(this.onLoad)
    }
  }
})