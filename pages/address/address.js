// pages/address/address.js
const app = getApp()

//假数据
const address = require('../../data/address.js')
import { req } from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,    // 是否IphoneX
    addressItems: [],                       // 地址列表
    addressType: 0,                         // 0：通过我的地址进入  1：确认订单页进入
    orderType: 0                            // 订单类型传入什么在返回什么(确认订单页)
  },
  onLoad: function (options) {
    // options type参数 0：通过我的地址进入  1：确认订单页进入
    // 0情况下正常操作
    // 1情况在 设置默认后,微信添加地址(设为默认地址) 返回--确认订单页
    console.log(options)
    console.log(address.data)
    this.setData({
      orderType: options.orderType,
      addressType: options.type,
      addressItems: address.data
    })
    wx.setNavigationBarTitle({
      title: '收货地址'
    })
    req(app.globalData.bastUrl, 'appv2/useraddress').then(res => {
      console.log(res.data)
    })
  },
  // 删除地址
  deleteAddress: function(e) {
    const id = e.target.dataset.id
    const index = e.target.dataset.index
    console.log(id)
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
    // 清除数组中 删除的地址
    this.data.addressItems.splice(index, 1)
    this.setData({
      addressItems: this.data.addressItems
    })
  },
  // 设置默认地址
  setDefault: function(e) {
    const id = e.target.dataset.id
    console.log(e)
    // addressType=1 设置成功后返回
    if (this.data.addressType == 1){
      const orderType = this.data.orderType
      wx.navigateTo({
        url: '/pages/createOrder/createOrder?orderType=' + orderType,
      })
    }
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
    // 清除数组中 删除的地址
    let newAddressItems = [];
    this.data.addressItems.forEach(function(item, i){
      if(item.id == id){
        item.default = 1
        newAddressItems.push(item)
      }else{
        item.default = 0
        newAddressItems.push(item)
      }
    })
    this.setData({
      addressItems: newAddressItems
    })
  },
  // 添加微信地址
  addAddress: function() {
    const that = this
    wx.chooseAddress({
      complete: function(res) {
        // chooseAddress: fail cancel
        // chooseAddress:ok
        // cityName:"广州市"
        // countyName: "海珠区"
        // detailInfo: "新港中路397号"
        // errMsg: "chooseAddress:ok"
        // nationalCode: "510000"
        // postalCode: "510000"
        // provinceName: "广东省"
        // telNumber: "020-81167888"
        // userName: "张三"
        if (res.errMsg == 'chooseAddress:ok' ){
          wx.showModal({
            title: '提示',
            content: '是否保存地址',
            success: function (data) {
              if (data.confirm) {
                // 待保存的地址信息
                console.log(res)
                // addressType=1 设置成功后返回
                if (that.data.addressType == 1) {
                  const orderType = that.data.orderType
                  wx.navigateTo({
                    url: '/pages/createOrder/createOrder?orderType=' + orderType,
                  })
                }
              }
            }
          })
        }
      }
    })
  }
})