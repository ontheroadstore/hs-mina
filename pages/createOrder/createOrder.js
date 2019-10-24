// pages/createOrder/createOrder.js
const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'

Page({

  data: {
    orderType: 0,                 // 入口类型  0直接购买 1购物车购买 选中地址跳转时+ 方便返回
    singleOrder: [],              // orderType=0 设置数据
    orderList: [],                // orderType=1 设置数据
    totalPrice: 0,                // 总价
    totalPostage: 0,              // 总邮费
    addressInfo: null,            // 默认地址 在支付时，addressInfo不能为空
    orderNumber: null,            // 订单号 HS20180510144319VWW33O
    isIphoneX: app.globalData.isIphoneX,      // 是否IphoneX
    goodCanSell: false,           // 用户是否优惠
    canUseCoupon: [],         //可用优惠券
    unUseCoupon:[],           //不可用优惠券
    tagId:1,    //选择优惠券
    couponList:[],//当前优惠券渲染列表
    useCouponId:'',//使用的优惠券id
    useCouponPrice:'',//使用的优惠券金额
    fullReducePrice: 0, //满减的金额
    spids:[],
    idCard: '', //身份证号
    isEdit: false, //是去编辑
    isOverSeas: false, //是否是海外的商品
    hasIdCard: false //是否有身份证信息
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '确认订单'
    })
    // options.type = 0
    // type 0 直接购买， 1购物车购买 缓存数据头像已经处理
    if (options.type == 0) {
      let orderData = wx.getStorageSync('orderData')
      // 如果是特价商品 直接替换price
      const nowDate = +new Date()
      if (orderData.newType[0].special_offer_end * 1000 >= nowDate && orderData.newType[0].special_offer_start * 1000 <= nowDate) {
        orderData.newType[0].price = orderData.newType[0].special_offer_price
      }
      // 邮费
      if (!this.data.addressInfo){
        //*如果没有地址，设置邮费为0,防止未选择地址时总价格显示有误，暂时这样处理，应该后台接口直接返回0.
        orderData.newType[0].postage = 0;
      }
      let totalPostage = orderData.newType[0].postage
      // 总价
      const countPrice = this.reduceCoupon(countTotalPrice(orderData, 0))
      this.setData({
        orderType: 0,
        singleOrder: orderData,
        totalPostage: totalPostage,
        totalPrice: countPrice.totalPrice
      })
    }
    if (options.type == 1) {
      let orderList = wx.getStorageSync('chartData')
      let fullReduce = wx.getStorageSync('fullReduce') 
      this.setData({
        fullReducePrice: fullReduce.fullReducePrice
        // useCouponId: fullReduce.canUseCouponId,//使用的优惠券id
        // useCouponPrice:fullReduce.maxCouponPrice//使用的优惠券金额
      })
      let that = this;
      let spids = []

      orderList.forEach((v,idx)=>{
        // users.push(v.seller_user_id)
        if(idx>0){
          if(v.seller_user_id==orderList[idx-1].seller_user_id){
          
            if(orderList[idx-1].sale_promotion){
              orderList[idx-1].item.sale_promotion = orderList[idx-1].sale_promotion
              v.item.concat(orderList[idx-1].item)
            }else{
              v.item.concat(orderList[idx-1].item)
            }
            orderList.slice(0,idx-1).concat(orderList.slice(idx+1,orderList.length-1));
            console.log(orderList)
          }
        }
       
      })
      console.log(orderList)
      // users.forEach(v=>{

      // })
      orderList.forEach(function (item, index) {
        let maxPostage = 0
        var numItem = item.item.length
      
        if(item.sale_promotion){
          spids.push(item.sale_promotion.sp_id)
        }
      
        item.item.forEach(function (good, i) {
          if (good.postage > maxPostage && good.selectStatus) {
            maxPostage = good.postage

            if (!that.data.addressInfo) {
              //*如果没有地址，设置邮费为0,防止未选择地址时总价格显示有误，暂时这样处理，应该后台接口直接返回0.
              maxPostage = 0;
            }
          }
          // 如果售罄 下架 直接设置隐藏
          if (good['is_sku_deleted'] != 0 || good['remain'] <= 0|| good['status']!=1) {
            good['selectStatus'] = false
            item['selectStatus'] = false
            numItem = numItem - 1
            // item['childOrderShow'] = false
          }
          // 如果有特价 重新设置price参数
          if (good['special_offer_end']) {
            good['price'] = good['special_offer_price']
          }
        })
        if (numItem <= 0) {
          item['childOrderShow'] = false
        }
        item['maxPostage'] = maxPostage
        item['desc'] = null
      })
      const countPrice = this.reduceCoupon(countTotalPrice(orderList, 1))
      this.setData({
        orderType: 1,
        orderList: orderList,
        totalPostage: countPrice.totalPostage,
        spids: distinct(spids),
      
        totalPrice: countPrice.totalPrice
      })
    }
    // 获取默认地址
    // "appv2/defaultaddress" morendizhi
    req(app.globalData.bastUrl, 'appv2/defaultaddress', {}).then(res => {
      if (res.status == 1) {
        let sfz = ''
        if(res.data.shenfenzheng){
          this.setData({
            hasIdCard: true
          })
          sfz = res.data.shenfenzheng.substr(0,4)+'**********'+ res.data.shenfenzheng.substr(14,4)
        }
        this.setData({
          addressInfo: res.data,
          idCard: sfz
        })
        //todo: 如果有地址就去发请求更新邮费
        this.updateFreightFee(res.data); 
        this.getCouponList()
      }
    })
    // 获取活动状态
    req(app.globalData.bastUrl, 'wxapp/winedoit/status').then(res => {
      if (res.data) {
        req(app.globalData.bastUrl, 'wxapp/winedoit/getIsSell', {
          goodsIds: this.data.singleOrder.articleId
        }, 'POST').then(res => {
          if (res.data.isCanSell && res.data.userCanBy == '1') {
            this.setData({
              goodCanSell: true
            })
            // 修改显示价格
            var singleOrder = this.data.singleOrder
            singleOrder.newType[0].price = singleOrder.newType[0].price - 5
            const countPrice = this.reduceCoupon(countTotalPrice(singleOrder, 0))
            this.setData({
              singleOrder: singleOrder,
              totalPrice: countPrice.totalPrice
            })
          }
        })
      }
    })
    //获取是否是海外商品
    this.checkIsOverSeas()
    //获取可用优惠券列表
  },
  //获取身份证号
  getIdCardNumber(e){
    console.log(e)
    this.setData({
      idCard: e.detail.value
    })
  },
  saveIdCardNumber(){
    var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    if(p.test(this.data.idCard)){
      req(app.globalData.bastUrl, 'appv6/checkIdNumber', {
        address_id: this.data.addressInfo.id,
        id_number: this.data.idCard
      },'POST').then(res => {
        if (res.code == 1) {
          this.setData({
            hasIdCard: true,
            idCard:  this.data.idCard.substr(0,4)+'**********'+ this.data.idCard.substr(14,4)
          })
        }
      })

    }else{
     
      wx.showToast({
        title: '请输入正确的身份证号',
        icon: 'none',
        duration: 1000
      })
      this.setData({
        idCard: ''
      })
    }
  },
  showEditIdCard(){
    this.setData({
      hasIdCard: false,
      idCard:'',
      isEdit: true

    })
  },
  checkIsOverSeas(){
    if(this.data.singleOrder.title){
      let status =  this.data.singleOrder.require_duty==1?true:false
      this.setData({
        isOverSeas: status
      })
    }else{
      let orderList =this.data.orderList
      console.log(orderList)
      orderList.forEach(v=>{
          v.item.forEach(t=>{
            if(t.require_duty==1&&t.selectStatus){
              this.setData({
                isOverSeas: true
              })
            }
          })
      })
    }
  },
  // 添加备注
  descContent: function (e) {
    const content = e.detail.value
    if (this.data.orderType == 0) {
      this.data.singleOrder.newType[0]['desc'] = e.detail.value
    } else {
      const userid = e.target.dataset.userid
      let orderList = this.data.orderList
      orderList.forEach(function (item, index) {
        if (item.seller_user_id == userid) {
          item.desc = content
        }
      })
      this.setData({
        orderType: 1,
        orderList: orderList
      })
    }
  },
  // 支付生成订单进行支付（正常购买）
  payment: function () {
    // 先检测地址是否添加
    if (!this.data.addressInfo) {
      wx.showToast({
        title: '请添加地址',
        icon: 'none',
        duration: 1000
      })
    }
    //检测是否是海外商品
    if(this.data.isOverSeas){
      if(this.data.idCard==""){
        wx.showToast({
          title: '请检查身份证号',
          icon: 'none',
          duration: 1000
        })
        return
      }
    }
    var createOrderData = []
    // 多个订单 orderList 在orderList提取需要提交的数据
    if (this.data.orderType == 1) {
      this.data.orderList.forEach(function (item, index) {
        if (item.childOrderShow) {
          let newItem = []
          item.item.forEach(function (good, i) {
            if (good.selectStatus) {
              newItem.push({
                counts: good.numbers,
                item_id: good.item_id,
                mid: good.model_id
              })
            }
          })
          if (!item.desc) {
            item.desc = ''
          }
          createOrderData.push({
            attach: item.desc,
            items: newItem,
            seller_name: item.seller_name,
            seller_uid: item.seller_user_id
          })
        }
      })
    }

    // 直接从地址跳入购买
    if (this.data.orderType == 0) {
      // 因为后端的原因，attach不能为null，设成''空字符
      var desc = ''
      if (this.data.singleOrder.newType[0].desc) {
        desc = this.data.singleOrder.newType[0].desc
      }
      createOrderData = [{
        attach: desc,
        items: [{
          counts: this.data.singleOrder.newType[0].number,
          item_id: this.data.singleOrder.articleId,
          mid: this.data.singleOrder.newType[0].id
        }],
        seller_name: this.data.singleOrder.seller.name,
        seller_uid: this.data.singleOrder.seller.id
      }]
    }

    // 执行生成订单方法 this.data.orderType 参考
    if (this.data.goodCanSell) {
      // 活动购买
      this.activityCreateorder(createOrderData)
    } else {
      // 正常购买
      this.createorder(createOrderData)
    }
  },
  // 生成订单
  // 	"orders": [{
  //   "attach": "旅途",
  //   "items": [{
  //     "counts": "1",
  //     "item_id": "1095220",
  //     "mid": "868277"
  //   }],
  //   "seller_name": ".动感光波.还就喜欢",
  //   "seller_uid": "168"
  // }]
  activityCreateorder: function (order) {
    req(app.globalData.bastUrl, 'wxapp/winedoit/createOrder', {
      address_id: this.data.addressInfo.id,
      type: 1,
      orders: order,
      payment_type: 3
    }, 'POST').then(res => {
      if (res.code == 1) {
        this.buychecking(res.data)
      }
    })
  },
  //优惠券tab
  tagClick:function(e){
    let tagId = e.target.dataset.id;
    let that = this;
    this.setData({
      tagId
    })
    that.getCouponList()
  },
  couponDetailMes: function (e) {
    let index = e.currentTarget.dataset.index;
    let showMes = "couponList[" + index + "].show_mes";
    let bflag = this.data.couponList[index].show_mes;
    this.setData({
      [showMes]: !bflag
    })
  },
  //显示优惠券弹窗
  setCouponPopup: function(event){
    let type = +event.currentTarget.dataset.type;
    if(type >= 0){
      this.setData({
        couponPopup: type,
      })
    };
  },
  //点击选择使用优惠券
  selectCoupon(e){

    this.setData({
      useCouponId: e.detail.value
    })
    if(this.data.orderType==1){
      var countPrice =  this.reduceCoupon(countTotalPrice(this.data.orderList, this.data.orderType))
    }else{
      var countPrice =  this.reduceCoupon(countTotalPrice(this.data.singleOrder, this.data.orderType))
    }
  
    this.setData({
      totalPrice: countPrice.totalPrice
    })
  },
  //获取可使用优惠券
  getCouponList(){
    let order = this.getOrderData()
    req(app.globalData.bastUrl, 'appv6/coupon/getOrderCouponList', {
      orders: order
    }, 'POST').then(res => {
      if (res.code == 1) {
      if(res.data.useCoupon){
        let _useCoupon = res.data.useCoupon
         _useCoupon.forEach(v=>{
          v.start_time = this.couponFmtTime(v.apply_time_start);  // 使用开始时间
          v.end_time = this.couponFmtTime(v.apply_time_end);   
        })
      }
      if(res.data.useNoCoupon){
        let _useNocoupon = res.data.useNoCoupon
        _useNocoupon.forEach(v=>{
          v.start_time = this.couponFmtTime(v.apply_time_start);  // 使用开始时间
          v.end_time = this.couponFmtTime(v.apply_time_end);   
        })
      }
      this.setData({
        canUseCoupon: res.data.useCoupon,
        unUseCoupon: res.data.useNoCoupon
      })
        if(this.data.tagId==1){
          this.setData({
            couponList: res.data.useCoupon
          })
        }else{
          this.setData({
            couponList: res.data.useNoCoupon
          })
        }
      }
    })
  },
  //减去优惠券的价格计算
  reduceCoupon(param){
    // console.log("useCouponId:"+this.data.useCouponId)
    // console.log(this.data.useCouponId)
    if(this.data.useCouponId){
      this.data.canUseCoupon.forEach(v=>{
        if(v.id==this.data.useCouponId){
          param.totalPrice-=v.coupon_price  
          this.setData({
            useCouponPrice: v.coupon_price
          })
        }
      })
    }
    param.totalPrice-=this.data.fullReducePrice
    return param
  },
  countTotalReduce() {

    let list = this.data.orderList
    if(!list){
      return
    }
    let totalPrice =0
    let spids = this.data.spids
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
              aPrice: good['numbers'] * good['price'] 
            })
          }
          totalPrice += good['numbers'] * good['price']
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
              aPrice: good['numbers'] * good['special_offer_price'] 
            })
          }
          totalPrice += good['numbers'] * good['special_offer_price']
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
    console.log(couponInfo)
    if(couponInfo){
      let couponList = []
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
        fullReducePrice: fullReducePrice,
     
      })
      const countPrice = this.reduceCoupon(countTotalPrice(this.data.orderList, this.data.orderType))
      this.setData({
        totalPrice: countPrice.totalPrice
      })
     
    }
  
  },
  //订单数据
  getOrderData(){
    let createOrderData = []
    // 多个订单 orderList 在orderList提取需要提交的数据
    if (this.data.orderType == 1) {
      this.data.orderList.forEach(function (item, index) {
        if (item.childOrderShow) {
          let newItem = []
          item.item.forEach(function (good, i) {
            if (good.selectStatus) {
              newItem.push({
                counts: good.numbers,
                item_id: good.item_id,
                mid: good.model_id
              })
            }
          })
          if (!item.desc) {
            item.desc = ''
          }
          createOrderData.push({
            attach: item.desc,
            items: newItem,
            seller_name: item.seller_name,
            seller_uid: item.seller_user_id
          })
        }
      })
    }

    // 直接从地址跳入购买
    if (this.data.orderType == 0) {
      // 因为后端的原因，attach不能为null，设成''空字符
      var desc = ''
      if (this.data.singleOrder.newType[0].desc) {
        desc = this.data.singleOrder.newType[0].desc
      }
      createOrderData = [{
        attach: desc,
        items: [{
          counts: this.data.singleOrder.newType[0].number,
          item_id: this.data.singleOrder.articleId,
          mid: this.data.singleOrder.newType[0].id
        }],
        seller_name: this.data.singleOrder.seller.name,
        seller_uid: this.data.singleOrder.seller.id
      }]
    }
    return createOrderData
  },
  //格式化时间
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
  //创建订单
  createorder: function (order) {
    req(app.globalData.bastUrl, 'appv6/createorder', {
      address_id: this.data.addressInfo.id,
      type: 1,
      orders: order,
      payment_type: 3,
      user_coupon_id: this.data.useCouponId
    }, 'POST').then(res => {
      if (res.code == 1) {
        this.buychecking(res.data)
      }
    })
  },
  buychecking: function (ordernumber) {
    // 订单号
    this.setData({
      orderNumber: ordernumber
    })
    req(app.globalData.bastUrl, 'appv2_1/buychecking', {
      order_number: ordernumber,
      payment_type: 3
    }, 'POST', true).then(res => {
      this.wxpayment(res.data)
    })
  },
  // 微信支付方法
  // ordernummber
  // 文档：https://developers.weixin.qq.com/miniprogram/dev/api/api-pay.html
  wxpayment: function (prepayId) {
    const orderNumber = this.data.orderNumber
    const that = this
    req(app.globalData.bastUrl, 'appv5_1/payment/getWxPaymentParam', {
      package: 'prepay_id=' + prepayId
    }, 'POST').then(res => {
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        success: function () {
          // wx.navigateTo({
          //   url: '/pages/orders/orders?type=0',
          // })
          // 推送 appv5_1/wxapp/payment/action
          req(app.globalData.bastUrl, 'appv2_1/buysuccess', {
            order_number: orderNumber
          }, 'POST')
          that.paymentSuccess(prepayId)
        },
        fail: function () {
          if (that.data.goodCanSell) {
            req(app.globalData.bastUrl, 'wxapp/winedoit/reback', {}, 'GET', true)
          }
          req(app.globalData.bastUrl, 'appv2_1/buyfailed', {
            order_number: orderNumber
          }, 'POST', true)
        }
      })
    })
  },
  // 支付成功后回调
  paymentSuccess: function (prepayId) {
    const orderNumber = this.data.orderNumber
    req(app.globalData.bastUrl, 'appv5_1/wxapp/payment/action', {
      order_number: orderNumber,
      prepay_id: prepayId
    }, 'POST', true).then(res => {
      wx.reLaunch({
        url: '/pages/paySuccess/paySuccess?orderNumer='+orderNumber,
      })
    })
  },
  // 跳转添加地址
  navigateToAddress: function (e) {
    let orderType = this.data.orderType
    const url = '/pages/address/address?type=1&orderType=' + orderType
    wx.redirectTo({
      url: url
    })
  },
  // 修改商品数量
  subNum: function (e) {
    const orderType = this.data.orderType
    if (orderType == 1) {
      const id = e.target.dataset.id
      this.data.orderList.forEach(function (item, index) {
        item.item.forEach(function (good, i) {
          if (good.numbers <= 1 && good.id == id) {
            good.numbers = 1
            wx.showToast({
              title: '最少购买一个',
              icon: 'none',
              duration: 1000
            })
          } else if (good.numbers != 0 && good.id == id) {
            good.numbers = good.numbers - 1
          }
        })
      })

     

      const countPrice = this.reduceCoupon(countTotalPrice(this.data.orderList, orderType))
      this.setData({
        orderList: this.data.orderList,
        totalPostage: countPrice.totalPostage,
        totalPrice: countPrice.totalPrice
      })
    } else {
      let num = this.data.singleOrder.newType[0].number
      if (num <= 1) {
        wx.showToast({
          title: '最少购买一个',
          icon: 'none',
          duration: 1000
        })
        this.data.singleOrder.newType[0].number = 1
      } else {
        this.data.singleOrder.newType[0].number = this.data.singleOrder.newType[0].number - 1
         //更新优惠券信息
       this.getCouponList()
      }
      const countPrice = this.reduceCoupon(countTotalPrice(this.data.singleOrder, orderType))
      this.setData({
        singleOrder: this.data.singleOrder,
        totalPrice: countPrice.totalPrice
      })
    }
    // this.countTotalReduce()
   
  },
  addNum: function (e) {
    const orderType = this.data.orderType;
    let remainBuy = e.target.dataset.remainbuy;
    if (orderType == 1) {
      const id = e.target.dataset.id
      const remain = e.target.dataset.remain;
      let limitBuyNumber = 0;
      let sellerIndex = e.target.dataset.sellerindex;
      let goodIndex = e.target.dataset.goodindex
      let sellerArr = this.data.orderList[sellerIndex];
      if (sellerArr.item[goodIndex].numbers>=remain){
        wx.showToast({
          title: '当前库存为' + remain,
          icon: 'none',
          duration: 1000
        })
        return
      }
      if (sellerArr.item[goodIndex].goodsRestrictionNumber) {
        //判断款式是否限购
        if (sellerArr.item[goodIndex].numbers < sellerArr.item[goodIndex].remainBuy) {
          sellerArr.item[goodIndex].numbers = sellerArr.item[goodIndex].numbers + 1
          //更新优惠券
          this.getCouponList()
        } else {
          wx.showToast({
            icon: 'none',
            title: '您最多可以购买' + sellerArr.item[goodIndex].remainBuy + '件',
          })
        }
      } else if (sellerArr.item[goodIndex].postsRestrictionNumber) {
        //判断商品是否限购
        sellerArr.item.forEach((item, index) => {
          limitBuyNumber += item.numbers;//计算同类商品的购买数量之和
        })
        
        if (limitBuyNumber > sellerArr.item[goodIndex].remainBuy) {
          wx.showToast({
            icon: 'none',
            title: '您最多可以购买' + sellerArr.item[goodIndex].remainBuy + '件',
          })
        } else {
          sellerArr.item[goodIndex].numbers = sellerArr.item[goodIndex].numbers + 1
          //更新优惠券
          this.getCouponList()
        }
      } else {
        sellerArr.item[goodIndex].numbers = sellerArr.item[goodIndex].numbers + 1
        //更新优惠券
        this.getCouponList()
      }
      const countPrice = this.reduceCoupon(countTotalPrice(this.data.orderList, orderType))
      this.setData({
        orderList: this.data.orderList,
        totalPostage: countPrice.totalPostage,
        totalPrice: countPrice.totalPrice
      })
    } else {
      console.log(e.target.dataset.remain)
      const remain = e.target.dataset.remain
      let num = this.data.singleOrder.newType[0].number
      if (num >= remain) {
        this.data.singleOrder.newType[0].number = remain
        wx.showToast({
          title: '当前库存为' + remain,
          icon: 'none',
          duration: 1000
        })
      } else if (remainBuy !== '' && num >= remainBuy){
        wx.showToast({
          title: '您最多可购买' + remainBuy + '件',
          icon: 'none',
          duration: 1000
        })
      }else{
        this.data.singleOrder.newType[0].number = this.data.singleOrder.newType[0].number + 1
        //更新优惠券
        this.getCouponList()
      }
      const countPrice = this.reduceCoupon(countTotalPrice(this.data.singleOrder, orderType))
      this.setData({
        singleOrder: this.data.singleOrder,
        totalPrice: countPrice.totalPrice
      })
    }
    // this.countTotalReduce()
    
  },
  // 修改订单信息进行付款（待付款订单进入付款）
  updatePayment: function () {

  },
  // 请求并更新邮费 @addr : 地址对象
  updateFreightFee: function (addr) {
    if(!addr) return;
    let that = this;
    let obj = {};
    let orderType = this.data.orderType;
    let modelIds = [];//款式id数组
    let orderList = this.data.orderList;
    let singleOrder = this.data.singleOrder;
    if (orderType==0){
      // 直接购买
      modelIds.push(singleOrder.newType[0].id);
      
      // this.singleOrder.newType[0].postage;//单件商品运费
      // this.totalPostage;//总运费
    }else{
      // 购物车购买
      // 获取所有的款式id
      // let oldPostage = [];
      orderList.forEach(function (li, i) {
        if (li.childOrderShow){
          li.item.forEach(function (it, j) {
            if (it.selectStatus) {
              modelIds.push(it.model_id);
            }
          })
          // oldPostage.push(li.maxPostage);
        }
      })
      // this.orderList[i].maxPostage;//每件商品运费
      // this.totalPostage;//总运费
    }
  
    obj.data = JSON.stringify(modelIds);
    obj.provice = addr.province;

    req(app.globalData.bastUrl, 'appv5_2/getFreightFee', obj).then(res => {
      if (res.status == 1) {
        if (orderType == 0) {
          let uid = singleOrder.seller.id;
          let newPostage = res.data[uid].freight_fee
          let postageTxt = 'singleOrder.newType[0].postage';
          that.setData({
            [postageTxt]: newPostage
          })

          //更新总邮费和总价格
          let totalPostage = newPostage
          const countPrice = this.reduceCoupon(countTotalPrice(that.data.singleOrder, 0))
          that.setData({
            totalPostage: totalPostage,
            totalPrice: countPrice.totalPrice
          })

        }else{
          //设置新邮费
          orderList.forEach(function (li, i) {
            if (li.childOrderShow) {
              let uid = li.seller_user_id;
              let prop = 'orderList[' + i +'].maxPostage';
              that.setData({
                [prop]: res.data[uid].freight_fee
              })
            }

          })
          //更新总邮费和总价格
          const countPrice = this.reduceCoupon(countTotalPrice(orderList, 1))
          that.setData({
            totalPostage: countPrice.totalPostage,
            totalPrice: countPrice.totalPrice
          })
        }
      }
    })
  },

})

