// pages/orderInfo/orderInfo.js
const app = getApp()
const util = require('../../utils/util.js')

const orderInfo = require('../../data/orderInfo.js')
Page({

  data: {
    orderInfo: {
      order_status: 1,
    },
    isIphoneX: app.isIphoneX      // 是否IphoneX
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    console.log(orderInfo)
    // this.setData({
    //   orderInfo: orderInfo.data
    // })
  },
  // 电话联系卖家
  callTel: function(e) {
    const tel = String(e.target.dataset.tel)
    console.log(tel)
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
})