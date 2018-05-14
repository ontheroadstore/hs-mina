//index.js
//获取应用实例
const app = getApp()
import util from '../../utils/util.js'
import { req } from '../../utils/api.js'

Page({
  data: {
    isHideLoadMore: false,        // 判断加载
    tabIndex: 0,                  // tab切换
    categoriesTabIndex: 0,        // 分类tab切换
    returnTopStatus: false,       // 返回顶部按钮显示状态
    categories: [],               // 一级分类数组
    categoriesChild: [],          // 二级分类数组
    categoriesGoods: [],          // 分类关联商品数组
    categoriesgoodsPages: 1,      // 分类商品页数
    hotGoods: [],                 // 热门商品列表
    hotgoodPages: 1,              // 热门商品分页
    salesGoods: [],               // 哆嗦排行榜列表
    bannerItem: [],               // banner列表
    newGoods: [],                 // 新品列表
  },
  onLoad: function (options) {
    req(app.globalData.bastUrl, 'appv3/categories', {
      level: 1,
      depth: 1
    }, "GET", true).then(res => {
      this.setData({
        tabIndex: options.url,
        categoriesTabIndex: options.url,
        categories: res.data
      })
      this.tabtap({
        target: {
          dataset: {
            id: options.url
          }
        }
      })
    })
  },
  // 顶部tab切换
  tabtap: function (e) {
    let that = this
    // tab切换
    let id = e.target.dataset.id
    this.setData({
      tabIndex: id,
      categoriesTabIndex: id
    })
    // 切换到商店直接返回
    if (id == 0) {
      return wx.reLaunch({
        url: '/pages/index/index'
      })
    }
    // 设置滚动条在顶部
    this.returnTop()
    // 赋值子分类
    this.data.categories.forEach(function (value) {
      if (value.id == id) {
        that.setData({
          categoriesChild: value.children
        })
      }
    })
    // 切换到新的
    this.clearcategoriesGoods()
    // 分类关联商品
    this.getcategoriesGoods()
  },
  // 返回顶部
  returnTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  // 返回首页
  returnIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  // 横向滚动监控
  scroll: function (e) {
    // console.log(e)
  },
  // 滚动监控
  onPageScroll: function (e) {
    // 控制按钮显示
    if (e.scrollTop >= 500 && this.data.tabIndex != 0) {
      this.setData({
        returnTopStatus: true
      })
    } else {
      this.setData({
        returnTopStatus: false
      })
    }
  },
  // 二级分类切换
  classifySonTab: function (e) {
    // tab切换
    let id = e.target.dataset.id
    this.setData({
      categoriesTabIndex: id
    })
    // 切换到新的
    this.clearcategoriesGoods()
    // 分类关联商品
    this.getcategoriesGoods()
  },
  // 商品跳转article
  navigateToGoods: function (e) {
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
  onReachBottom: function (e) {
    // 根据tabIndex判断0为商店 其他为当前显示一级分类id 
    // 如果点击二级分类则优先加载二级
    this.getcategoriesGoods()
  },
  // 获取分类商品列表
  getcategoriesGoods: function () {
    if (this.data.isHideLoadMore) return
    this.setData({
      isHideLoadMore: true
    })
    const category_id = this.data.categoriesTabIndex == 0 ? this.data.tabIndex : this.data.categoriesTabIndex
    req(app.globalData.bastUrl, 'appv3/category/posts', {
      'category_id': category_id,
      'cur_page': this.data.categoriesgoodsPages
    }).then(res => {
      const categoriesGoods = res.data.data.item_list.result
      this.setData({
        categoriesGoods: this.data.categoriesGoods.concat(categoriesGoods),
        categoriesgoodsPages: this.data.categoriesgoodsPages + 1,
        isHideLoadMore: false
      })
    })
  },
  // 切换分类商品清空数据
  clearcategoriesGoods: function () {
    this.setData({
      categoriesGoods: [],
      categoriesgoodsPages: 1,
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    const tabIndex = this.data.tabIndex
    const that = this
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 200)
    setTimeout(function () {
      if (tabIndex == 0) {
        that.onLoad()
      } else {
        // 切换到新的
        that.clearcategoriesGoods()
        // 分类关联商品
        that.getcategoriesGoods()
      }
    }, 1000)
  }
})
