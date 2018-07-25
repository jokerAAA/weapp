// pages/gamesearch/gamesearch.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gamelist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      keyvalue: options.keyword,
      page: options.page
    })

    this.addmore();
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
    this.addmore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  addmore: function(){
    var that = this,
      page = this.data.page;
    wx.request({
      url: app.globalData.host + '/indexpage/search/game',
      data: {
        page:this.data.page,
        keyword: page
      },
      success: function (res) {
        var newgamelist = res.data.data.list;
        page++;
        that.setData({
          gamelist: that.data.gamelist.concat(newgamelist),
          page: page
        })
      }
    })
  },
  //点击搜索框
  gosearch: function(){
    wx.navigateTo({
      url: '/pages/search/search'
    })
  }
})