// pages/selltrade/selltrade.js
const tsy = require('../../utils/util.js').tsy;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    sellmodeList: [],
    sell: {
      parentid: '',
      goodsid: '',
      sellmode: '',
      client: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    this.setData({
      gameid: options.gameid
    })
    tsy.request({
      url: app.globalData.host + '/user/selltrade/sellinfo',
      data: {
        gameid: options.gameid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'X-Requested-With': 'XMLHttpRequest'
      },
      method: 'GET',
      success: function (res) {
        tsy.success(res, function () {
          that.setData({
            goodsparent: res.data.data.goodsparent,
            goodsList: res.data.data.goodsList,
            gameid: res.data.data.gameid,
            gamename: res.data.data.gamename,
            clientList: res.data.data.clientList
          })
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //  点击确定事件  
  bindParentidChange: function (e) {
    console.log(e)
    // console.log(this.data.goodsparent[e.detail.value].goodsid)
    this.setData({
      'sell.parentindex': e.detail.value,
      'sell.parentid': this.data.goodsparent[e.detail.value].goodsid
    })
  },
  bindGoodsidChange: function (e) {
    // console.log(this.data.goodsList[this.data.sell.parentid][e.detail.value].goodsid)
    this.setData({
      'sell.goodsindex': e.detail.value,
      'sell.goodsid': this.data.goodsList[this.data.sell.parentid][e.detail.value].goodsid
    })
  },
  bindSellmodeChange: function (e) {
    console.log(e)
    const that = this
    this.setData({
      'sell.sellmode': e.detail.value,
      'sell.sellmodeid': this.data.sellmodeList[e.detail.value].sellmodeid
    })
  },
  bindClientChange: function (e) {
    console.log(e)
    const that = this
    this.setData({
      'sell.client': e.detail.value,
      'sell.clientid': this.data.clientList[e.detail.value].clientid,
      'sell.clientname': this.data.clientList[e.detail.value].clientname
    })

    // 获取出售方式
    tsy.request({
      url: app.globalData.host + '/user/selltrade/ajax-get-sellmode',
      data: {
        gameid: this.data.gameid,
        clientid: this.data.sell.clientid,
      }, 
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'X-Requested-With': 'XMLHttpRequest'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        tsy.success(res, function () {
          that.setData({
            sellmodeList: res.data.data
          })
        })

      }
    })
  },
  // 表单提交
  submitForm: function (event) {
    const that = this
    const params = event.detail.value
    let flag = this.data.flag;

    console.log(params)

    if (!flag) return;

    if (!this.data.sell.parentid) {
      wx.showToast({
        title: '请选择一个交易分类。',
        icon: 'none'
      })
      return false;
    }
    if (!this.data.sell.goodsid) {
      wx.showToast({
        title: '请选择一个交易类型。',
        icon: 'none'
      })
      return false;
    }
    if (!this.data.sell.sellmodeid) {
      wx.showToast({
        title: '请选择一个出售方式。',
        icon: 'none'
      })
      return false;
    }
    if (!this.data.sell.clientid) {
      wx.showToast({
        title: '请选择一个客户端。',
        icon: 'none'
      })
      return false;
    }

    this.setData({
      flag: false
    })

    //提交
    tsy.request({
      url: app.globalData.host + '/user/sell-trade-factory/index',
      data: params,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        that.setData({
          flag: true
        })
        tsy.success(res, function () {
          wx.redirectTo({
            url: "/pages/traderelease/traderelease?parentgoodsid=" + that.data.sell.parentid + "&goodsid=" + that.data.sell.goodsid + "&gameid=" + that.data.gameid + "&gamename=" + that.data.gamename + "&clientid=" + that.data.sell.clientid + "&clientname=" + that.data.sell.clientname + "&sellmode=" + that.data.sell.sellmode
          })
        })

      }
    })
  }
})