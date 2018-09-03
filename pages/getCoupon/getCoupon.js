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
        res.data.seller.forEach(item => {
          item.coupon = this.formatCouponData(item.coupon)
        })
        this.setData({
          allCoupon:this.formatCouponData(res.data.all),
          sellerCoupon: res.data.seller,
        })
      }else{
        //提示没有可领的
      }
    })

  },
  formatCouponData: function (data) {
    if (data && data.length > 0) {
      data.forEach((v, i, arr) => {
        if (v.min_price > 0) {
          v.coupon_tip = '满' + v.min_price + '可用';
        } else {
          v.coupon_tip = '消费任意金额可用';
        }
        if (v.apply_time_type == 2) {
          let startTime = (new Date()).getTime();
          let endTime = startTime + v.apply_time_length * 24 * 60 * 60 * 1000;
          v.start_time = this.couponFmtTime(startTime);
          v.end_time = this.couponFmtTime(endTime);
        } else {
          v.start_time = this.couponFmtTime(v.apply_time_start);  // 使用开始时间
          v.end_time = this.couponFmtTime(v.apply_time_end);       // 使用结束时间
        }
        v.can_get = 1; //是否可领
      })
      return data;
    } else {
      return [];
    }
  },
  couponFmtTime: function (time) {
    function fixNum(v) {
      return v < 10 ? '0' + v : v;
    }
    time = String(time).length === 10 ? time * 1000 : time;
    var t = new Date(time);
    var y = fixNum(t.getFullYear());
    var m = fixNum(t.getMonth() + 1);
    var d = fixNum(t.getDate());
    return y + '.' + m + '.' + d;
  },
  //领取优惠券
  receiveCoupon(e){
    let couponId = e.target.dataset.couponid;
    req(app.globalData.bastUrl, `appv6/coupon/${couponId}/receive`, {}, 'POST').then(res => {
      if(res.status == 1){
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 2000
        })
      }else{
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})