// 重新计算运费和总价
function countTotalPrice(data, n) {
  if (n == 1) {
    let totalPostage = 0
    let totalPrice = 0
    // 邮费处理 增加备注字段
    data.forEach(function (item, index) {
      item.item.forEach(function (good, i) {
        if (good.selectStatus) {
          totalPrice += good['numbers'] * good['price']
        }
      })
      if (item.childOrderShow) {
        totalPostage += item['maxPostage']
        totalPrice += item['maxPostage']
      }
    })
   
    return {
      totalPostage: totalPostage,
      totalPrice: totalPrice
    }
  } else {
    let totalPrice = Number(data.newType[0].postage) + data.newType[0].price * data.newType[0].number

    return {
      totalPrice: totalPrice
    }
  }
}
//判断限购的类型，存储数据
function limitType(json){
  if (json.postsRestrictionNumber != undefined) {
    json.restrictionTypes = 0 //商品限购
    json.limitBuyNum = json.postsRestrictionNumber //限购数量
    json.remainBuy = json.postsRestrictionNumber - json.postsAlreadyNumber
  } else if (json.goodsRestrictionNumber != undefined) {
    json.restrictionTypes = 1 //款式限购
    json.limitBuyNum = json.goodsRestrictionNumber //限购数量
    json.remainBuy = json.goodsRestrictionNumber - json.goodsAlreadyNumber
  }
}
function distinct(b) {
  return Array.from(new Set([...b]))
}

