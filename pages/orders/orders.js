// pages/orders/orders.js
const app = getApp()
const util = require('../../utils/util.js')

//假数据
const order = require('../../data/order.js')

Page({

  data: {
    orderType: 0,
    orderTitle: ['全部订单', '待付款', '待发货', '待收货'],
    ordersItem: null
  },

  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: this.data.orderTitle[options.type]
    })
    this.setData({
      orderType: options.type,
      ordersItem: util.userAvatarTransform(order.data.orders, 'avatar')
    })
  },
  // tab 切换
  orderTab: function(e) {
    const orderType = e.target.dataset.type
    this.setData({
      orderType: orderType,
      ordersItem: null
    })
  },
  navigateToOrderInfo: function(e) {
    console.log(e.target.dataset.id)
    let id = e.target.dataset.id
    const url = '/pages/orderInfo/orderInfo?id=' + id
    wx.navigateTo({
      url: url
    })
  },
  // 滚动底部监控
  scrolltolower: function(e) {
    console.log(e)
  }
})