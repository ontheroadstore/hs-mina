const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'


Page({

  data: {
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
    ifGoBind: true //未绑定是否去绑定
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
  onShow: function() {

    //判断是否登录 
    app.ifLogin(()=>{

    },()=>{
      if (this.data.ifGoBind === false) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
      this.setData({
        ifGoBind: !this.data.ifGoBind,
      })
    },this.data.ifGoBind);

    const that = this
    that.setData({
      getUserInfoStatus: false
    })
    wx.getUserInfo({
      success: function() {
        // 获取购物车商品
        req(app.globalData.bastUrl, 'appv4/getcart', {}).then(res => {
          if (res.status == 1) {
            // 获取数据添加选中状态 左滑选中状态
            // childOrderShow 在传入确认订单页中使用
            // animation 左滑动画
            let goodList = []
            res.data.cart.forEach(function (item, index) {
              item['selectStatus'] = false
              item['childOrderShow'] = false
              item['seller_avatar'] = item['seller_avatar']
              item.item.forEach(function (good, i) {
                good['selectStatus'] = false
                good['animation'] = {}
                if (good.postsRestrictionNumber || good.goodsRestrictionNumber){
                  good.limitBuy = true;
                  if (good.goodsRestrictionNumber){
                    good.limitNumber = good.goodsRestrictionNumber;//商品款式限购数量
                    good.remainBuy = good.goodsRestrictionNumber - good.goodsAlreadyNumber;//款式剩余购买数量
                  } else if (good.postsRestrictionNumber){
                    good.limitNumber = good.postsRestrictionNumber;//商品限购数量
                    good.remainBuy = good.postsRestrictionNumber - good.postsAlreadyNumber;//商品剩余购买数量
                  }
                }
                if (good['special_offer_end']) {
                  good['special_offer_end'] = formTime(good['special_offer_end'])
                }
              })
              goodList.push(item)
            })
            that.setData({
              selectAllStatus: false,
              totalPrice: 0,
              goodList: goodList,
              randomGoods: res.data.recommended
            })
          }
        })
      },
      fail: function() {
        that.setData({
          getUserInfoStatus: true
        })
      }
    })
  },
  // 用户授权
  bindgetuserinfo: function(res) {
    console.log(res)
    if (res.detail.errMsg == 'getUserInfo:ok'){
      this.setData({
        getUserInfoStatus: true
      })
      app.login(this.onShow)
    }
  },
  repulseGetUserInfo: function() {
    this.setData({
      getUserInfoStatus: false
    })
  },
  // 修改购物车数量 需要更新服务端存储数据，修改成功后再更新显示数量
  subNum: function(e) {
    const orderId = e.target.dataset.orderid
    const that = this
    req(app.globalData.bastUrl, 'appv5/cart/' + orderId, {
      increase: -1
    }, "POST", true).then(res => {
      if(res.status == 1){
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
          totalPrice: countTotalPrice(goodList)
        })
      }else{
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 500
        })
      }
    })
  },
  addNum: function(e) {
    const orderId = e.target.dataset.orderid
    const that = this;
    let goodId = e.target.dataset.goodid;//商品ID
    let goodList = that.data.goodList;
    let itemIndex = e.target.dataset.itemindex;
    let goodIndex = e.target.dataset.index;
    let goodMsg = goodList[itemIndex].item[goodIndex];
    let limitBuyNumber = 0;
    if (goodMsg.goodsRestrictionNumber){
      //判断款式是否限购
      if (goodMsg.numbers < goodMsg.remainBuy){
        that.calcGoodNum(that,orderId)
      }else{
        wx.showToast({
          icon:'none',
          title: '您最多可以购买' + goodMsg.remainBuy+'件',
        })
      }
    } else if (goodMsg.postsRestrictionNumber){
      //判断商品是否限购
      limitBuyNumber = goodMsg.numbers+1;
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
      }else{
        that.calcGoodNum(that, orderId)
      }
    }else {
      that.calcGoodNum(that, orderId)
    }
  },
  //点击商品加号时请求接口
  calcGoodNum: function(that,orderId){
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
          totalPrice: countTotalPrice(goodList)
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
  leftTouchStart: function(e) {
    this.setData({
      startLocationX: e.touches[0].pageX,
      startLocationY: e.touches[0].pageY
    })
  },
  // 左滑中
  leftTouchMove: function(e) {
    const that = this
    this.setData({
      moveLocationX: e.touches[0].pageX,
      moveLocationY: e.touches[0].pageY
    })
    const numX = this.data.startLocationX - this.data.moveLocationX
    const numY = this.data.startLocationY - this.data.moveLocationY
    if (Math.abs(numY) < Math.abs(numX)){
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
        } else{
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
  touchEnd: function() {
    this.setData({
      startLocationX: 0,
      moveLocationX: 0,
      startLocationY: 0,
      moveLocationY: 0,
      scrollStatus: true
    })
  },
  // 删除购物车商品
  deleteGood: function(e) {
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
            if(res.status == 1){
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
                totalPrice: countTotalPrice(goodList)
              })
            }else{
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
  navigatorToCreateOrder: function() {
    // 将数据缓存
    if (this.data.totalPrice == 0){
      return wx.showToast({
        title: '请选择购买的商品',
        icon: 'none',
        duration: 1000
      })
    }
    wx.setStorageSync('chartData', this.data.goodList)
    wx.navigateTo({
      url: '/pages/createOrder/createOrder?type=1',
    })
  },
  // 全部选择商品
  selectAll: function () {
    let goodList = this.data.goodList;
    let limitBuyNumber = 0;
    let json = {};
    if (this.data.selectAllStatus){
      let status = SetStatus(this.data.goodList, false, 0, 0)
      this.setData({
        goodList: status.data,
        selectAllStatus: false,
        totalPrice: countTotalPrice(this.data.goodList)
      })
    }else{
      goodList.forEach((item, index) => {//遍历卖家
        json = this.checkLimitBuy(item)
      })
      console.log(json)
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
      let status = SetStatus(this.data.goodList, true, 0, 0);
      this.setData({
        goodList: status.data,
        selectAllStatus: true,
        totalPrice: countTotalPrice(this.data.goodList)
      })
    }
  },
  // 单个选择商品
  selectSingle: function (e) {
    let remainbuy = e.target.dataset.remainbuy;
    let itemIndex = e.target.dataset.itemindex;
    let goodIndex = e.target.dataset.index;
    let goodsArr = this.data.goodList[itemIndex];
    let goodId = e.target.dataset.goodid;//商品ID
    let singleStatus = false;//判断是否可以选中
    let limitBuyNumber = 0;
    let orderid = e.target.dataset.orderid
    if (goodsArr.item[goodIndex].selectStatus == true){
      
      let status = SetStatus(this.data.goodList, true, 0, orderid)
      this.setData({
        goodList: status.data,
        selectAllStatus: status.selectAllStatus,
        totalPrice: countTotalPrice(this.data.goodList)
      })
    }else{
      limitBuyNumber = goodsArr.item[goodIndex].numbers;
      goodsArr.item.forEach((item, index) => {
        if (item.item_id == goodId && index != goodIndex){
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
      }else{
        let status = SetStatus(this.data.goodList, true, 0, orderid)
        this.setData({
          goodList: status.data,
          selectAllStatus: status.selectAllStatus,
          totalPrice: countTotalPrice(this.data.goodList)
        })
      }
    }
  },
  // 用户选择商品
  selectUser: function (e) {
    let goodList = this.data.goodList;
    let sellerIndex = e.target.dataset.index;
    
    let limitBuyNumber = 0;
    let json = {};
    let arr = goodList[sellerIndex];
    json = this.checkLimitBuy(arr)
    for(let name in json){
      if(json[name] > json.remainBuy){
        wx.showModal({
          title: '限购提醒',
          content: json.name+'超过限购数量',
          showCancel: false
        })
        return
      }
    }
    let userid = e.target.dataset.userid
    let status = SetStatus(this.data.goodList, true, userid, 0)
    this.setData({
      goodList: status.data,
      selectAllStatus: status.selectAllStatus,
      totalPrice: countTotalPrice(this.data.goodList)
    })
  },
  // 判断商品是否超过限购数量
  checkLimitBuy: function(arr){
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
    const url = '/pages/article/article?id=' + id
    wx.navigateTo({
      url: url
    })
  },
  // 卖家中心跳转user
  navigateToUser: function (e) {
    let id = e.target.dataset.id
    let name = e.target.dataset.name
    const url = '/pages/user/user?id=' + id + '&name=' + name
    wx.navigateTo({
      url: url
    })
  }
})

// 设置选中状态
function SetStatus(data, status, userId, orderId) {
  var newData = []
  var selectAllStatus = true
  // 传入用户id 将当前传入用户下的所有商品选中 childOrderShow
  if (userId != 0){
    data.forEach(function (item, index) {
      let checkAll = false;
      if (item.seller_user_id == userId && item['selectStatus']){
        item['selectStatus'] = false
        item['childOrderShow'] = false
        item.item.forEach(function (good, i) {
          good['selectStatus'] = false
        })
      } else if (item.seller_user_id == userId && !item['selectStatus']){
        // console.log(item)
        // item.item.forEach((good,index) => {
        //   if(good.remainBuy && good.remainBuy < 1){
        //     let goodsName = good.item_name;
        //     wx.showModal({
        //       title: '限购提醒',
        //       content: goodsName + '超过限购数量，请修改',
        //     })
        //     return 
        //   }
        // })
        for (let i = 0; i < item.item.length; i++){
          if (item.item[i].remainBuy != undefined && item.item[i].remainBuy < 1){
            let goodsName = item.item[i].item_name;
            console.log(1111)
            wx.showModal({
              title: '限购提醒',
              content: goodsName + '超过限购数量，请修改',
              showCancel:false
            })
            break;
          }else{
            checkAll = true;
            item.item[i].selectStatus = true
          }
        }
        if(checkAll == true){
          item['selectStatus'] = true
          item['childOrderShow'] = true
        }
        
        // item.item.forEach(function (good, i) {
        //   good['selectStatus'] = true
        // })
      }
      // 检测是否有未选(设置全选)
      if (!item['selectStatus']){
        selectAllStatus = false
      }
      newData.push(item)
    })
  }
  // 传入商品id 将当前商品选中
  if (orderId != 0) {
    data.forEach(function (item, index) {
      
      // 用户选中状态userSelectStatus 全部选中为true 一个没选中为false
      // 用户下商品选中状态childOrderShow 有一个选中为true 一个都没有显示false
      let userSelectStatus = true
      let childOrderShow = false
      item.item.forEach(function (good, i) {
        if (good.id == orderId && good['selectStatus']){
          good['selectStatus'] = false
          console.log('没选中')
        } else if (good.id == orderId && !good['selectStatus']){
          console.log('选中')
          good['selectStatus'] = true
        }
        // 检测是否有未选
        if (!good['selectStatus']) {
          selectAllStatus = false
          userSelectStatus = false
        }else{
          childOrderShow = true
        }
      })
      if (childOrderShow){
        item['childOrderShow'] = true
      }else{
        item['childOrderShow'] = false
      }

      if (userSelectStatus){
        item['selectStatus'] = true
      }else{
        item['selectStatus'] = false
      }
      // 检测是否有未选(设置全选)
      if (!item['selectStatus']) {
        selectAllStatus = false
      }
      newData.push(item)
    })
  }
  if (orderId == 0 && userId == 0){
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

function countTotalPrice(data) {
  var totalPrice = 0
  data.forEach(function (item, index) {
    item.item.forEach(function (good, i) {
      if (good['selectStatus'] && good['is_sku_deleted'] == 0 && good['remain'] > 0 && !good['special_offer_end']){
        totalPrice += good['numbers'] * good['price']
      } else if (good['selectStatus'] && good['is_sku_deleted'] == 0 && good['remain'] > 0 && good['special_offer_end']){
        totalPrice += good['numbers'] * good['special_offer_price']
      }
    })
  })
  return totalPrice
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

