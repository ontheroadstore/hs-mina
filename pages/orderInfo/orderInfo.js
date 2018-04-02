// pages/orderInfo/orderInfo.js
const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'


Page({

  data: {
    orderId: 0,                             // 订单id
    orderInfo: null,                        // 订单信息
    paymentCountDown: 0,                    // 付款倒计时
    receivingCountDown: 0,                  // 收货倒计时
    sellerPhone: 0,                         // 卖家手机号
    payTime: null,                          // 支付时间
    deliverTime: null,                      // 发货时间
    completeTime: null,                     // 成交时间
    customerInfo: null,                     // 买家收货地址
    express: null,                          // 快递信息
    isIphoneX: app.globalData.isIphoneX     // 是否IphoneX
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    req(app.globalData.bastUrl, 'appv5/orders/' + options.id, {}, "GET").then(res => {
      res.data.avatar = util.singleUserAvatarTransform(res.data.avatar)
      this.setData({
        orderId: options.id,
        orderInfo: res.data,
        customerInfo: res.data.customer_info,
        express: res.data.express,
        paymentCountDown: util.timestamp(res.data.payment_count_down),
        receivingCountDown: util.timestamp(res.data.receiving_count_down),
        sellerPhone: res.data.seller_phone,
        payTime: res.data.pay_time,
        deliverTime: res.data.deliver_time,
        completeTime: res.data.complete_time
      })
    })
  },
  // 电话联系卖家
  callTel: function(e) {
    const tel = String(e.target.dataset.tel)
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  // 立即付款
  immediatePayment: function () {
    console.log('立即付款')
  },
  // 取消订单 传ordernumner
  clearOrder: function (e) {
    const orderNumber = e.target.dataset.ordernumner
    wx.showModal({
      title: '提示',
      content: '是否取消订单？',
      success: function (res) {
        if (res.confirm) {
          req(app.globalData.bastUrl, 'appv5/order/cancel/' + orderNumber, {}, "POST", true).then(res => {
            wx.showToast({
              title: '操作成功',
              icon: 'none',
              duration: 1000
            })
          })
        }
      }
    })
  },
  // 提醒发货 传id
  remindDeliver: function () {
    const orderId = this.data.orderId
    req(app.globalData.bastUrl, 'appv5/orders/' + orderId + '/urge', {}, "POST", true).then(res => {
      wx.showToast({
        title: '已提醒卖家',
        icon: 'none',
        duration: 1000
      })
    })
  },
  // 确认收货 传ordernumner
  takeDelivery: function (e) {
    const orderNumber = e.target.dataset.ordernumner
    wx.showModal({
      title: '提示',
      content: '是否确认收货？',
      success: function (res) {
        if (res.confirm) {
          req(app.globalData.bastUrl, 'appv2_1/orders/' + orderNumber + '/received', {
            uid: app.globalData.userInfo.id
          }, "POST", true).then(res => {
            wx.showToast({
              title: '确认收货成功',
              icon: 'none',
              duration: 1000
            })
          })
        }
      }
    })
  },
  // 删除订单 传id
  deleteOrder: function () {
    const orderId = this.data.orderId
    wx.showModal({
      title: '提示',
      content: '确定删除订单？',
      success: function (res) {
        if (res.confirm) {
          req(app.globalData.bastUrl, 'appv5/orders/' + orderId, {
            uid: app.globalData.userInfo.id
          }, "DELETE", true).then(res => {
            wx.showToast({
              title: '删除订单成功',
              icon: 'none',
              duration: 1000
            })
          })
        }
      }
    })
  }
})