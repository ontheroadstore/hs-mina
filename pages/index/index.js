//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

//假数据
// 分类
const categories = require('../../data/categories.js')
// 分类商品
const categories_goods = require('../../data/categories_goods.js')
const categories_goods1 = require('../../data/categories_goods1.js')
const categories_goods2 = require('../../data/categories_goods2.js')

Page({
  data: {
    tabIndex: 0,                  // tab切换
    returnTopStatus: false,       // 返回顶部按钮显示状态
    scrollTop: 0,                 // 滚动条高度
    categories: null,             // 一级分类数组
    categoriesChild: null,        // 二级分类数组
    categoriesGoods: null         // 分类关联商品数组
  },
  onLoad: function () {
    // 设置分类
    this.setData({
      categories: categories.data
    })
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
    // 赋值子分类
    this.data.categories.forEach(function(item, index) {
      if (item.id == id){
        that.setData({
          categoriesChild: item.children
        })
      }
    })
    // 切换到商店直接返回
    if(id == 0){
      return false;
    }
    // 分类关联商品
    that.setData({
      categoriesGoods: util.userAvatarTransform(categories_goods.data.data.item_list.result, 'user_avatar')
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
    console.log(e)
  }
})
