// pages/likeGoods/likeGoods.js
const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'

Page({

  data: {
    userId: 0,                  // 用户id
    likeGoods: [],              // 当前用户发布商品
    returnTopStatus: false,     // 返回顶部按钮显示状态
    scrollTop: 0,               // 滚动条高度
    likegoodPages: 1,
    isHideLoadMore: false
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的收藏'
    })
    this.getlikeGood()

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
    const sellerId = e.target.dataset.sellerid
    const index = e.target.dataset.index
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定取消收藏吗？',
      success: function (res) {
        if (res.confirm) {
          req(app.globalData.bastUrl, 'appv2/itemdeletefavourite', {
            item_id: goodId
          }, 'POST').then(() => {
            wx.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 2000
            })
            // 清除数组中 取消的like
            that.data.likeGoods.splice(index, 1)
            that.setData({
              likeGoods: that.data.likeGoods
            })
          })
          // 神策 收藏、取消
          app.sensors.track('collectOrNot', {
            collectType: '商品',
            commodityID: String(goodId),
            sellerID: String(sellerId),
            operationType: '取消收藏',
          });
        }
      }
    })
  },
  // 触底加载
  scrolltolower: function (e) {
    this.getlikeGood()
  },
  // 获取用户收藏列表
  getlikeGood: function () {
    if (this.data.isHideLoadMore) return
    this.setData({
      isHideLoadMore: true
    })
    req(app.globalData.bastUrl, 'appv2/userfavourite', {
      'cur_page': this.data.likegoodPages
    }).then(res => {
      this.setData({
        likeGoods: this.data.likeGoods.concat(res.data.items),
        likegoodPages: this.data.likegoodPages + 1,
        isHideLoadMore: false
      })
      if (this.data.likegoodPages > res.data.total_pages) {
        this.setData({
          isHideLoadMore: true
        })
      }
    })
  },
  // 跳转商品
  navigateToGoods: function (e) {
    let id = e.target.dataset.id
    let index = e.target.dataset.index
    let title = e.target.dataset.title
    const url = '/pages/article/article?id=' + id
    wx.redirectTo({
      url: url
    })
    app.sensors.funMkt('我的收藏', '我的收藏页', title, index, '商品', id)
  },
  // 卖家中心跳转user
  navigateToUser: function (e) {
    let id = e.target.dataset.id
    let name = e.target.dataset.name
    let index = e.target.dataset.index
    console.log(e)
    const url = '/pages/user/user?id=' + id + '&name=' + name
    wx.navigateTo({
      url: url
    })
    app.sensors.funMkt('我的收藏', '我的收藏页', id, index, '店铺', '')
  },
})