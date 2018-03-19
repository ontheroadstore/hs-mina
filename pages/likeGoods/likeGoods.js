// pages/likeGoods/likeGoods.js
const util = require('../../utils/util.js')
// 假数据
// 商品
const categories_goods = require('../../data/categories_goods.js')

Page({

  data: {
    userId: 0,                    // 用户id
    likeGoods: null,              // 当前用户发布商品
    returnTopStatus: false,       // 返回顶部按钮显示状态
    scrollTop: 0                  // 滚动条高度
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的收藏'
    })
    // 含有用户id
    console.log(options)
    this.setData({
      userId: 64
    })
    this.setData({
      likeGoods: util.userAvatarTransform(categories_goods.data.data.item_list.result, 'user_avatar')
    })
  },
  // 返回顶部
  returnTop: function () {
    this.setData({
      scrollTop: 0
    })
  },
  // 返回首页
  returnIndex: function () {
    wx.switchTab({
      url: "/pages/index/index"
    })
  },
  // 滚动条监控
  mainScroll: function (e) {
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
  // 取消收藏
  cancelLike: function(e) {
    const goodId = e.target.dataset.goodid
    const index = e.target.dataset.index
    wx.showToast({
      title: '取消成功',
      icon: 'success',
      duration: 2000
    })
    // 清除数组中 取消的like
    this.data.likeGoods.splice(index, 1)
    this.setData({
      likeGoods: this.data.likeGoods
    })
  },
  // 触底加载
  scrolltolower: function (e) {
    console.log(e)
  }
})