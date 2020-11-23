const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'


Page({

  data: {
    cacheStatus: 999,  //缓存购物车单选第一个的商品状态 0 1 2 //999不存在所以 初始化
    goodList: [],               // 购物车商品列表
    selectAllStatus: false,     // 全选状态
    startLocationX: null,       // 左滑开始位置（用于显示删除按钮）
    moveLocationX: null,        // 左滑进行中的位置（用于显示删除按钮）
    startLocationY: null,       // 左滑开始位置（用于显示删除按钮）
    moveLocationY: null,        // 左滑进行中的位置（用于显示删除按钮）
    randomGoods: null,          // 猜你喜欢商品列表
    scrollStatus: true,         // 是否禁止滚动
    totalPrice: 0,              // 总价
    getUserInfoStatus: false,    // 授权状态
    ifGoBind: true, //未绑定是否去绑定
    spids:[], //活动id数组
    couponInfos:[], //优惠券信息列表
    maxCouponPrice: 0,
    canUseCouponId: null,
    fullReducePrice: 0, //共计满减金额
    isIphoneX: app.globalData.isIphoneX      // 是否IphoneX
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '购物车'
    })
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 300,
      timingFunction: "ease"
    })
    this.animation = animation
  },
  onShow: function () {
    // 初始化
    this.setData({
      canUseCouponId: null,
      couponInfos:[],
      maxCouponPrice: 0,
      fullReducePrice: 0
    })
    //判断是否登录 
    app.ifLogin(() => {

    }, () => {
      if (this.data.ifGoBind === false) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
      this.setData({
        ifGoBind: !this.data.ifGoBind,
      })
    }, this.data.ifGoBind);

    const that = this
    that.setData({
      getUserInfoStatus: false
    })
    wx.getUserInfo({
      success: function () {
        // 获取购物车商品
        req(app.globalData.bastUrl, 'appv6_5/getcart', {}).then(res => {
          if (res.status == 1) {
            // 获取数据添加选中状态 左滑选中状态
            // childOrderShow 在传入确认订单页中使用
            // animation 左滑动画
            let goodList = []
            let spids = []

            let sellerCount = [] //重新排序  
            res.data.cart.forEach(function (item, index) {
              item['selectStatus'] = false
              item['childOrderShow'] = false
              item['seller_avatar'] = item['seller_avatar']
              sellerCount.push(item.seller_user_id)
              if(item.sale_promotion){
                spids.push(item.sale_promotion.sp_id)
              }
            
              item.item.forEach(function (good, i) {
                good['selectStatus'] = false
                good['animation'] = {}
                good['special_offer_price'] =parseInt(good.special_offer_price)
                if (good.postsRestrictionNumber || good.goodsRestrictionNumber) {
                  good.limitBuy = true;
                  if (good.goodsRestrictionNumber) {
                    good.limitNumber = good.goodsRestrictionNumber;//商品款式限购数量
                    good.remainBuy = good.goodsRestrictionNumber - good.goodsAlreadyNumber;//款式剩余购买数量
                  } else if (good.postsRestrictionNumber) {
                    good.limitNumber = good.postsRestrictionNumber;//商品限购数量
                    good.remainBuy = good.postsRestrictionNumber - good.postsAlreadyNumber;//商品剩余购买数量
                  }
                 
                }
                if (good['special_offer_end']) {
                  good['special_offer_end'] = formTime(good['special_offer_end'])
                }
              })
              goodList.push(item)
              sellerCount.forEach((u,idx)=>{
                //重新排序
                if(item.seller_user_id==u&&!item.sale_promotion){
                  let cacheItem = goodList[index]
                  goodList[index] = goodList[idx]
                  goodList[idx] =  cacheItem
                }
              })
              // if(item.seller_user_id==sellerCount[sellerCount.length-1]&&!item.sale_promotion){
              // }
             
            })
            that.setData({
              selectAllStatus: false,
              totalPrice: 0,
              goodList: goodList,
              spids: distinct(spids),
              randomGoods: res.data.recommended
            })
          }
        })
      },
      fail: function () {
        that.setData({
          getUserInfoStatus: true
        })
      }
    })
  },
  // 用户授权
  bindgetuserinfo: function (res) {
    if (res.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        getUserInfoStatus: true
      })
      app.login(this.onShow)
    }
  },
  repulseGetUserInfo: function () {
    this.setData({
      getUserInfoStatus: false
    })
  },
  // 修改购物车数量 需要更新服务端存储数据，修改成功后再更新显示数量
  subNum: function (e) {
    const orderId = e.target.dataset.orderid
    const that = this
    req(app.globalData.bastUrl, 'appv5/cart/' + orderId, {
      increase: -1
    }, "POST", true).then(res => {
      if (res.status == 1) {
        let goodList = that.data.goodList
        goodList.forEach(function (item, index) {
          item.item.forEach(function (good, i) {
            if (good.id == orderId) {
              good['numbers'] = res.data
            }
          })
        })
        that.setData({
          goodList: goodList,
          totalPrice: that.countTotalPrice(goodList,that.data.spids)
        })
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 500
        })
      }
    })
  },
  addNum: function (e) {
    const orderId = e.target.dataset.orderid
    const that = this;
    let goodId = e.target.dataset.goodid;//商品ID
    let goodList = that.data.goodList;
    let itemIndex = e.target.dataset.itemindex;
    let goodIndex = e.target.dataset.index;
    let goodMsg = goodList[itemIndex].item[goodIndex];
    let limitBuyNumber = 0;
    if (goodMsg.goodsRestrictionNumber) {
      //判断款式是否限购
      if (goodMsg.numbers < goodMsg.remainBuy) {
        that.calcGoodNum(that, orderId)
      } else {
        wx.showToast({
          icon: 'none',
          title: '您最多可以购买' + goodMsg.remainBuy + '件',
        })
      }
    } else if (goodMsg.postsRestrictionNumber) {
      //判断商品是否限购
      limitBuyNumber = goodMsg.numbers + 1;
      goodList[itemIndex].item.forEach((item, index) => {
        if (item.item_id == goodId && index != goodIndex) {
          if (item.selectStatus == true) {
            limitBuyNumber += item.numbers;
          }
        }
      })
      if (limitBuyNumber > goodMsg.remainBuy) {

        wx.showModal({
          title: '限购提醒',
          content: '您最多可以购买' + goodMsg.remainBuy + '件',
          showCancel: false
        })
      } else {
        that.calcGoodNum(that, orderId)
      }
    } else {
      that.calcGoodNum(that, orderId)
    }
  },
  //点击商品加号时请求接口
  calcGoodNum: function (that, orderId) {
    req(app.globalData.bastUrl, 'appv5/cart/' + orderId, {
      increase: 1
    }, "POST", true).then(res => {
      if (res.status == 1) {
        let goodList = that.data.goodList
        goodList.forEach(function (item, index) {
          item.item.forEach(function (good, i) {
            if (good.id == orderId) {
              good['numbers'] = res.data
            }
          })
        })
        that.setData({
          goodList: goodList,
          totalPrice: that.countTotalPrice(goodList,that.data.spids)
        })
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 500
        })
      }
    })
  },
  // 左滑开始
  leftTouchStart: function (e) {
    this.setData({
      startLocationX: e.touches[0].pageX,
      startLocationY: e.touches[0].pageY
    })
  },
  // 左滑中
  leftTouchMove: function (e) {
    const that = this
    this.setData({
      moveLocationX: e.touches[0].pageX,
      moveLocationY: e.touches[0].pageY
    })
    const numX = this.data.startLocationX - this.data.moveLocationX
    const numY = this.data.startLocationY - this.data.moveLocationY
    if (Math.abs(numY) < Math.abs(numX)) {
      this.setData({
        scrollStatus: false
      })
    }
    let goodList = this.data.goodList
    const orderId = e.currentTarget.dataset.orderid
    goodList.forEach(function (item, index) {
      item.item.forEach(function (good, i) {
        if (good.id == orderId && numX > 60) {
          that.animation.translate(-60).step()
          good['animation'] = that.animation.export()
        } else if (good.id == orderId && numX < -60) {
          that.animation.translate(0).step()
          good['animation'] = that.animation.export()
        } else {
          that.animation.translate(0).step()
          good['animation'] = that.animation.export()
        }
      })
    })
    this.setData({
      goodList: goodList
    })
  },
  //滑动结束
  touchEnd: function () {
    this.setData({
      startLocationX: 0,
      moveLocationX: 0,
      startLocationY: 0,
      moveLocationY: 0,
      scrollStatus: true
    })
  },
  // 删除购物车商品
  deleteGood: function (e) {
    const orderId = e.currentTarget.dataset.orderid
    const cart_row_id = []
    const that = this
    cart_row_id.push(orderId)
    wx.showModal({
      title: '提示',
      content: '是否删除商品',
      success: function (res) {
        if (res.confirm) {
          req(app.globalData.bastUrl, 'appv2/removeitemfromcart', {
            cart_row_id: cart_row_id
          }, "POST").then(res => {
            if (res.status == 1) {
              let goodList = []
              that.data.goodList.forEach(function (item, index) {
                let m = -1
                item.item.forEach(function (good, i) {
                  if (good.id == orderId) {
                    m = i
                  }
                })
                // 删除选中的商品
                if (m != -1) {
                  item.item.splice(m, 1)
                }
                // 删除已经购物车没有商品的用户
                if (item.item.length != 0) {
                  goodList.push(item)
                }
              })
              that.setData({
                startLocation: 0,
                moveLocation: 0,
                goodList: goodList,
                totalPrice: that.countTotalPrice(goodList,that.data.spids)
              })
            } else {
              wx.showToast({
                title: res.info,
                icon: 'none',
                duration: 500
              })
              that.setData({
                startLocation: 0,
                moveLocation: 0
              })
            }
          })
        }
      }
    })
  },
  // 买他妈的
  navigatorToCreateOrder: function () {
    // 将数据缓存
    if (this.data.totalPrice == 0) {
      return wx.showToast({
        title: '请选择购买的商品',
        icon: 'none',
        duration: 1000
      })
    }
    wx.setStorageSync('chartData', this.data.goodList)
    wx.setStorageSync('fullReduce', {
      maxCouponPrice: this.data.maxCouponPrice,
      canUseCouponId: this.data.canUseCouponId,
      fullReducePrice: this.data.fullReducePrice
    })
    wx.navigateTo({
      url: '/pages/createOrder/createOrder?type=1',
    })
  },
  jumpFullReduce(e){
    wx.navigateTo({
      url: '/pages/fullReduce/fullReduce?spid='+e.currentTarget.dataset.spid,
    })
  },
  // 全部选择商品
  selectAll: function () {
    let goodList = this.data.goodList;
    let limitBuyNumber = 0;
    let json = {};
    if(!this.checkSelectAll(goodList)){
      wx.showToast({
        title: '购物车内含多种发货类型商品（海外直邮/保税仓发货），请分别结算',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let isLimitStatus = false; // 是否超出限购
    if (this.data.selectAllStatus) {
      let status = SetStatus(this.data.goodList, false, 0, 0)
      this.setData({
        goodList: status.data,
        selectAllStatus: false,
        totalPrice: this.countTotalPrice(this.data.goodList,this.data.spids)
      })
    } else {
      goodList.forEach((item, index) => {//遍历卖家
        json = this.checkLimitBuy(item)
        for (let name in json) {
          if (json[name] > json.remainBuy) {
            wx.showModal({
              title: '限购提醒',
              content: json.name + '超过限购数量',
              showCancel: false
            })
            isLimitStatus = true;
            return
          }
        }
      })
      if (isLimitStatus) {
        return
      }
      let status = SetStatus(this.data.goodList, true, 0, 0);

      this.setData({
        goodList: status.data,
        selectAllStatus: true,
        totalPrice: this.countTotalPrice(this.data.goodList,this.data.spids)
      })
    }
  },
  checkSelectAll(list){
    let status = true
    let firstType = list[0].item[0].is_baoguan
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < list[i].item.length; j++) {
        if(list[i].item[j].is_baoguan!=firstType){
          status = false
          break
        }
      }
    }
    return status
  },
  // 单个选择商品
  selectSingle: function (e) {
    let remainbuy = e.target.dataset.remainbuy;
    let itemIndex = e.target.dataset.itemindex;
    let goodIndex = e.target.dataset.index;
    let goodsArr = this.data.goodList[itemIndex];
    let goodId = e.target.dataset.goodid;//商品ID
    let singleStatus = false;//判断是否可以选中

    let seller = e.target.dataset.seller

    let promotionId = e.target.dataset.proid
    console.log(this.data.cacheStatus)
    if(this.data.cacheStatus!=999&&(goodsArr.item[goodIndex].is_baoguan!=this.data.cacheStatus)){
      if(this.data.cacheStatus==1){
        wx.showToast({
          title: '保税仓商品需单独结算',
          icon: 'none',
          duration: 2000
        })
      }
      if(this.data.cacheStatus==2){
        wx.showToast({
          title: '海外直邮商品需单独结算',
          icon: 'none',
          duration: 2000
        })
      }
      if(this.data.cacheStatus==0){
        wx.showToast({
          title: '当前所选商品不可以与海外直邮/保税仓商品同时结算，请分别结算。',
          icon: 'none',
          duration: 2000
        })
      }
      
      return
    }
    let limitBuyNumber = 0;
    let orderid = e.target.dataset.orderid
    if (goodsArr.item[goodIndex].selectStatus == true) {
      let status = SetStatus(this.data.goodList, true, seller, orderid,promotionId)
      this.setData({
        goodList: status.data,
        selectAllStatus: status.selectAllStatus,
        totalPrice: this.countTotalPrice(this.data.goodList,this.data.spids)
      })
    } else {
      limitBuyNumber = goodsArr.item[goodIndex].numbers;
      goodsArr.item.forEach((item, index) => {
        if (item.item_id == goodId && index != goodIndex) {
          if (item.selectStatus == true) {
            limitBuyNumber += item.numbers;
          }
        }
      })
      if (limitBuyNumber > remainbuy) {
        wx.showModal({
          title: '限购提醒',
          content: '该商品已超过限购数量',
          showCancel: false
        })
      } else {
        let status = SetStatus(this.data.goodList, true, seller, orderid,promotionId)
        this.setData({
          goodList: status.data,
          selectAllStatus: status.selectAllStatus,
          totalPrice: this.countTotalPrice(this.data.goodList,this.data.spids),
          cacheStatus: goodsArr.item[goodIndex].is_baoguan
        })

      }
    }
  },
  // 用户选择商品
  selectUser: function (e) {
    let goodList = this.data.goodList;
    let sellerIndex = e.target.dataset.index;
    
    let promotionId = e.target.dataset.proid
    let limitBuyNumber = 0;
    let json = {};
    let arr = goodList[sellerIndex];
    if(!this.checkSellerSame(arr.item)){
      wx.showToast({
        title: '购物车内含多种发货类型商品（海外直邮/保税仓发货），请分别结算',
        icon: 'none',
        duration: 2000
      })
      return
    }
    json = this.checkLimitBuy(arr)
    for (let name in json) {
      if (json[name] > json.remainBuy) {
        wx.showModal({
          title: '限购提醒',
          content: json.name + '超过限购数量',
          showCancel: false
        })
        return
      }
    }
    let userid = e.target.dataset.userid
    let status = SetStatus(this.data.goodList, true, userid, 0,promotionId)
    this.setData({
      goodList: status.data,
      selectAllStatus: status.selectAllStatus,
      totalPrice: this.countTotalPrice(this.data.goodList,this.data.spids)
    })
  },
  //判断全选卖家是否全部是一种类型的商品
  checkSellerSame(list){
    let status = true;
    let firstType =this.data.cacheStatus!=999?this.data.cacheStatus:list[0].is_baoguan
    list.forEach(v=>{
      if(v.is_baoguan!=firstType){
        status = false
      }else{
        
      }
    })
    if(status){
      this.setData({
        cacheStatus: firstType
      })
    }
    return status
    
  },
  // 判断商品是否超过限购数量
  checkLimitBuy: function (arr) {
    let json = {}
    arr.item.forEach((good, goodIndex) => {//遍历商品
      if (good.goodsRestrictionNumber) {
        if (good.remainbuy < 1) {
          wx.showModal({
            title: '限购提醒',
            content: good.item_name + '超过限购数量',
            showCancel: false
          })
        }
      } else if (good.postsRestrictionNumber) {
        if (json[good.item_id]) {
          json[good.item_id] += good.numbers
          json.remainBuy = good.remainBuy
        } else {
          json[good.item_id] = good.numbers
          json.remainBuy = good.remainBuy
          json.name = good.item_name
        }
      }
    })
    return json
  },
  // 商品跳转article
  navigateToGoods: function (e) {
    let id = e.target.dataset.id
    let index = e.target.dataset.index
    let title = e.target.dataset.title
    const url = '/pages/article/article?id=' + id
    wx.navigateTo({
      url: url
    })
    if (title) {
      app.sensors.funMkt('猜你喜欢', '购物车页', title, index, '商品', id)
    }
  },
  // 卖家中心跳转user
  navigateToUser: function (e) {
    let id = e.target.dataset.id
    let name = e.target.dataset.name
    let index = e.target.dataset.index
    const url = '/pages/user/user?id=' + id + '&name=' + name
    wx.navigateTo({
      url: url
    })
    app.sensors.funMkt('猜你喜欢', '购物车页', id, index, '店铺', '')
  },
  countTotalPrice(list,spids) {
    
    var totalPrice = 0
    this.setData({
      couponInfos: null
    })
    let reducePrice =[]
    let couponInfo = null
    couponInfo = []
    list.forEach(function (item, index) {
      
      item.item.forEach(function (good, i) {
        if (good['selectStatus'] && good['is_sku_deleted'] == 0 && good['remain'] > 0 && !good['special_offer_end']) {
          if(item.sale_promotion){
            //计算满减的金额
            spids.forEach(v=>{
              if(v==item.sale_promotion.sp_id){
                if(couponInfo.length){
                  couponInfo.forEach(s=>{
                    if(item.sale_promotion.sp_id!=s.promotion.sp_id){
                      item.sale_promotion.isReduce=false
                      couponInfo.push({promotion:item.sale_promotion})
                    }
                  })
                }else{
                  item.sale_promotion.isReduce=false
                  couponInfo.push({promotion:item.sale_promotion})
                }
              }
            })
            reducePrice.push({
              sp_id:item.sale_promotion.sp_id,
              aPrice: good['numbers'] * (parseInt(good['price'])+parseInt(good['quanyi_price'])) 
            })
          }
          totalPrice += good['numbers'] * (parseInt(good['price'])+parseInt(good['quanyi_price']))
        } else if (good['selectStatus'] && good['is_sku_deleted'] == 0 && good['remain'] > 0 && good['special_offer_end']) {
          if(item.sale_promotion){
            //计算满减的金额
            spids.forEach(v=>{
              if(v==item.sale_promotion.sp_id){
                if(couponInfo.length){
                  couponInfo.forEach(s=>{
                    if(item.sale_promotion.sp_id!=s.promotion.sp_id){
                      item.sale_promotion.isReduce=false
                      couponInfo.push({promotion:item.sale_promotion})
                    }
                  })
                }else{
                  item.sale_promotion.isReduce=false
                  couponInfo.push({promotion:item.sale_promotion})
                }
              }
            })
            reducePrice.push({
              sp_id:item.sale_promotion.sp_id,
              aPrice: good['numbers'] * (parseInt(good['special_offer_price'])+parseInt(good['quanyi_price']))
            })
          }
          totalPrice += good['numbers'] * (parseInt(good['special_offer_price'])+parseInt(good['quanyi_price']))
        }
      })
    })
    let saveMoney = []
    if(spids){
      spids.forEach(v=>{
        let _total = 0
        reducePrice.forEach(c=>{
          if(c.sp_id==v){
            _total+=c.aPrice
          }
        })
        saveMoney.push({
          id:v,
          total:_total
        })
      })
    }
    if(couponInfo){
      let couponList = []
      // let couponPriceList =[]
      couponInfo.forEach(v=>{
        v.promotion.sp_level.forEach(s=>{
          saveMoney.forEach(k=>{
            if(!v.promotion.isReduce){
              if(k.id== v.promotion.sp_id&&k.total>=s.min_price){
                //此时是满减金额
                v.promotion.sp_level.forEach(u=>{
                  u.canUse =false
                })
                v.promotion.isReduce=true
                //这个类型花了多少钱
                s.total = k.total
                s.canUse = true
                couponList.push({
                  couponid:  v.promotion.sp_id,
                  couponprice: s.coupon_price
                })
                // couponPriceList.push(s.coupon_price)  
              }
            }
          })
        })
      })
      let obj = {};
      let _couponList = couponList.reduce((cur,next) => {
        obj[next.couponid] ? "" : obj[next.couponid] = true && cur.push(next);
        return cur;
      },[]) //设置cur默认类型为数组，并且初始值为空的数组
      let fullReducePrice = 0
      _couponList.forEach(v=>{
        fullReducePrice+=v.couponprice
      })
      this.setData({
        fullReducePrice: fullReducePrice
      })
      //获取最大可以使用的优惠券 选中的优惠的价格
      // let maxCoupon = 0
      // if(couponPriceList){
      //   maxCoupon = Math.max.apply(null,couponPriceList)==null?0:Math.max.apply(null,couponPriceList);
      // }
      
      // let useCoupon = null
      // couponList.forEach(v=>{
      //   if(v.couponprice==maxCoupon){
      //     useCoupon = v.couponid
      //   }
      // })  
      
      // this.setData({
      //   maxCouponPrice: maxCoupon,
      //   canUseCouponId: useCoupon
      // })
    }else{
      // this.setData({
      //   maxCouponPrice: 0,
      //   canUseCouponId: null
      // })
    }
    this.setData({
      couponInfos: couponInfo
     
    })
    return totalPrice
  }
})

