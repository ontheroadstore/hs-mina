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
    // options.type = 0
    // type 0 直接购买， 1购物车购买 缓存数据头像已经处理
    if (options.type == 0){
      let orderData = wx.getStorageSync('orderData')
      // 如果是特价商品 直接替换price
      const nowDate = +new Date()
      if (orderData.newType[0].special_offer_end *1000 >= nowDate){
        orderData.newType[0].price = orderData.newType[0].special_offer_price
      }
      // 邮费
      let totalPostage = orderData.newType[0].postage
      // 总价
      const countPrice = countTotalPrice(orderData, 0)
      this.setData({
        orderType: 0,
        singleOrder: orderData,
        totalPostage: totalPostage,
        totalPrice: countPrice.totalPrice
      })
      console.log(orderData)
    }
    
    if (options.type == 1){
      let orderList = wx.getStorageSync('chartData')

      orderList.forEach(function (item, index) {
        let maxPostage = 0
        var status = true
        item.item.forEach(function (good, i) {
          if (good.postage > maxPostage && good.selectStatus) {
            maxPostage = good.postage
          }
          // 如果售罄 下架 直接设置隐藏
          if (good['is_sku_deleted'] != 0 || good['remain'] <= 0){
            good['selectStatus'] = false
            item['selectStatus'] = false
            item['childOrderShow'] = false
          }
          // 如果有特价 重新设置price参数
          if (good['special_offer_end']){
            good['price'] = good['special_offer_price']
          }
        })
        item['maxPostage'] = maxPostage
        item['desc'] = null
      })
      const countPrice = countTotalPrice(orderList, 1)
      this.setData({
        orderType: 1,
        orderList: orderList,
        totalPostage: countPrice.totalPostage,
        totalPrice: countPrice.totalPrice
      })
    }
    // 获取默认地址
    // "appv2/defaultaddress" morendizhi
    req(app.globalData.bastUrl, 'appv2/defaultaddress',{}).then(res => {
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
    if (!this.data.addressInfo) {
      wx.showToast({
        title: '请添加地址',
        icon: 'none',
        duration: 1000
      })
    }
    
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
    // 单个订单 singleOrder数据
    console.log(this.data.singleOrder)
  },
  // 修改商品数量
  subNum: function(e) {
    const orderType = this.data.orderType
    if (orderType == 1){
      const id = e.target.dataset.id
      this.data.orderList.forEach(function(item, index){
        item.item.forEach(function (good, i) {
          if (good.numbers <= 1 && good.id == id){
            good.numbers = 1
            wx.showToast({
              title: '最少购买一个',
              icon: 'none',
              duration: 1000
            })
          } else if (good.numbers != 0 && good.id == id){
            good.numbers = good.numbers -1
          }
        })
      })
      const countPrice = countTotalPrice(this.data.orderList, orderType)
      this.setData({
        orderList: this.data.orderList,
        totalPostage: countPrice.totalPostage,
        totalPrice: countPrice.totalPrice
      })
    }else{
      let num = this.data.singleOrder.newType[0].number
      if (num <= 1){
        wx.showToast({
          title: '最少购买一个',
          icon: 'none',
          duration: 1000
        })
        this.data.singleOrder.newType[0].number = 1
      }else{
        this.data.singleOrder.newType[0].number = this.data.singleOrder.newType[0].number - 1
      }
      const countPrice = countTotalPrice(this.data.singleOrder, orderType)
      this.setData({
        singleOrder: this.data.singleOrder,
        totalPrice: countPrice.totalPrice
      })
    }
  },
  addNum: function(e) {
    const orderType = this.data.orderType
    if (orderType == 1) {
      const id = e.target.dataset.id
      const remain = e.target.dataset.remain
      this.data.orderList.forEach(function (item, index) {
        item.item.forEach(function (good, i) {
          if (good.numbers >= remain && good.id == id) {
            good.numbers = remain
            wx.showToast({
              title: '当前库存为' + remain,
              icon: 'none',
              duration: 1000
            })
          } else if (good.numbers != 0 && good.id == id) {
            good.numbers = good.numbers + 1
          }
        })
      })
      const countPrice = countTotalPrice(this.data.orderList, orderType)
      this.setData({
        orderList: this.data.orderList,
        totalPostage: countPrice.totalPostage,
        totalPrice: countPrice.totalPrice
      })
    }else{
      const remain = e.target.dataset.remain
      let num = this.data.singleOrder.newType[0].number
      if (num >= remain) {
        this.data.singleOrder.newType[0].number = remain
        wx.showToast({
          title: '当前库存为' + remain,
          icon: 'none',
          duration: 1000
        })
      } else {
        this.data.singleOrder.newType[0].number = this.data.singleOrder.newType[0].number + 1
      }
      const countPrice = countTotalPrice(this.data.singleOrder, orderType)
      this.setData({
        singleOrder: this.data.singleOrder,
        totalPrice: countPrice.totalPrice
      })
    }
  },
  // 修改订单信息进行付款（待付款订单进入付款）
  updatePayment: function() {

  }
})

function countTotalPrice(data, n) {
  if(n == 1){
    let totalPostage = 0
    let totalPrice = 0
    // 邮费处理 增加备注字段
    console.log(data)
    data.forEach(function (item, index) {
      item.item.forEach(function (good, i) {
        if (good.selectStatus) {
          totalPrice += good['numbers'] * good['price']
        }
      })
      if (item.childOrderShow){
        totalPostage += item['maxPostage']
        totalPrice += item['maxPostage']
      }
    })
    return {
      totalPostage: totalPostage,
      totalPrice: totalPrice
    }
  }else{
    let totalPrice = Number(data.newType[0].postage) + data.newType[0].price * data.newType[0].number
    return {
      totalPrice: totalPrice
    }
  }
}