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
    scrollTop: 0,                  // 滚动条高度

    goodsSort:[],                 //商品分类名称列表
    actSort:0,                //当前激活的分类
    pageFlag:0,                //1显示分类，2显示全部
  },
  onLoad: function (options) {
    
    wx.setNavigationBarTitle({
      title: options.name
    })
    
    this.setData({
      userId: options.id
    })

    this.getGoodsSort(); //获取商品分类
    this.getgoodsList(); //获取全部商品
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
  // 商品跳转article
  navigateToGoods: function (e) {
    let id = e.target.dataset.id
    const url = '/pages/article/article?id=' + id
    wx.navigateTo({
      url: url
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
        this.setData({
          isHideLoadMore: true
        })
      }
    })
  },
  // 卖家分类列表
  getGoodsSort: function () {
    
    req(app.globalData.bastUrl, 'appv5_2/sort/getGoodsSort', {
      'uid': this.data.userId,
      'status': 1
    }).then(res => {
      let data = res.data;

      if(data.length>0){
        // 把 ‘全部’ 按钮添加到第一个
        res.data.unshift({
          goods_num: 100,
          id: 0,
          parent_id: 0,
          sort_name: "全部"
        });
      }
      
      data.forEach(function(v,k){
        v.nowPage=0;    //当前页数
        v.totalPage=1;  //总页数，暂时初始化为1
        v.goodsList=[]; //商品列表
      });
      
      this.setData({
        goodsSort: data,
        pageFlag: data.length>0 ? 1 : 2,
      })

      if(data.length>0){
        // 加载第一页
        this.getGoodsSortInfo({
          sortId: data[0].id,
          index: 0,
          eventType: 0,
        });
      }
    })
  },
  // 获取分类下商品列表事件
  evGoodsSortInfo: function(event){

    let sortId = event.currentTarget.dataset.sortId;
    let index = event.currentTarget.dataset.index;
    let eventType = event.currentTarget.dataset.eventType; //事件类型 : 0点击，1滚动

    this.getGoodsSortInfo({
      sortId : sortId,
      index : index,
      eventType : eventType,
    });
  },

  // 获取分类下商品列表
  getGoodsSortInfo: function(conf){

    let that = this;

    let sortId = conf.sortId;
    let index = conf.index;
    let eventType = conf.eventType;

    let nowPage = this.data.goodsSort[index].nowPage;
    let totalPage = this.data.goodsSort[index].totalPage;
    let isLoading = this.data.goodsSort[index].isLoading; //是否正在请求接口

    if (eventType == 0) {
      this.setData({
        actSort: index,
      })
    }

    //不是第一次点击不再请求接口
    if (eventType == 0 && nowPage > 0) {
      return false;
    }
    //已经是最后一页
    if (nowPage >= totalPage) {
      return false;
    }
    //正在请求接口
    if (isLoading) {
      return false;
    }

    let propIsLoading = 'goodsSort[' + index + '].isLoading';
    this.setData({
      [propIsLoading]: true,
    })

    let obj = {
      'uid': this.data.userId,
      'page': nowPage + 1,
      'size': 20,
      'sortid': sortId
    }

    req(app.globalData.bastUrl, 'appv5_2/user/goodsSortInfo', obj).then(res => {

      let propNowPage = 'goodsSort[' + index + '].nowPage';
      let propTotalPage = 'goodsSort[' + index + '].totalPage';
      let propGoodsList = 'goodsSort[' + index + '].goodsList'
      this.setData({
        [propNowPage]: obj.page, //设置当前页码
        [propTotalPage]: res.data.totalPages, //设置总页码
        [propGoodsList]: this.data.goodsSort[index].goodsList.concat(res.data.goodslist), //追加商品列表数组
        [propIsLoading]: false,
      })

    })

  },


})