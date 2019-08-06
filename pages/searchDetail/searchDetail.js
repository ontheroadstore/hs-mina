// pages/orders/orders.js
const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotList:[],
    hisList:[],
    searchList:[],
    searchMsg: [],
    hideDelete: false,
    deleteCover: "",//黑色遮罩class名
    searchFinish: false,
    searchValue: '',
    pageNum: 1,
    Lifting: 1,//升降类型
    isStart: true,
    sensorsTrack:{
      'searchType':'狠货',
      'keyWord':'',//关键词
      'hasResult':false,//是否有搜索结果
      'isHistory':false,//是否是历史记录
      'isRecommend':false,//是否是推荐词
    },
    isSort: 0 //排序类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    // this.initData()
    let _sensorsTrack= this.data.sensorsTrack
    let stype  = opt.stype
    if(stype=="his"){
      _sensorsTrack.isHistory=true
    }
    if(stype=='hot'){
      _sensorsTrack.isRecommend=true
    }
    _sensorsTrack.keyWord= opt.word
    this.setData({
      searchValue: opt.word,
      sensorsTrack: _sensorsTrack
    })
     this.searchWord()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //初始化数据
  initData(){
    req(app.globalData.bastUrl, "appv4/search/suggestions", {
     
    }, "GET").then(res=>{
      this.setData({
        hotList: res.data.hot_searching_words,
        hisList: res.data.searching_history
      })
    })

  },
  //输入框搜索
  searchKeyval(e){
    this.setData({
      searchValue: e.detail.value,
      searchList: [],
      isStart: true,
      sensorsTrack:{
        'searchType':'狠货',
        'keyWord':'',//关键词
        'hasResult':false,//是否有搜索结果
        'isHistory':false,//是否是历史记录
        'isRecommend':false,//是否是推荐词
      }
    })
    this.searchWord()
  },
  //点击搜索
  clickKeyval(e){
    if(e.target.dataset.urltype==1){
      wx.navigateTo({
        url: '/pages/article/article?id='+ e.target.dataset.urlid,
      });
    }else{
      if(this.data.deleteCover==""){
        this.setData({
          searchValue: e.target.dataset.word
        })
        this.searchWord()
      }else{
        this.deleteWord(e)
      }
    }
    
  },
  //取消返回首页
  cancelSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    });
  },
  //跳转商品详情
  jumpArticle(e){
    wx.navigateTo({
      url: '/pages/article/article?id='+ e.currentTarget.dataset.urlid,
    });
  },
  //搜索keyu请求
  searchWord(){
    
    req(app.globalData.bastUrl, "appv6_1/search/posts", {
      query: this.data.searchValue,
      searchtype: parseInt(this.data.isSort)+1,
      page: this.data.pageNum,
      sort: this.data.Lifting
    }, "GET").then(res=>{

      this.setData({
        searchFinish: true,
        searchList: this.data.searchList.concat(res.data.items),
        searchMsg: res.data.message
      })
      if(this.data.isStart){
        this.setData({
          isStart: false
        })
        let _sensorsTrack= this.data.sensorsTrack
        _sensorsTrack.keyWord=this.data.searchValue
        if(res.data.message==''){
         
          _sensorsTrack.hasResult= true
        }else{
          _sensorsTrack.hasResult= false
        }
        app.sensors.track('search', _sensorsTrack);
      }
     
    })
  },
  //删除单个搜索历史词
  deleteWord(e){
    req(app.globalData.bastUrl, "appv4/search/history/delete", {
      word: e.target.dataset.word,
    }, "POST").then(res=>{
      this.setData({
        hisList: res.data
      })
    })
  },
  //全部删除
  deleteAll(){
    // POST /appv4/search/history/clear 
    req(app.globalData.bastUrl, "appv4/search/history/clear", {
    }, "POST").then(res=>{
      this.setData({
        hisList: []
      })
      this.showDeleteIcon()
    })
  },
  //点击排序类型
  sortSearch(e){
    if(e.target.dataset.type==3){
      this.setData({
        Lifting: this.data.Lifting==1?'2':'1'
      })
    }
    this.setData({
      isSort: e.target.dataset.type,
      pageNum: 1,
      searchList: []
    })
    this.searchWord()
  },
  hideDeleteIcon(){
    this.setData({
      hideDelete: true,
      deleteCover: 'delete-cover'
    })
  },
  showDeleteIcon(){
    this.setData({
      hideDelete: false,
      deleteCover: ''
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('到底了')
    this.setData({
      pageNum: this.data.pageNum+1
    })
    this.searchWord()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})