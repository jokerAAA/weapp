// pages/releasesuccess/releasesuccess.js
const tsy = require('../../utils/util.js').tsy;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    this.setData({
      parentgoodsid: options.parentgoodsid,
      id: options.id
    })
    tsy.request({
      url: app.globalData.host + '/user/sell-trade-factory/ok',
      data: {
        parentgoodsid: options.parentgoodsid || 20,
        id: options.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        'X-Requested-With': 'XMLHttpRequest'
      },
      method: 'POST',
      success: function (res) {
        tsy.success(res, function () {
          that.setData({
            goodsname: res.data.data.tradeArr.name,
            goodscode: res.data.data.tradeArr.transactioncode
          })
          if (res.data.data.tradeArr.edit){
            that.setData({
              edit: res.data.data.tradeArr.edit
            })
          }
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
  
  }
})