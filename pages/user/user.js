// pages/user/user.js

const util = require('../../utils/util.js')
// 假数据
// 分类商品
const categories_goods = require('../../data/categories_goods.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: 0,                    // 用户id
    userGoods: null,              // 当前用户发布商品
    returnTopStatus: false,       // 返回顶部按钮显示状态
    scrollTop: 0                  // 滚动条高度
  },
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.name
    })
    console.log(options)
    // this.setData({
    //   userId: options.id
    // })
    this.setData({
      userGoods: util.userAvatarTransform(categories_goods.data.data.item_list.result, 'user_avatar')
    })
  },
  // 返回顶部
  returnTop: function() {
    this.setData({
      scrollTop: 0
    })
  },
  // 返回首页
  returnIndex: function() {
    wx.switchTab({
      url: "/pages/index/index"
    })
  },
  // 滚动条监控
  mainScroll: function(e) {
    // 控制按钮显示
    let height = e.detail.scrollTop
    if (height >= 500 && this.data.tabIndex != 0) {
      this.setData({
        returnTopStatus: true
      })
    } else {
      this.setData({
        returnTopStatus: false
      })
    }
  },
  // 触底加载
  scrolltolower: function (e) {
    console.log(e)
  }
})