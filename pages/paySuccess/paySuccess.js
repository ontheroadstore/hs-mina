// pages/paySuccess/paySuccess.js
const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'
Page({

  data: {
    showCoupon:false,
    couponList:[],
    coupon:[]
  },
  onLoad: function (options) {
    let orderNumber = options.orderNumber;
    // let orderNumber = 'HS20180903184106XX4ZX4'
    wx.setNavigationBarTitle({
      title: '支付完成'
    })
    if(orderNumber){
      req(app.globalData.bastUrl, `appv6/coupon/${orderNumber}/returnOrder`, {}, 'GET').then(res => {
        if (res.status == 1) {
          if (res.data.length < 1) {
            return
          }
          this.setData({
            showCoupon: true
          })
          this.setData({
            couponList: this.formatCouponData(res.data)
          })
          if (this.data.couponList.length > 1) {
            let couponPrice = 0;
            let couponMes = []
            this.data.couponList.forEach(item => {
              if (item.coupon_price > couponPrice) {
                couponPrice = item.coupon_price;
                couponMes = item;
              }
            })
            this.setData({
              coupon: couponMes
            })
          } else {
            this.setData({
              coupon: this.data.couponList[0]
            })
          }
        } else {
          
        }
      })
    }else{

    }
  },
  closeCoupon:function(e){
    if (e.target.dataset.status){
      this.setData({
        showCoupon:false
      })
    }
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
  }
})