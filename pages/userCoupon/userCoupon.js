const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'

// pages/userCoupon/userCoupon.js
Page({
  data: {
    tagId:1,
    couponList:[]
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '我的优惠券'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#F8F8F8'
    })
    that.getCouponList(that,1)
    
  },
  getCouponList:function(obj,num){
    req(app.globalData.bastUrl, 'appv6/coupon/getBuyerCouponList', {
      type: num
    }, "GET").then(res => {
      obj.setData({
        couponList: obj.formatCouponData(res.data)
      })
    })
  },
  tagClick:function(e){
    let tagId = e.target.dataset.id;
    let that = this;
    this.setData({
      tagId
    })
    that.getCouponList(that, tagId)
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
        v.show_mes = false;
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
  couponDetailMes: function (e) {
    let index = e.currentTarget.dataset.index;
    let showMes = "couponList[" + index + "].show_mes";
    let bflag = this.data.couponList[index].show_mes;
    this.setData({
      [showMes]: !bflag
    })
  },
  goGetCoupon: function(){
    app.sensors.btnClick('去领券')
  },
  goUseCoupon: function(){
    app.sensors.btnClick('立即使用')
  }
})