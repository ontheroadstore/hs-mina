//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'

//假数据
// 分类
const categories = require('../../data/categories.js')
// 分类商品
const categories_goods = require('../../data/categories_goods.js')
const categories_goods1 = require('../../data/categories_goods1.js')
const categories_goods2 = require('../../data/categories_goods2.js')

Page({
  data: {
    isHideLoadMore: false,        // 判断加载
    tabIndex: 0,                  // tab切换
    returnTopStatus: false,       // 返回顶部按钮显示状态
    scrollTop: 0,                 // 滚动条高度
    categories: [],               // 一级分类数组
    categoriesChild: [],          // 二级分类数组
    categoriesGoods: [],          // 分类关联商品数组
    hotGoods: [],                 // 热门商品列表
    hotgoodPages: 1,              // 热门商品分页
    salesGoods: [],               // 哆嗦排行榜列表
    bannerItem: [],               // banner列表
    newGoods: []                  // 新品列表
  },
  onLoad: function () {
    // 获取分类
    req(app.globalData.bastUrl, 'appv3/categories', {
      level: 1,
      depth: 1
    }).then(res => {
      this.setData({
        categories: res.data
      })
    })
    // 获取banner
    req(app.globalData.bastUrl, 'appv3/modules', {
      qt: 1
    }).then(res => {
      this.setData({
        bannerItem: res.data
      })
    })
    // 获取新品
    req(app.globalData.bastUrl, 'appv3/modules', {
      qt: 4
    }).then(res => {
      this.setData({
        newGoods: res.data.result
      })
    })
    // 哆嗦排行榜
    req(app.globalData.bastUrl, 'appv3/channels', {
      channel: '2',
      random: '1'
    }).then(res => {
      this.setData({
        salesGoods: res.data.modules[0].data.result
      })
    })
    // 初始化当下热门
    this.getHotlist()
  },
  // 顶部tab切换
  tabtap: function (e) {
    let that = this
    // tab切换
    let id = e.target.dataset.id
    this.setData({
      tabIndex: id
    })
    // 设置滚动条在顶部
    this.returnTop()
    // 切换到商店直接返回
    if (id == 0) return
    // 赋值子分类
    this.data.categories.forEach(function (value) {
      if (value.id == id) {
        that.setData({
          categoriesChild: value.children
        })
      }
    })
    // 分类关联商品
    req(app.globalData.bastUrl, 'appv3/category/posts', {
      'category_id': this.data.tabIndex,
      'cur_page': 1
    }).then(res => {
      this.setData({
        categoriesGoods: res.data.data.item_list.result
      })
    })
  },
  // 返回顶部
  returnTop: function() {
    this.setData({
      scrollTop: 0
    })
  },
  // 横向滚动监控
  scroll: function(e) {
    // console.log(e)
  },
  // 纵向滚动监控
  mainScroll: function(e) {
    // 控制按钮显示
    let height = e.detail.scrollTop
    if (height >= 500 && this.data.tabIndex != 0){
      this.setData({
        returnTopStatus: true
      })
    }else{
      this.setData({
        returnTopStatus: false
      })
    }
  },
  // 二级分类切换
  classifySonTab: function(e) {
    let id = e.target.dataset
    console.log(id)
    this.setData({
      categoriesGoods: util.userAvatarTransform(categories_goods1.data.data.item_list.result, 'user_avatar')
    })
  },
  // 商品跳转article
  navigateToGoods: function(e) {
    let id = e.target.dataset.id
    const url = '/pages/article/article?id=' + id
    wx.navigateTo({
      url: url
    })
  },
  // 卖家中心跳转user
  navigateToUser: function (e) {
    let id = e.target.dataset.id
    let name = e.target.dataset.name
    const url = '/pages/user/user?id=' + id + '&name=' + name
    wx.navigateTo({
      url: url
    })
  },
  //触底加载
  scrolltolower: function(e) {
    // 根据tabIndex判断0为商店 其他为当前显示一级分类id 
    // 如果点击二级分类则优先加载二级
    if (this.data.tabIndex == 0) {
      // 首页加载
      this.getHotlist()
    } else {

    }
  },
  // 获取当下最热
  getHotlist: function() {
    if (this.data.isHideLoadMore) return
    this.setData({
      isHideLoadMore: true
    })
    req(app.globalData.bastUrl, 'appv3/modules', {
      'qt': 11,
      'page': this.data.hotgoodPages,
      'size': 10
    }).then(res => {
      this.setData({
        hotGoods: this.data.hotGoods.concat(res.data.result),
        hotgoodPages: this.data.hotgoodPages + 1,
        isHideLoadMore: false
      })
    })
  }
})
