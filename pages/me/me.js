// pages/me/me.js
const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'

Page({
  data: {
    userInfo: null
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    this.setData({
      userInfo: app.globalData.userInfo
    })
  }
})