// 设置选中状态
function SetStatus(data, status, userId, orderId,promotionId) {
  var newData = []
  var selectAllStatus = true
  // 传入用户id 将当前传入用户下的所有商品选中 childOrderShow
  if (userId != 0&&orderId==0) {
    data.forEach(function (item, index) {
      let checkAll = false;
      if (item.seller_user_id == userId && item['selectStatus']&&item.promotion_id == promotionId) {
        //选择用户普通商品
        // if(item.promotion_id == promotionId&&!item.sale_promotion){
          item['selectStatus'] = false
          item['childOrderShow'] = false
          item.item.forEach(function (good, i) {
            good['selectStatus'] = false
          })
        // }
        if(item.sale_promotion){
          data.forEach(v=>{
            if(v.seller_user_id == userId && v['selectStatus']&&v.sale_promotion){
              v['selectStatus'] = false
              v['childOrderShow'] = false
              v.item.forEach(function (good, i) {
                good['selectStatus'] = false
              })
            }
          })
        }
      
        
      } else if (item.seller_user_id == userId && !item['selectStatus']&&item.promotion_id == promotionId) {
        // if(item.promotion_id == promotionId&&!item.sale_promotion){
          for (let i = 0; i < item.item.length; i++) {
            if (item.item[i].remainBuy != undefined && item.item[i].remainBuy < 1) {
              let goodsName = item.item[i].item_name;
              wx.showModal({
                title: '限购提醒',
                content: goodsName + '超过限购数量，请修改',
                showCancel: false
              })
              break;
            } else {
                checkAll = true;
                item.item[i].selectStatus = true
            }
          }
          if (checkAll == true) {
            item['selectStatus'] = true
            item['childOrderShow'] = true
            item.item.forEach(function (good, i) {
              good['selectStatus'] = true
            })
            if(item.sale_promotion){
              data.forEach(v=>{
                if(v.seller_user_id == userId && !v['selectStatus']&&v.sale_promotion){
               
                  v['selectStatus'] = true
                  v['childOrderShow'] = true
                  v.item.forEach(function (good, i) {
                    good['selectStatus'] = true
                  })
                }
              })
            }
          }
        // }
      }
      // 检测是否有未选(设置全选)
      if (!item['selectStatus']) {
        selectAllStatus = false
      }
      newData.push(item)
    })
  }
  // 传入商品id 将当前商品选中
  if (orderId != 0&&userId!=0) {
    data.forEach(function (item, index) {

      // 用户选中状态userSelectStatus 全部选中为true 一个没选中为false
      // 用户下商品选中状态childOrderShow 有一个选中为true 一个都没有显示false
      let userSelectStatus = true
      let childOrderShow = false
      item.item.forEach(function (good, i) {
        if (good.id == orderId && good['selectStatus']) {
          good['selectStatus'] = false

        } else if (good.id == orderId && !good['selectStatus']) {
          good['selectStatus'] = true
        }
        // 检测是否有未选
        if (!good['selectStatus']) {
          selectAllStatus = false
          userSelectStatus = false
        } else {
          childOrderShow = true
        }
        //此时判断活动相关商品
        if(item.sale_promotion){
          let flag = true
          data.forEach(v=>{
            if(v.seller_user_id == userId && v.sale_promotion){
              v.item.forEach(function (good, i) {
                if(!good['selectStatus']&&good.id!=orderId){
                  flag =false
                }
              })
            }
          })
          if (!flag) {
            selectAllStatus = false
            userSelectStatus = false
          } else {
            childOrderShow = true
          }

        }

      })
      if (childOrderShow) {
        item['childOrderShow'] = true
      } else {
        item['childOrderShow'] = false
      }

      if (userSelectStatus) {
        item['selectStatus'] = true
      } else {
        item['selectStatus'] = false
      }
      // 检测是否有未选(设置全选)
      if (!item['selectStatus']) {
        selectAllStatus = false
      }
      newData.push(item)
    })
  }
  if (orderId == 0 && userId == 0) {
    data.forEach(function (item, index) {
      item['selectStatus'] = status
      item['childOrderShow'] = status
      item.item.forEach(function (good, i) {
        good['selectStatus'] = status
      })
      newData.push(item)
    })
  }
  return {
    data: newData,
    selectAllStatus: selectAllStatus
  }

}



function formTime(end) {
  Date.prototype.toLocaleString = function () {
    return (this.getMonth() + 1) + "月" + this.getDate() + "日 ";
  };
  let time = +new Date()
  time = parseInt(time / 1000)
  if ((end - time) >= 86400) {
    const date = new Date(end * 1000).toLocaleString()
    return date + '后恢复原价'
  }
  if ((end - time) < 86400) {
    const timestamp = end - time
    let hour = parseInt(timestamp / 3600)
    let min = parseInt((timestamp - hour * 3600) / 60)
    return hour + "小时" + min + "分后恢复原价"
  }
}
function distinct(b) {
  return Array.from(new Set([...b]))
}
