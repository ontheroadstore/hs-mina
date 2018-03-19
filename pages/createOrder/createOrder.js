// pages/createOrder/createOrder.js
const app = getApp()
const util = require('../../utils/util.js')

Page({

  data: {
    orderType: 0,                 // 入口类型  0直接购买 1购物车购买 选中地址跳转时+ 方便返回
    singleOrder: [],              // orderType=0 设置数据
    orderList: [],                // orderType=1 设置数据
    // addressInfo: {
    //   name: 'sdasd',
    //   tel: 18735060000,
    //   address: '速度大大大大大苏打撒大苏打撒打算啊实打实大'
    // },
    addressInfo: null,            // 默认地址 在支付时，addressInfo不能为空
    isIphoneX: app.isIphoneX      // 是否IphoneX
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '确认订单'
    })
    options.type=0
    // type 0 直接购买， 1购物车购买 缓存数据头像已经处理
    if (options.type == 0){
      let orderData = wx.getStorageSync('orderData')
      orderData.type[0]['desc'] = null
      console.log(wx.getStorageSync('orderData'))
      this.setData({
        orderType: 0,
        singleOrder: orderData
      })
    }
    if (options.type == 1){
      let orderList = wx.getStorageSync('chartData')
      // 邮费处理 增加备注字段
      orderList.forEach(function(item, index){
        let maxPostage = 0
        item.item.forEach(function(good, i){
          if (good.postage > maxPostage){
            maxPostage = good.postage
          }
        })
        item['maxPostage'] = maxPostage
        item['desc'] = null
      })
      console.log(orderList)
      this.setData({
        orderType: 1,
        orderList: orderList
      })
    }
  },
  // 添加备注
  descContent: function(e) {
    const userid = e.target.dataset.userid
    const content = e.detail.value
    let orderList = this.data.orderList
    orderList.forEach(function (item, index) {
      if (item.seller_user_id == userid){
        item.desc = content
      }
    })
    this.setData({
      orderType: 1,
      orderList: orderList
    })
  },
  // 支付生成订单进行支付（正常购买）
  payment: function() {
    // 先检测地址是否添加
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
      if (item.selectStatus){
        let newItem = []
        item.item.forEach(function(good, i){
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