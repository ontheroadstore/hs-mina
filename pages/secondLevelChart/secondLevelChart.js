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
    isIphoneX: app.globalData.isIphoneX      // 是否IphoneX

  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '购物车'
    })
    // 获取购物车商品
    req(app.globalData.bastUrl, 'appv4/getcart', {}).then(res => {
      if (res.status == 1) {
        // 获取数据添加选中状态 左滑选中状态
        // childOrderShow 在传入确认订单页中使用
        let goodList = []
        res.data.cart.forEach(function (item, index) {
          item['selectStatus'] = false
          item['childOrderShow'] = false
          item['seller_avatar'] = util.singleUserAvatarTransform(item['seller_avatar'])
          item.item.forEach(function (good, i) {
            good['selectStatus'] = false
            good['slideStatus'] = false
          })
          goodList.push(item)
        })
        this.setData({
          selectAllStatus: false,
          totalPrice: 0,
          goodList: goodList,
          randomGoods: util.userAvatarTransform(res.data.recommended, 'user_avatar')
        })
      }
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
          goodList: goodList
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
    const that = this
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
          goodList: goodList
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
          good['slideStatus'] = true
        } else if (good.id == orderId && numX < -60) {
          good['slideStatus'] = false
        } else {
          good['slideStatus'] = false
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
                goodList: goodList
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
    wx.navigateTo({
      url: '/pages/createOrder/createOrder?type=1',
    })
  },
  // 全部选择商品
  selectAll: function () {
    if (this.data.selectAllStatus) {
      let status = SetStatus(this.data.goodList, false, 0, 0)
      this.setData({
        goodList: status.data,
        selectAllStatus: false,
        totalPrice: countTotalPrice(this.data.goodList)
      })
    } else {
      let status = SetStatus(this.data.goodList, true, 0, 0)

      this.setData({
        goodList: status.data,
        selectAllStatus: true,
        totalPrice: countTotalPrice(this.data.goodList)
      })
    }
  },
  // 单个选择商品
  selectSingle: function (e) {
    let goodid = e.target.dataset.orderid
    let status = SetStatus(this.data.goodList, true, 0, goodid)
    this.setData({
      goodList: status.data,
      selectAllStatus: status.selectAllStatus,
      totalPrice: countTotalPrice(this.data.goodList)
    })
  },
  // 用户选择商品
  selectUser: function (e) {
    let userid = e.target.dataset.userid
    let status = SetStatus(this.data.goodList, true, userid, 0)
    this.setData({
      goodList: status.data,
      selectAllStatus: status.selectAllStatus,
      totalPrice: countTotalPrice(this.data.goodList)
    })
  },
  // 商品跳转article
  navigateToGoods: function (e) {
    let id = e.target.dataset.goodid
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
  if (userId != 0) {
    data.forEach(function (item, index) {
      if (item.seller_user_id == userId && item['selectStatus']) {
        item['selectStatus'] = false
        item['childOrderShow'] = false
        item.item.forEach(function (good, i) {
          good['selectStatus'] = false
        })
      } else if (item.seller_user_id == userId && !item['selectStatus']) {
        item['selectStatus'] = true
        item['childOrderShow'] = true
        item.item.forEach(function (good, i) {
          good['selectStatus'] = true
        })
      }
      // 检测是否有未选(设置全选)
      if (!item['selectStatus']) {
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

function countTotalPrice(data) {
  var totalPrice = 0
  data.forEach(function (item, index) {
    item.item.forEach(function (good, i) {
      if (good['selectStatus']) {
        totalPrice += good['numbers'] * good['price']
      }
    })
  })
  return totalPrice
}
