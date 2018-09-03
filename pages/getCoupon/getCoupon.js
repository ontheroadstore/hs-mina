// pages/getCoupon/getCoupon.js
const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    allCoupon:[],
    sellerCoupon:[],
    ifGoBind: true,     
  },

  onLoad: function (options) {
    
  },

  onShow: function () {
    app.ifLogin((globalUserInfo) => {
      // 获取可领取优惠券 /appv6/coupon/getUserCouponList
      this.getUserCouponList();

    }, () => {
      if (this.data.ifGoBind === false) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
      this.setData({
        ifGoBind: !this.data.ifGoBind,
      })
    }, this.data.ifGoBind)
  },
  // 获取所有用户可领取优惠券
  getUserCouponList: function(){

    req(app.globalData.bastUrl, 'appv6/coupon/getUserCouponList',{}, 'GET').then(res => {
      if(res.status==1){
        //todo:套数据 & 领取功能
        this.setData({
          allCoupon:res.data.all,
          sellerCoupon: res.data.seller,
        })
      }else{
        //提示没有可领的
      }
    })

  },
})