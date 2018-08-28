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
    activityCanBy: false,          // 显示 参与优惠活动按钮
    imgTxtArr: [],                //图文混排解析后的对象数组
    soldCountTxt:'',                   //卖出数量，哆嗦次数，少于1万件显示 xxx件，大于1万件显示 a.b万件
    deliveryTxt:'',                    //发货周期文本
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '商品详情'
    })
    this.setData({
      articleId: options.id
    })
    // 获取商品详情
    req(app.globalData.bastUrl, 'appv3_1/goods/' + this.data.articleId).then(res => {
      this.setData({
        modulesGuessLike: res.data.modules[1].data.result,
        desc: util.replaceBr(res.data.desc),
        content: util.replaceBr(res.data.content)
      })
      const goodInfo = res.data
      const modulesUserGoods = res.data.modules[0]
      // 单个款式 直接显示预售且 选择框消失
      // 多个款式 选择框显示 预售消失 （在选中款式时，更新预售状态，以及选中的款式）
      const styleNum = goodInfo.type.length
      let presellTime = null
      let selectStyleId = null
      let specialOfferStatus = false
      let specialOfferPrice = false
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
      res.data.seller.avatar = res.data.seller.avatar
      res.data.modules[0].data.result[0].avatar = res.data.modules[0].data.result[0].avatar

      //生成卖出数量文字
      let soldCountTxt = '';
      if (goodInfo.purchaseList && goodInfo.purchaseList.total_count>0){
        let soldCount = goodInfo.purchaseList.total_count;
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
  },
  // 跳转
  activityToast: function () {
    wx.navigateTo({
      url: "/pages/webView/webView?url=" + app.globalData.bastUrl + "appv5_1/wxapp/adPage/17&title=夏日饮酒专场"
    })
  },
  onShow: function () {
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
  // 收藏
  addLike: function () {
    if (this.data.goodInfo.is_favorited == 0) {
      req(app.globalData.bastUrl, 'appv2/itemaddfavourite', {
        item_id: this.data.articleId
      }, 'POST').then(res => {
        this.data.goodInfo.is_favorited = 1
        this.setData({
          goodInfo: this.data.goodInfo
        })
      })
    } else {
      req(app.globalData.bastUrl, 'appv2/itemdeletefavourite', {
        item_id: this.data.articleId
      }, 'POST').then(res => {
        this.data.goodInfo.is_favorited = 0
        this.setData({
          goodInfo: this.data.goodInfo
        })
      })
    }
  },
  // 加入购物车
  addChart: function (e) {
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
  addGoodNum: function () {
    const stock = this.data.selectStyleStock
    if (this.data.selectStyleCount == stock) {
      return wx.showToast({
        title: '库存不足，仅剩' + stock + '件',
        icon: 'none',
        duration: 1000
      })
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
    wx.navigateTo({
      url: "/pages/secondLevelChart/secondLevelChart"
    })
  },
  // 跳转商品
  navigateToGoods: function (e) {
    let id = e.target.dataset.id
    const url = '/pages/article/article?id=' + id
    wx.redirectTo({
      url: url
    })
  },
  // 跳转用户
  navigateToUser: function (e) {
    let id = e.target.dataset.id
    let name = e.target.dataset.name
    const url = '/pages/user/user?id=' + id + '&name=' + name
    wx.redirectTo({
      url: url
    })
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
    return '特价活动未开始'
  } else if (end < time) {
    return false
  }
}
