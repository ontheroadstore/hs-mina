// pages/article/article.js
const app = getApp()
import { req } from '../../utils/api.js'
import util from '../../utils/util.js'
Page({

  data: {
    articleId: 0,                 // 商品ID
    goodInfo: null,               // 商品信息
    desc: null,
    content: null,
    postHtml: null,
    quanyiPrice: 0,
    selectStyleId: null,          // 选中的款式ID
    selectStylePostage: null,     // 选中的款式运费
    selectStyleName: null,        // 选中的款式名称
    selectStylePrice: null,       // 选中款式的价格
    selectStyleCount: 1,          // 选中款式的数量
    selectStyleStock: 0,          // 选中款式的库存
    specialOfferStatus: false,    // 选中款式的特价状态
    specialOfferPrice: null,      // 选中款式的特价
    presellTime: null,            // 选中款式 预售时间
    styleNum: 1,                  // 款式数量
    modulesUserGoods: null,       // 卖家其他商品
    modulesGuessLike: null,       // 猜你喜欢商品
    chartNum: 0,                  // 购物车数量
    addLikeStatus: false,         // 是否收藏
    selectStatus: false,          // 选择款式框显示状态
    selectScrollStatus: false,    // 款式是否滚动
    selectType: 0,                // 调起选择框：0文中选择 1加入购物车 2立即购买 （单个款式不调起）
    isIphoneX: app.globalData.isIphoneX,      // 是否IphoneX
    authorizationStatus: false,   //授权状态
    goodCanSell: false,           // 用户是否优惠
    activityCanBy: false,         // 显示 参与优惠活动按钮
    imgTxtArr: [],                //图文混排解析后的对象数组
    soldCountTxt:'',                   //卖出数量，哆嗦次数，少于1万件显示 xxx件，大于1万件显示 a.b万件
    couponPopup: 0,                //领券/返券 弹窗 1显示领券，2显示返券，0都不显示
    taxPopup: 0,                    //税费 1 显示  0 不显示
    explan: 0,                      //轨迹说明 1 显示 0 不显示
    getCoupon: null,                   //可以领取的coupon数组
    backCoupon: null,                   //返券数组
    deliveryTxt:'',               //发货周期文本
    remainBuy: 0,                 //限购剩余购买数量
    btnStatus:false,              //立即购买按钮状态
    limitBuyText: '立即购买',      //购买按钮显示限购数量
    fullReduceInfo: null,         //满减相关信息
    limitBuyNum: 0                //限购数量
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '商品详情'
    })
    this.setData({
      articleId: options.id
    })
    // 获取商品详情
    req(app.globalData.bastUrl, 'appv6_5/getCommodityDetail/' + this.data.articleId+'?mask=1').then(res => {

      if (typeof res.data === 'string'){
        //如果data不是对象，可能是含有\u2028,会导致解析错误
        try{
          res.data = JSON.parse(res.data.replace('/u2028', ''));
        }catch(e){
          console.log('获取商品详情 catch: ',e);
          wx.showToast({
            title: JSON.stringify(e),
            icon: 'none',
            duration: 3000
          })
        }
      }
      this.setData({
        fullReduceInfo: res.data.sale_promotion,
        modulesGuessLike: res.data.related_goods,
        desc: util.replaceBr(res.data.post.desc),
        // content: util.replaceBr(res.data.content)
      })
      let originData = res.data,subData=res.data.post;
      const goodInfo = Object.assign(originData,subData)
      
      const modulesUserGoods = res.data.seller_related_goods
      // 单个款式 直接显示预售且 选择框消失
      // 多个款式 选择框显示 预售消失 （在选中款式时，更新预售状态，以及选中的款式）
      const styleNum = goodInfo.type.length
      let presellTime = null
      let selectStyleId = null
      let specialOfferStatus = false
      let specialOfferPrice = false
      goodInfo.type.forEach((item,index) => {
        item.price = item.price+item.quanyi_price
        item.special_offer_price = item.special_offer_price+item.quanyi_price
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
      // 单个订单 初始 预售 款式ID 处理特价时间
      if (styleNum == 1) {
        presellTime = util.formatTime(goodInfo.type[0].estimated_delivery_date)
        selectStyleId = goodInfo.type[0].id
        specialOfferStatus = formTime(goodInfo.type[0].special_offer_start, goodInfo.type[0].special_offer_end)
        specialOfferPrice = goodInfo.type[0].special_offer_price

        let delivery = parseInt(goodInfo.type[0].expected_delivery_cycle);
        let deliveryTxt = '';
        if (delivery && delivery > 0) {
          if (delivery <= 3) {
            deliveryTxt = (delivery * 24) + '小时内发货';
          } else {
            deliveryTxt = delivery + '天内发货';
          }
        }
        this.setData({
          deliveryTxt: deliveryTxt,   //没有款式直接设置发货时间
        })
      }
      // 添加/64
      // res.data.seller.avatar = res.data.seller.avatar
      // res.data.modules[0].data.result[0].avatar = res.data.modules[0].data.result[0].avatar

      //生成卖出数量文字
      let soldCountTxt = '';
      if (goodInfo.purchaseList && goodInfo.purchaseList.total_count>0){
        let soldCount = goodInfo.sale_count;
        if (soldCount>10000){
          soldCount = Math.ceil(soldCount/1000)/10;
          soldCountTxt = soldCount + '万';
        }else{
          soldCountTxt = soldCount;
        }
      }
      this.setData({
        presellTime: presellTime,
        styleNum: styleNum,
        selectStyleId: selectStyleId,
        goodInfo: goodInfo,
        modulesUserGoods: modulesUserGoods,
        specialOfferStatus: specialOfferStatus,
        specialOfferPrice: specialOfferPrice,
        soldCountTxt: soldCountTxt,
      })
      console.log(goodInfo)
    if(goodInfo.post_html){
      goodInfo.post_html = goodInfo.post_html.replace(/class=/gi, '');
      goodInfo.post_html = goodInfo.post_html.replace(/width\s*:\s*[0-9]+px/g, 'width:100%');
      goodInfo.post_html = goodInfo.post_html.replace(/<([\/]?)(center)((:?\s*)(:?[^>]*)(:?\s*))>/g, '<$1div$3>');//替换center标签
      goodInfo.post_html = goodInfo.post_html.replace(/\<img/gi, '<img class="rich-img" ');//正则给img标签增加class
      //或者这样直接添加修改style
      goodInfo.post_html = goodInfo.post_html.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="width:100%;height:auto;display: block;margin:auto"');
      goodInfo.post_html = goodInfo.post_html.replace(/\<p/gi, '<P class="rich-p" ');//正则给p标签增加class
      this.setData({
        postHtml: goodInfo.post_html 
      })
    }
    else if(goodInfo.image_text){
      // 设置图文混排
      let postExcerpt = goodInfo.post_excerpt;
      let imageText = goodInfo.image_text;
      // console.log(imageText)
      if (imageText instanceof Array && imageText.length>0){
        let imgTxtArr = this.transImgTxt(postExcerpt,imageText,690);
        this.setData({
          imgTxtArr: imgTxtArr
        })
      }
    }else{
      this.setData({
        content: util.replaceBr(goodInfo.content)
      })
    }
    
      // 神策 浏览商品详情页
      app.sensors.track('commodityDetail', { commodityID: String(this.data.articleId), sellerID: String() });

    },(err)=>{
      setTimeout(()=>{
        wx.navigateBack();
      },1000)
    })
    // 更新购物车图标数量
    const that = this
    wx.getUserInfo({
      success: function () {
        that.getChartNum()
      },
      fail: function () {
        that.setData({
          authorizationStatus: true
        })
      }
    })

    // 获取优惠券
    this.getCouponList(options.id);
  },
  // 跳转
  activityToast: function () {
    wx.navigateTo({
      url: "/pages/webView/webView?url=" + app.globalData.bastUrl + "appv5_1/wxapp/adPage/17&title=夏日饮酒专场"
    })
  },
  onShow: function () {
    //重置绑定状态
    let that = this
    wx.getUserInfo({
      success: function () {
        that.getChartNum()
        that.setData({
          authorizationStatus: false
        })
      },
      fail: function () {
        that.setData({
          authorizationStatus: true
        })
      }
    })

    // 获取活动状态
    req(app.globalData.bastUrl, 'wxapp/winedoit/status').then(res => {
      if (res.data) {
        req(app.globalData.bastUrl, 'wxapp/winedoit/getIsSell', {
          goodsIds: this.data.articleId
        }, 'POST').then(res => {
          if (res.data.isCanSell && res.data.userCanBy == '1') {
            this.setData({
              goodCanSell: true,
              activityCanBy: true
            })
          } else if (res.data.isCanSell && (!res.data.userCanBy || res.data.userCanBy == '0')) {
            this.setData({
              activityCanBy: true
            })
          }
        })
      }
    })
  },
  //跳转登录
  jumpLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  jumpFullReduce(e){
    let spid = e.currentTarget.dataset.spid;
    let sptime = e.currentTarget.dataset.sptime;
    let sptitle = e.currentTarget.dataset.spname;
    wx.navigateTo({
      url: `/pages/fullReduce/fullReduce?spid=${spid}&sptime=${sptime}&sptitle=${sptitle}`,
    })
  },
  //跳转权益介绍页面
  jumpEquity(e){
     // 判断是否登录
     if (this.ifLogin() == false) {
      return;
    }
    const stock = e.target.dataset.stock
    if (stock == 0) {
      return wx.showToast({
        title: '当前商品暂无库存',
        icon: 'none',
        duration: 1000
      })
    }
    // 设置选择的款式，以及数量，进行数据缓存（没有款式，直接存储）
    let goodInfo = this.data.goodInfo
    goodInfo.articleId = parseInt(this.data.articleId)
 
      let newType = goodInfo.type
      newType[0]['number'] = 1
      newType[0]['desc'] = null
      goodInfo.newType = newType
      wx.setStorageSync('orderData', goodInfo)
      wx.navigateTo({
        url: `/pages/equity/equity?price=${goodInfo.type[0].quanyi_price}`,
      })
  },
  // 分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: this.data.goodInfo.title,
      path: '/pages/article/article?id=' + this.data.articleId,
      // imageUrl: this.data.goodInfo.banner[0],
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  // 获取购物车数量
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
  // 图片预览
  previewImage: function (e) {
    const url = e.target.dataset.url
    // 图片加入预览列表
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: this.data.goodInfo.images // 需要预览的图片http链接列表
    })
  },
  //预览banner
  previewImageBanner(e){
    const url = e.target.dataset.url
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: this.data.goodInfo.banner // 需要预览的图片http链接列表
    })
  },
  // 收藏
  addLike: function () {
    // 判断是否登录
    if (this.ifLogin() == false) {
      return;
    }
    if (this.data.goodInfo.is_favorited == 0) {
      req(app.globalData.bastUrl, 'appv2/itemaddfavourite', {
        item_id: this.data.articleId
      }, 'POST').then(res => {
        this.data.goodInfo.is_favorited = 1
        this.setData({
          goodInfo: this.data.goodInfo
        })
      })
      app.sensors.btnClick('收藏');
    } else {
      req(app.globalData.bastUrl, 'appv2/itemdeletefavourite', {
        item_id: this.data.articleId
      }, 'POST').then(res => {
        this.data.goodInfo.is_favorited = 0
        this.setData({
          goodInfo: this.data.goodInfo
        })
      })
      app.sensors.btnClick('取消收藏');
    }
    // 神策 收藏、取消
    app.sensors.track('collectOrNot', { 
      collectType: '商品', 
      commodityID: String(this.data.articleId), 
      sellerID: String(this.data.goodInfo.seller.id),
      operationType: this.data.goodInfo.is_favorited == 0 ? '收藏' : '取消收藏',
      });
  },
  // 加入购物车
  addChart: function (e) {
    // if(!this.data.isAddCart){
    //   wx.showModal({
    //     title: '',
    //     content: '此商品为会员限购，您还不是会员，不能购买。',
    //     confirmText: '成为会员',
    //     confirmColor: '#AE2121',
    //     cancelText: '放弃购买',
    //     success (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    //   return
    // }
    // 判断是否登录
    if (this.ifLogin() == false) {
      return;
    }
    // appv2/additemintocart 接口参数商品id 款式id 数量
    // this.data.articleId 商品id 
    // this.data.selectStyleId 款式id
    // this.data.selectStyleCount 数量
    req(app.globalData.bastUrl, 'appv2/additemintocart', {
      item_id: this.data.articleId,
      model_id: this.data.selectStyleId,
      count: this.data.selectStyleCount
    }, 'POST').then(res => {
      this.getChartNum(1)
      this.setData({
        selectStatus: false

      })
    })
  },
  // 显示款式选择框
  selectShow: function (e) {
    // 查询款式高度 设置是否滚动
    const that = this
    var query = wx.createSelectorQuery()
    query.select('#styles_select').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      if (res[0].height * 2 > 450) {
        that.setData({
          selectScrollStatus: true
        })
      }
      // console.log()
    })
    // 调起选择框状态
    const selectType = e.target.dataset.type ? e.target.dataset.type : 0
    // 每次打开选择款式框 初始数量
    this.setData({
      selectStatus: true,
      selectStyleCount: 1,
      selectType: selectType
    })
  },
  // 关闭款式选择框
  selectHide: function (e) {
    if (e.target.dataset.status == 'true') {
      this.setData({
        selectStatus: false
      })
    }
  },
  // 选中款式
  selectedStyle: function (e) {
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
    let restrictiontypes = this.data.goodInfo.type[oIndex].restrictionTypes
    let remainBuy = this.data.goodInfo.type[oIndex].remainBuy;
    let limitBuyNum = this.data.goodInfo.type[oIndex].limitBuyNum;
    let quanyiPrice = this.data.goodInfo.type[oIndex].quanyi_price
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
        limitBuyText: "立即购买",
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
    if (stock <= 0) {
      return false
    }
    // 每次切换款式 初始数量
    this.setData({
      selectStyleId: id,
      selectStylePostage: postage,
      selectStyleName: name,
      presellTime: presellTime,
      selectStylePrice: price,
      selectStyleStock: stock,
      selectStyleCount: 1,
      specialOfferStatus: specialOfferStatus,
      specialOfferPrice: specialOfferPrice,
      deliveryTxt: deliveryTxt,
      quanyiPrice: quanyiPrice
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
  // 数量加减
  subGoodNum: function () {
    if (this.data.selectStyleCount <= 1) {
      return false
    }
    let m = this.data.selectStyleCount - 1
    this.setData({
      selectStyleCount: m
    })
  },
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
  // 授权
  bindgetuserinfo: function (res) {
    const that = this
    if (res.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        authorizationStatus: false
      })
      app.login(function () {
        wx.showToast({
          title: '授权成功',
          icon: 'success',
          duration: 2000
        })
        that.getChartNum()
      })
    }
  },
  // 跳转下订单
  navigateToCreateOrder: function (e) {
    //判断没资格买
    // if(!this.data.isAddCart){
    //   wx.showModal({
    //     title: '',
    //     content: '此商品为会员限购，您还不是会员，不能购买。',
    //     confirmText: '成为会员',
    //     confirmColor: '#AE2121',
    //     cancelText: '放弃购买',
    //     success (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    //   return
    // }
    // if(this.data.isVipPrice&&this.data.isAddCart){
    //   wx.showModal({
    //     title: '',
    //     showCancel: false,
    //     content: '去APP买才能使用会员价优惠',
    //     success (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    // }
    // 判断是否登录
    if (this.ifLogin() == false) {
      return;
    }
    if (this.data.btnStatus){//如果已购买数量超过限购数量，不让点击
      return
    }
    const stock = e.target.dataset.stock
    if (stock == 0) {
      return wx.showToast({
        title: '当前商品暂无库存',
        icon: 'none',
        duration: 1000
      })
    }
    // 设置选择的款式，以及数量，进行数据缓存（没有款式，直接存储）
    let goodInfo = this.data.goodInfo
    goodInfo.articleId = parseInt(this.data.articleId)
    if (this.data.styleNum == 1) {
      let newType = goodInfo.type
      newType[0]['number'] = 1
      newType[0]['desc'] = null
      goodInfo.newType = newType
      wx.setStorageSync('orderData', goodInfo)
    } else {
      let selectStyleId = this.data.selectStyleId
      let selectStyleCount = this.data.selectStyleCount
      let newType = []
      goodInfo.type.forEach(function (item, index) {
        if (item.id == selectStyleId) {
          item['number'] = selectStyleCount
          item['desc'] = null
          newType.push(item)
        }
      })
      goodInfo.newType = newType
      wx.setStorageSync('orderData', goodInfo)
    }
    const url = '/pages/createOrder/createOrder?type=0'
    wx.navigateTo({
      url: url
    })
  },
  // 跳转购物车
  navigateToChart: function () {
    app.sensors.btnClick('购物车');
    // 判断是否登录
    if(this.ifLogin()==false){
      return ;
    }
    wx.navigateTo({
      url: "/pages/secondLevelChart/secondLevelChart"
    })
  },
  // 跳转商品
  navigateToGoods: function (e) {
    let id = e.target.dataset.id
    let index = e.target.dataset.index
    let title = e.target.dataset.title
    let satype = e.target.dataset.satype
    let type = ['卖家推荐商品', '猜你喜欢']
    const url = '/pages/article/article?id=' + id
    wx.redirectTo({
      url: url
    })
    app.sensors.funMkt(type[satype], '商品详情页', title, index, '商品', id)
  },
  // 跳转用户
  navigateToUser: function (e) {
    let id = e.target.dataset.id
    let name = e.target.dataset.name
    let index = e.target.dataset.index
    let satype = e.target.dataset.satype
    let btn = e.target.dataset.btn
    let type = ['卖家推荐商品', '猜你喜欢']
    const url = '/pages/user/user?id=' + id + '&name=' + name
    wx.redirectTo({
      url: url
    })
    app.sensors.funMkt(type[satype], '商品详情页', id, index, '店铺', '')
    if(btn){
      app.sensors.btnClick(btn);
    }
  },
  navigateToUserBtn: function(e){
    let id = e.target.dataset.id
    let name = e.target.dataset.name
    let btn = e.target.dataset.btn
    const url = '/pages/user/user?id=' + id + '&name=' + name
    wx.redirectTo({
      url: url
    })
    app.sensors.btnClick(btn);
  },
  // 返回首页
  returnIndex: function () {
    wx.switchTab({
      url: "/pages/index/index"
    })
  },
  // 图文混排处理
  // @txt 图文混排的图文； @urls 图片的数组； @imgWidth 图片的宽度 单位rpx；
  transImgTxt: function (txt, urls, imgWidth) {

    let reg = /<img_[^>]*>/ig;
    //获取图文中的文本数组
    let txtArr = txt.split(reg);
    //获取图文中的图片标签
    let imgArr = [];
    let temp;
    while (temp = reg.exec(txt)) {
      imgArr.push(temp[0])
    }

    let arr = [];//保存图文解析后的对象数组

    for (let i = 0; i < txtArr.length; i++) {

      //文本按换行分割
      let txtTmp = txtArr[i].split(/\n|\r/g);
      for (let j = 0; j < txtTmp.length; j++) {
        arr.push({
          type: 0,//txt
          txt: txtTmp[j]
        })
      }

      if (imgArr[i] && urls[i]) {
        let imgTmp = imgArr[i].replace(/<img_|>/ig, '').split('_');
        let imgW,imgH;
        if(imgWidth){
          imgW = imgWidth + 'rpx';
          imgH = (imgWidth * imgTmp[1] / imgTmp[2]) + 'rpx';
        }else{
          imgW = '100%';
          imgH = 'auto';
        }
        arr.push({
          type: 1,//img
          url: urls[i],
          width: imgTmp[2],
          height: imgTmp[1],
          imgW : imgW,
          imgH : imgH,
        })
      }

    }

    // console.log('图文：', arr);
    return arr;
  },
  //跳转到哆嗦列表
  navigateToPurchaseList: function(){
    const url = '/pages/purchaseList/purchaseList?articleId=' + this.data.articleId;
    wx.navigateTo({
      url: url
    })
    // console.log('navigate to : ', this.data.articleId)
  },

  // 判断是否登录,如果没有登录,点击 购物车/收藏/加入购物车/立即购买 时跳入绑定页
  ifLogin: function(){
    let status = false
    app.ifLogin(() => {
      status = true
    }, () => {
      status = false
    }, true);
    return status;
  },
  //设置税费
  setTaxPopup: function (event) {
    let type = +event.currentTarget.dataset.type;
    if(type >= 0){
      this.setData({
        taxPopup: type,
      })
    };
  },
  //轨迹说明
  setExplanPopup: function(event){
    let type = +event.currentTarget.dataset.type;
    if(type >= 0){
      this.setData({
        explanPopup: type,
      })
    };
  },

  // 设置领券、返券弹窗状态
  setCouponPopup: function(event){
    let type = +event.currentTarget.dataset.type;
    if(type >= 0){
      this.setData({
        couponPopup: type,
      })
    };
  },

  // 获取领券和返券
  getCouponList: function(id){
    req(app.globalData.bastUrl, 'appv6/coupon/getPostsCouponList', { 'post_id[]':id},'GET').then(res => {
      if (res.status==1) {
        this.setData({
          getCoupon: this.formatCouponData(res.data.coupon),
          backCoupon: this.formatCouponData(res.data.returnCoupon),
        })
      }

    })
  },
  // 处理优惠券列表数据
  formatCouponData: function(data){
    if(data && data.length>0){
      data.forEach((v, i, arr)=>{
        if (v.min_price>0){
          v.coupon_tip = '满' + v.min_price+'可用';
        }else{
          v.coupon_tip = '消费任意金额可用';
        }
        if(v.apply_time_type == 2){
          let startTime = (new Date()).getTime();
          let endTime = startTime + v.apply_time_length * 24 * 60 * 60 * 1000;
          v.start_time = this.couponFmtTime(startTime);
          v.end_time = this.couponFmtTime(endTime);
        } else{
          v.start_time = this.couponFmtTime(v.apply_time_start);  // 使用开始时间
          v.end_time = this.couponFmtTime(v.apply_time_end);       // 使用结束时间
        }
        v.can_get = 1; //是否可领
      })
      return data;
    }else{
      return [];
    }
  },
  // 优惠券时间格式化
  couponFmtTime: function (time){
    function fixNum(v){
      return v < 10 ? '0' + v : v;
    }
    time = String(time).length === 10 ? time * 1000 : time;
    var t = new Date(time);
    var y = fixNum(t.getFullYear());
    var m = fixNum(t.getMonth() + 1);
    var d = fixNum(t.getDate());
    return y + '.' + m + '.' + d;
  },
  // 领取优惠券
  getCoupon: function (event) {
    // 判断是否登录
    if (this.ifLogin() == false) {
      return;
    }
    let id = event.currentTarget.dataset.id;
    let url = `appv6/coupon/${id}/receive`
    req(app.globalData.bastUrl, url, {}, 'POST').then(res => {
      if (res.status == 1) {
        wx.showToast({
          title: '领取成功',
          icon: 'none',
          duration: 2000
        })
      }

    })
  },
  // 查看商品按钮
  seeGoods: function (event){
    let issueBy = event.currentTarget.dataset.issue_by + '';
    let couponId = event.currentTarget.dataset.id;
    let userid = this.data.goodInfo.seller.id;
    let username = this.data.goodInfo.seller.name;
    // issueBy 5=去优惠券商品列表页; 6=去分类页; 7=去店铺首页
    let seeGoodsUrl = '';
    switch (issueBy) {
      case '5':
        seeGoodsUrl = '/pages/index/index?couponid=' + couponId;
        wx.navigateTo({
          url: seeGoodsUrl,
        });
        break;
      case '6':
        seeGoodsUrl = '/pages/index/index';
        wx.switchTab({
          url: seeGoodsUrl,
        });
        break;
      case '7':
        seeGoodsUrl = '/pages/user/user?id=' + userid + '&name=' + username;
        wx.navigateTo({
          url: seeGoodsUrl,
        });
        break;
      default:
        seeGoodsUrl = '/pages/index/index';
        wx.switchTab({
          url: seeGoodsUrl,
        });
        break;
    }




  },
  //downloadApp
  downloadApp: function(ev){
    wx.navigateTo({
      url: "/pages/downloadApp/downloadApp",
    })
  },
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
