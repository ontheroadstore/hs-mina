// pages/orders/orders.js
const app = getApp()
let timer = null
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectName: '',
    isEmpty: false,               //所有款式都售罄状态
    skuStyleImage: '//img8.ontheroadstore.com/H5_Icon/sku_image_no_data.png',
    actid: null,            //活动id·
    searchList:[],
    endTime: null,          //结束时间时间戳
    day: '00',
    hour: '00',
    minute: '00',
    second: '00',
    pageNum: 1,             //自定义分页
    selectIndex: null,      //列表选中的位置
    selectStyleCount: 1,    //选中的数量 默认1
    selectStatus: false,    //是否显示弹出选择款式的层
    styleList: [],          //款式列表 
    pageNum: 1,             //分页记录第几页
    Lifting: 1,             //升降类型
    isIphoneX: app.globalData.isIphoneX,  //是否是iphoneX
    selectStyleId: null,          // 选中的款式ID
    selectStylePostage: null,     // 选中的款式运费
    selectStyleName: null,        // 选中的款式名称
    selectStylePrice: null,       // 选中款式的价格
    selectStyleCount: 1,          // 选中款式的数量
    selectStyleStock: 0,          // 选中款式的库存
    specialOfferStatus: false,    // 选中款式的特价状态
    specialOfferPrice: null,      // 选中款式的特价
    presellTime: null,            // 选中款式 预售时间
    deliveryTxt:'',               // 发货类型
    tips: null,                   // 活动的提示
    isSort: 0               //排序类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    this.setData({
      actid: opt.spid
    })
    wx.setNavigationBarTitle({
      title: '凑单享优惠'
    })
   this.initData()
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
    //初始化信息
  
  },
  //初始化数据
  initData(){
    let sortList = ['sort_by_zonghe','sort_by_xiaoliang','post_modified','sort_by_jiage_gao','sort_by_jiage_di'];
    let sortType = sortList[this.data.isSort];
    if(this.data.Lifting==1&&this.data.isSort==3){
      sortType = sortList[3];
    }
    if(this.data.Lifting==2&&this.data.isSort==3){
      sortType = sortList[4];
    }
    req(app.globalData.bastUrl, "sales_promotion/sale_list/"+this.data.actid+'/'+sortType, {
     
    }, "GET").then(res=>{
      this.setData({
        searchList: res.data.goods_list,
        tips: res.data.tips,
        endTime: res.data.end_time
      })
      //倒计时时间
      if(res.data.end_time-parseInt(new Date().getTime()/1000)>0){
        this.countDown(res.data.end_time-parseInt(new Date().getTime()/1000),this)
      }
     
    })

  },
  //跳转购物车
  jumpCart(){
    app.sensors.btnClick('购物车');
    // 判断是否登录
    if(this.ifLogin()==false){
      return ;
    }
    wx.navigateTo({
      url: "/pages/secondLevelChart/secondLevelChart"
    })
  },
  //加入购物车之前先查看是否登录
  ifLogin: function(){
    let status = false
    app.ifLogin(() => {
      status = true
    }, () => {
      status = false
    }, true);
    return status;
  },

  //点击商品列表中的购物车
  addCartClick(e){
    this.setData({
      selectIndex: e.target.dataset.idx
    })
    
    //此处暂时不晓得
    if(e.target.dataset.styles==3){
      console.log('单个商品直接加入购物车')
    }else{
      // e.target.dataset.postid
      req(app.globalData.bastUrl, "appv6_5/getGoodsTypeList/"+e.target.dataset.postid, {
     
      }, "GET").then(res=>{
        let list = res.data
        let isEmpty = true
        list.forEach((item,index) => {
          if(item.stock){
            isEmpty = false
          }
          if (item.postsRestrictionNumber != undefined) {
            item.restrictionTypes = 0 //商品限购
            item.limitBuyNum = item.postsRestrictionNumber //限购数量
            item.remainBuy = item.postsRestrictionNumber - item.postsAlreadyNumber
          } else if (item.goodsRestrictionNumber != undefined){
            item.restrictionTypes = 1 //款式限购
            item.limitBuyNum = item.goodsRestrictionNumber //限购数量
            item.remainBuy = item.goodsRestrictionNumber - item.goodsAlreadyNumber
          }
        })
     

        this.setData({
          skuStyleImage: this.data.searchList[this.data.selectIndex].cover_fang?this.data.searchList[this.data.selectIndex].cover_fang:this.data.searchList[this.data.selectIndex].cover,
          selectName:'',
          selectStatus: true,
          styleList: list,
          isEmpty: isEmpty
        })
      })
     
    }
  },
   //预览Sku
   previewImageSku(e){
    const url = e.target.dataset.url
    //默认款式图不显示
    if(url.indexOf('sku_image_no_data')>0){
      return
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },
  //隐藏这个弹出的框
  selectHide(e){
    if(e.target.dataset.status == 'true') {
      this.setData({
        selectStyleId: null,
        selectIndex: null,
        selectStatus: false,
        selectStylePrice: null,
        specialOfferPrice: null
      })
    }
   
  },
  //跳转商品详情
  jumpArticle(e){
    wx.navigateTo({
      url: '/pages/article/article?id='+ e.currentTarget.dataset.urlid,
    });
  },
  
  //点击排序类型
  sortSearch(e){
    if(e.target.dataset.type==3){
      this.setData({
        Lifting: this.data.Lifting==1?'2':'1'
      })
    }
    this.setData({
      isSort: e.currentTarget.dataset.type,
      pageNum: 1,
      searchList: []
    })
    this.initData()
  
  },
  //选择款式
  selectedStyle(e){
    const id = e.target.dataset.typeid
    const postage = e.target.dataset.postage
    const name = e.target.dataset.name
    const stock = e.target.dataset.stock
    const price = e.target.dataset.price
    const specialOfferStatus = formTime(e.target.dataset.specialofferstart, e.target.dataset.specialofferend)
    const specialOfferPrice = e.target.dataset.specialofferprice
    const presellTime = e.target.dataset.preselltime ? util.formatTime(e.target.dataset.preselltime) : null
    let delivery = parseInt(e.target.dataset.expected_delivery_cycle);
    let deliveryTxt = '';
    //商品或者款式限购判断
    let oIndex = e.target.dataset.typeindex;
    let restrictiontypes = this.data.styleList[oIndex].restrictionTypes
    let remainBuy = this.data.styleList[oIndex].remainBuy;
    let limitBuyNum = this.data.styleList[oIndex].limitBuyNum;
    let skuimage = this.data.styleList[oIndex].style_image;
    let selectName = this.data.styleList[oIndex].name
    console.log(restrictiontypes)
    console.log(remainBuy)
    if (restrictiontypes !== undefined){
      this.setData({
        limitBuyText: "限购" + limitBuyNum + "件",
        remainBuy: remainBuy,
      })
      if(remainBuy < 1){
        this.setData({
          btnStatus:true
        })
      }
    } else{
      this.setData({
        limitBuyText: "确定",
        remainBuy:0
      })
    }
    if(delivery && delivery>0){
      if(delivery<=3){
        deliveryTxt = (delivery * 24) + '小时内发货';
      }else{
        deliveryTxt = delivery + '天内发货';
      }
    }
    // if (stock <= 0) {
    //   return false
    // }
    if (stock <= 0) {
      // return false
      this.setData({
        isEmpty: true,
        selectStyleCount: 0
      })
    }else{
      this.setData({
        isEmpty: false,
        selectStyleCount: 1
      })
    }
    // 每次切换款式 初始数量
    this.setData({
      skuStyleImage: skuimage?skuimage:'//img8.ontheroadstore.com/H5_Icon/sku_image_no_data.png',
      selectStyleId: id,
      selectName: selectName,
      selectStylePostage: postage,
      selectStyleName: name,
      presellTime: presellTime,
      selectStylePrice: price,
      selectStyleStock: stock,
      // selectStyleCount: 1,
      specialOfferStatus: specialOfferStatus,
      specialOfferPrice: specialOfferPrice,
      deliveryTxt: deliveryTxt,
    })
  },
  // 当没有选中款式时 点击加入购物车/立即购买
  noSelect: function () {
    wx.showToast({
      title: '请选择一个正确的款式',
      icon: 'none',
      duration: 1000
    })
  },
  //减少数量
  subGoodNum: function () {
    if (this.data.selectStyleCount <= 1) {
      return false
    }
    let m = this.data.selectStyleCount - 1
    this.setData({
      selectStyleCount: m
    })
  },
  // 当没有选中款式时 点击加入购物车/立即购买
  noSelect: function () {
    wx.showToast({
      title: '请选择一个款式',
      icon: 'none',
      duration: 1000
    })
  },
  //添加数量
  addGoodNum: function (e) {
    const stock = this.data.selectStyleStock//库存
    let remainBuy = this.data.remainBuy;//限购剩余数量
    if (this.data.selectStyleCount == stock) {
      return wx.showToast({
        title: '库存不足，仅剩' + stock + '件',
        icon: 'none',
        duration: 1000
      })
    }
    //选中款式的数量
    if (this.data.remainBuy <= this.data.selectStyleCount){
      if(this.data.remainBuy!=0){
        return wx.showToast({
          title: '您最多可购买' + remainBuy + '件',
          icon: 'none',
          duration: 1000
        })
      }
     
    }
    let m = this.data.selectStyleCount + 1
    this.setData({
      selectStyleCount: m
    })
  },

  addChart: function (e) {
    if(this.data.selectStyleId==null){
      wx.showToast({
        title: '请选择一个款式',
        icon: 'none',
        duration: 1000
      })
      return
    }
    // 判断是否登录
    if (this.ifLogin() == false) {
      return;
    }
    req(app.globalData.bastUrl, 'appv2/additemintocart', {
      item_id: this.data.searchList[this.data.selectIndex].post_id,
      model_id: this.data.selectStyleId,
      count: this.data.selectStyleCount
    }, 'POST').then(res => {
      this.getChartNum(1)
      this.setData({
        selectIndex: null,
        selectStatus: false,
        selectStylePrice: null,
        specialOfferPrice: null,
        selectStyleId: null
      })
    })
  },

  getChartNum: function (n) {
    req(app.globalData.bastUrl, 'appv3_1/getcart/count', {}, 'GET', true).then(res => {
      this.setData({
        chartNum: res.data
      })
      if (n == 1) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1000
        })
      }
    })

  },

  //倒计时
  countDown(times,that){
    timer=setInterval(function(){
      var day=0,
        hour=0,
        minute=0,
        second=0;//时间默认值
      if(times > 0){
        day = Math.floor(times / (60 * 60 * 24));
        hour = Math.floor(times / (60 * 60)) - (day * 24);
        minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
      }
      if (day <= 9) day = day;
      if (hour <= 9&&day==0) hour = '0' + hour;
      if (minute <= 9) minute = '0' + minute;
      if (second <= 9) second = '0' + second;
     
      that.setData({
        day: day,
        hour: hour,
        minute: minute,
        second: second
      })
      times--;
    },1000);
    if(times<=0){
      clearInterval(timer);
      return false
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer)
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

function formTime(start, end) {
  if (!start || !end) {
    return false
  }
  Date.prototype.toLocaleString = function () {
    return (this.getMonth() + 1) + "月" + this.getDate() + "日 ";
  };
  let time = +new Date()
  time = parseInt(time / 1000)
  if (start < time && end > time) {
    if ((end - time) >= 86400) {
      const date = new Date(end * 1000).toLocaleString()
      return date + '结束'
    }
    if ((end - time) < 86400) {
      const timestamp = end - time
      let hour = parseInt(timestamp / 3600)
      let min = parseInt((timestamp - hour * 3600) / 60)
      return hour + "小时" + min + "分后结束"
    }
  } else if (start > time) {
    return false
    // return '特价活动未开始'
  } else if (end < time) {
    return false
  }
}
