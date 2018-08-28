// pages/releasesuccess/releasesuccess.js
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
      gameid: options.gameid
    })
    tsy.request({
      url: app.globalData.host + '/user/sell-trade-factory/ok',
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
            goodsList: res.data.data.goodsList
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
  
  }
})