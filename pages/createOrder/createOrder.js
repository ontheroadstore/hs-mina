// pages/createOrder/createOrder.js
const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'


Page({

  data: {
    orderType: 0,                 // 入口类型  0直接购买 1购物车购买 选中地址跳转时+ 方便返回
    singleOrder: [],              // orderType=0 设置数据
    orderList: [],                // orderType=1 设置数据
    totalPrice: 0,                // 总价
    totalPostage: 0,              // 总邮费
    addressInfo: null,            // 默认地址 在支付时，addressInfo不能为空
    isIphoneX: app.globalData.isIphoneX      // 是否IphoneX
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '确认订单'
    })
    console.log(options)
    // type 0 直接购买， 1购物车购买 缓存数据头像已经处理
    if (options.type == 0){
      let orderData = wx.getStorageSync('orderData')
      let totalPostage = orderData.newType[0].postage
      let totalPrice = Number(orderData.newType[0].postage) + orderData.newType[0].price * orderData.newType[0].number
      this.setData({
        orderType: 0,
        singleOrder: orderData,
        totalPostage: totalPostage,
        totalPrice: totalPrice
      })
    }
    if (options.type == 1){
      let orderList = wx.getStorageSync('chartData')
      let totalPostage = 0
      let totalPrice = 0
      // 邮费处理 增加备注字段
      orderList.forEach(function(item, index){
        let maxPostage = 0
        item.item.forEach(function(good, i){
          if (good.postage > maxPostage && good.selectStatus){
            maxPostage = good.postage
          }
          if (good.selectStatus){
            totalPrice += good['numbers'] * good['price']
          }
        })
        item['maxPostage'] = maxPostage
        totalPostage += maxPostage
        totalPrice += maxPostage
        item['desc'] = null
      })
      console.log(orderList)
      this.setData({
        orderType: 1,
        orderList: orderList,
        totalPostage: totalPostage,
        totalPrice: totalPrice
      })
    }
    // 获取默认地址
    // "appv2/defaultaddress" morendizhi
    req(app.globalData.bastUrl, 'appv2/defaultaddress',{}).then(res => {
      console.log(res)
      if (res.status == 1){
        this.setData({
          addressInfo: res.data
        })
      }
    })
  },
  // 添加备注
  descContent: function(e) {
    const content = e.detail.value
    if (this.data.orderType == 0){
      this.data.singleOrder.newType[0]['desc'] = e.detail.value
    }else{
      const userid = e.target.dataset.userid
      let orderList = this.data.orderList
      orderList.forEach(function (item, index) {
        if (item.seller_user_id == userid) {
          item.desc = content
        }
      })
      this.setData({
        orderType: 1,
        orderList: orderList
      })
    }
    
  },
  // 支付生成订单进行支付（正常购买）
  payment: function() {
    // 先检测地址是否添加
    console.log(this.data.singleOrder)
    if (!this.data.addressInfo) {
      wx.showToast({
        title: '请添加地址',
        icon: 'none',
        duration: 1000
      })
    }
    // 单个订单 singleOrder数据
    
    // 多个订单 orderList 在orderList提取需要提交的数据
    let createOrderData = []
    this.data.orderList.forEach(function(item, index){
      if (item.childOrderShow){
        let newItem = []
        item.item.forEach(function(good, i){
          console.log(good)
          if (good.selectStatus){
            newItem.push(good)
          }
        })
        item.item = newItem
        createOrderData.push(item)
      }
    })
    
    console.log(createOrderData)
  },
  // 修改订单信息进行付款（待付款订单进入付款）
  updatePayment: function() {

  }
})