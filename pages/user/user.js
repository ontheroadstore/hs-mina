// pages/user/user.js
const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHideLoadMore: false,
    usergoodsPages: 1,
    userId: null,                    // 用户id
    userGoods: [],              // 当前用户发布商品
    returnTopStatus: false,       // 返回顶部按钮显示状态
    scrollTop: 0                  // 滚动条高度
  },
  onLoad: function (options) {
    
    wx.setNavigationBarTitle({
      title: options.name
    })
    
    this.setData({
      userId: options.id
    })
    
    this.getgoodsList()
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
    this.getgoodsList()
  },
  // 卖家商品列表
  getgoodsList: function () {
    if (this.data.isHideLoadMore) return
    this.setData({
      isHideLoadMore: true
    })
    req(app.globalData.bastUrl, 'appv1/useritem', {
      'cur_page': this.data.usergoodsPages,
      'to_user_id': this.data.userId
    }).then(res => {
      this.setData({
        userGoods: this.data.userGoods.concat(res.data.user_items),
        usergoodsPages: this.data.usergoodsPages + 1,
        isHideLoadMore: false
      })
      if (this.data.usergoodsPages > res.data.total_pages) {
        wx.showToast({
          title: '已经到底了',
          icon: 'none',
          duration: 1000
        })
        this.setData({
          isHideLoadMore: true
        })
      }
    })
  }
})